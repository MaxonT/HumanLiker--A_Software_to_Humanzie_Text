// Title: i18n init
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import zh from './locales/zh.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import hi from './locales/hi.json'
import ar from './locales/ar.json'
import pt from './locales/pt.json'
import ja from './locales/ja.json'
import ko from './locales/ko.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      zh: { translation: zh },
      es: { translation: es },
      fr: { translation: fr },
      hi: { translation: hi },
      ar: { translation: ar },
      pt: { translation: pt },
      ja: { translation: ja },
      ko: { translation: ko },
    }
  })

export default i18n
