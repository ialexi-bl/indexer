import en from './en'
import pl from './pl'
import ru from './ru'
import fr from './fr'

export default {
  en: { translation: en },
  pl: { translation: pl },
  ru: { translation: ru },
  fr: { translation: fr },
}

export const languageSelectOptions = [
  { value: 'en', label: 'English' },
  { value: 'pl', label: 'Polski' },
  { value: 'fr', label: 'Français' },
  { value: 'ru', label: 'Русский' },
]
