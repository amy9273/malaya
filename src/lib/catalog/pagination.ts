export function buildCatalogPageUrl(page: number, tag?: string, genre?: string): string {
  const params = new URLSearchParams();
  if (tag) params.set('tag', tag);
  if (genre) params.set('genre', genre);
  if (page > 1) params.set('page', page.toString());

  const query = params.toString();
  return query ? `/?${query}` : '/';
}
