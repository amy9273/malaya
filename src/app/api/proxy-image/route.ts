import { NextRequest, NextResponse } from 'next/server';
import {
  validateProxyUrl,
  validateImageContentType,
} from '@/lib/security/ssrf-validator';

const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024; // 15 Megabytes

export async function GET(req: NextRequest) {
  const urlParam = req.nextUrl.searchParams.get('url');

  // 1. Validate Target URL for SSRF Defense
  const validation = validateProxyUrl(urlParam);
  if (!validation.isValid || !validation.sanitizedUrl) {
    return NextResponse.json(
      { error: validation.error || 'Invalid or forbidden target URL' },
      { status: 400 },
    );
  }

  const targetUrl = validation.sanitizedUrl.toString();

  try {
    // 2. Fetch from upstream with 10-second timeout and required headers
    const upstreamResponse = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'MalayaWebtoonReader/1.0 (https://github.com/amy9273/malaya)',
        Referer: 'https://mangadex.org/',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!upstreamResponse.ok) {
      return NextResponse.json(
        {
          error: `Upstream image server responded with status: ${upstreamResponse.status}`,
        },
        { status: upstreamResponse.status === 404 ? 404 : 502 },
      );
    }

    // 3. Validate Content-Type (Reject SVG and non-images)
    const rawContentType = upstreamResponse.headers.get('content-type');
    if (!validateImageContentType(rawContentType)) {
      return NextResponse.json(
        {
          error:
            'Unsupported media type. Target content is not a permitted raster image.',
        },
        { status: 415 },
      );
    }

    // 4. Validate Content-Length if present
    const contentLength = upstreamResponse.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'Image exceeds maximum allowed size (15MB)' },
        { status: 413 },
      );
    }

    // 5. Stream response with safe caching and anti-MIME-sniffing headers
    const imageBlob = await upstreamResponse.blob();

    return new NextResponse(imageBlob, {
      status: 200,
      headers: {
        'Content-Type': rawContentType || 'image/jpeg',
        'Cache-Control':
          'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    const isTimeout =
      error instanceof Error &&
      (error.name === 'TimeoutError' || error.name === 'AbortError');

    return NextResponse.json(
      {
        error: isTimeout
          ? 'Upstream image fetch timed out (>10s)'
          : 'Failed to retrieve image from upstream server',
      },
      { status: isTimeout ? 504 : 500 },
    );
  }
}
