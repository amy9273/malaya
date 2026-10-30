'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { validateAuthCredentials } from '@/lib/auth/validation';
import { prisma } from '@/lib/db/prisma';

export async function signInAction(
  _prevState: unknown,
  formData: FormData,
): Promise<{ error?: string }> {
  const email = formData.get('email');
  const password = formData.get('password');

  const validation = validateAuthCredentials({ email, password });
  if (!validation.success || !validation.data) {
    return { error: validation.error || 'Invalid credentials provided.' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: validation.data.email,
    password: validation.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/');
}

export async function signUpAction(
  _prevState: unknown,
  formData: FormData,
): Promise<{ error?: string; successMessage?: string }> {
  const email = formData.get('email');
  const password = formData.get('password');
  const displayName = formData.get('displayName') || undefined;

  const validation = validateAuthCredentials({
    email,
    password,
    displayName,
  });

  if (!validation.success || !validation.data) {
    return { error: validation.error || 'Invalid registration details.' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: validation.data.email,
    password: validation.data.password,
    options: {
      data: {
        displayName: validation.data.displayName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // If user is returned and database connection string is active, sync user record
  if (data.user && process.env.DATABASE_URL) {
    try {
      await prisma.user.upsert({
        where: { supabaseId: data.user.id },
        update: {
          email: data.user.email ?? validation.data.email,
          displayName: validation.data.displayName,
        },
        create: {
          supabaseId: data.user.id,
          email: data.user.email ?? validation.data.email,
          displayName: validation.data.displayName,
        },
      });
    } catch {
      // Safe fallback if database sync encounters connection timeout
    }
  }

  if (data.session) {
    redirect('/');
  }

  return {
    successMessage: 'Account created! Please check your email to verify your address.',
  };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
