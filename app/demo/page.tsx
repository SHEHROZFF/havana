import { I18nProvider } from '@/lib/i18n/context'
import TranslationDemo from '@/components/demo/TranslationDemo'

export default function DemoPage() {
  return (
    <I18nProvider>
      <TranslationDemo />
    </I18nProvider>
  )
}