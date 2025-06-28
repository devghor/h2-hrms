import { useLocale } from 'next-intl';
import LanguageSwitcherSelect from './language-switcher-select';
import { locales } from '@/config/locale';

export default function LanguageSwitcher() {
  const locale = useLocale();

  return (
    <LanguageSwitcherSelect
      defaultValue={locale}
      items={locales}
      label={'Locale'}
    />
  );
}
