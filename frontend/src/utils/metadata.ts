import { appConfig } from '@/config/app';

export function getTitleWithSuffix(title: string) {
  return `${title} - ${appConfig.title}`;
}
