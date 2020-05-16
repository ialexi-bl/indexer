import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from 'i18next-electron-language-detector'
import resources from 'locales'

i18n
    .use(LanguageDetector)
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
      resources,
      
      lng: localStorage.getItem('language'), // || detected language
      whitelist: Object.keys(resources),
      
      keySeparator: false, // we do not use keys in form messages.welcome
      
      interpolation: {
        escapeValue: false // react already safes from xss
      }
    })

export default i18n