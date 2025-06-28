'use server';

import { LOCALE_COOKIE_NAME, defaultLocale } from '@/config/locale';
import { Locale } from 'next-intl';
import { cookies } from 'next/headers';

export async function getUserLocale() {
  return (await cookies()).get(LOCALE_COOKIE_NAME)?.value || defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  (await cookies()).set(LOCALE_COOKIE_NAME, locale);
}
