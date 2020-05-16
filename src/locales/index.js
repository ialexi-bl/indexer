import en from './en'
import pl from './pl'
import ru from './ru'
// import de from './de'
import fr from './fr'

export default {
  en: { translation: en },
  pl: { translation: pl },
  ru: { translation: ru },
  // de: { translation: de },
  fr: { translation: fr },
}

export const languageSelectOptions = [
  { value: 'en', label: 'English' },
  { value: 'pl', label: 'Polski' },
  { value: 'fr', label: 'Français' },
  // { value: 'de', label: 'Deutsch' },
  { value: 'ru', label: 'Русский' },
]
