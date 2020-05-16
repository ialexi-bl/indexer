import React from 'react'
import { ipcRenderer } from 'electron'
import { Trans, useTranslation } from 'react-i18next'
import Modal, { ModalButtonsRow } from './modal'
import { Button, SelectRow } from './form'
import { connect } from 'react-redux'
import { languageSelectOptions } from '../locales'
import DeadToggleIcon from 'react-ionicons/lib/MdAdd'
import OrderChoice from './order-choice'
import { setPreferences } from '../services/store'

export function AboutModal({ closeModal, isGuest, ...props }) {
  const version = React.useMemo(() => ipcRenderer.sendSync('get-version'), []),
    { t, i18n } = useTranslation(),
    changeLanguage = React.useCallback(
      (option) => i18n.changeLanguage(option.value),
      []
    )

  return (
    <Modal {...props} className={'HelpModal'} closeModal={closeModal}>
      <h3>Indexer v.{version}</h3>
      {isGuest && (
        <>
          <h4>{t('Language')}</h4>
          <p>
            {t(
              'We tried to guess your language automatically. Change it, if it is wrong. You can do it later using the "View" menu.'
            )}
          </p>
          <SelectRow
            options={languageSelectOptions}
            value={languageSelectOptions.find((x) => x.value === i18n.language)}
            onChange={changeLanguage}
          />
          <h4>{t('Info')}</h4>
        </>
      )}
      <Trans i18nKey={'about_article'}>
        <p>
          This is the application, created for Poznań Project workers. Use the
          menus at the top to start working.
        </p>
        <p>
          Notice, that this application was created by amateurs, so it may
          contain bugs.
        </p>
      </Trans>
      <ModalButtonsRow>
        <Button label={t('Ok')} onClick={closeModal} />
      </ModalButtonsRow>
    </Modal>
  )
}

export function HelpModal({ closeModal, ...props }) {
  const { t } = useTranslation()

  return (
    <Modal {...props} className={'HelpModal'} closeModal={closeModal}>
      <Trans i18nKey={'help_article'}>
        <h3>Help</h3>
        <h4>Workspace</h4>
        <p>
          Workspace consists of 3 parts: general, husband and wife data. When
          you save an entry, the year will not change and the document number
          will be increased by one. Use <kbd>Tab</kbd> / <kbd>🡒</kbd> /{' '}
          <kbd>🡓</kbd> to navigate to the next field and <kbd>Shift+Tab</kbd> /{' '}
          <kbd>🡐</kbd> / <kbd>🡑</kbd> - to the previous one. If you navigate
          forwards, while focused on the "Add" button, the row will
          automatically be added to the document.
        </p>
        <p>
          Some fields, that are rarely used, are disabled by default. They will
          enable as soon as you click them or navigate to them with the{' '}
          <kbd>Alt</kbd> key pressed.
        </p>
        <p>
          While editing parents fields, you can mark them as dead by clicking
          the <DeadToggleIcon /> icon on the right, or using the{' '}
          <kbd>Ctrl+D</kbd> key binding.
        </p>
        <h4>Menus</h4>
        <p>
          <em>File</em> menu allows you to created and import microsoft excel
          documents, as well as to save the table, you are currently working on.
          When importing a document, you can specify whether its first line
          contains useful data or column headers. Also you are able to determine
          the order, in which the columns are arranged in your file to import
          everything correctly.
        </p>
        <p>
          Use the <em>Preview</em> function to check if everything is filled
          correctly and edit cells if not. Press <kbd>Ctrl+Z</kbd> to cancel
          changes and <kbd>Ctrl+Y</kbd> / <kbd>Ctrl+Shift+Z</kbd> to restore
          them.
        </p>
        <p>
          <em>View</em> menu lets you turn on night mode, pin the window, so
          that it always appears on top of the others, and change the language.
        </p>

        <h4>Key bindings</h4>
        <p>
          As previously shown, you can use <kbd>Tab</kbd> / <kbd>🡒</kbd> /{' '}
          <kbd>🡓</kbd> and <kbd>Shift+Tab</kbd> / <kbd>🡐</kbd> / <kbd>🡑</kbd> to
          navigate forwards and backwards through fields respectively.
        </p>
        <p>
          Use <kbd>Ctrl+D</kbd> to mark person as dead, where possible.
        </p>
        <p>
          You can erase the field you are working on using <kbd>Ctrl+E</kbd>
        </p>
        <p>
          Press the field name or <kbd>Ctrl+U</kbd> to mark, that you are unsure
          about this field's content.
        </p>
        <p>
          Save table, using <kbd>Ctrl+S</kbd>.
        </p>
      </Trans>
      <ModalButtonsRow>
        <Button label={t('Ok')} onClick={closeModal} />
      </ModalButtonsRow>
    </Modal>
  )
}

export function LanguageModal({ closeModal, ...props }) {
  const { t, i18n } = useTranslation(),
    changeLanguage = React.useCallback((option) => {
      localStorage.setItem('language', option.value)
      i18n.changeLanguage(option.value)
    }, [])

  return (
    <Modal {...props} closeModal={closeModal}>
      <h3>{t('Language')}</h3>
      <SelectRow
        options={languageSelectOptions}
        value={languageSelectOptions.find((x) => x.value === i18n.language)}
        onChange={changeLanguage}
      />
      <ModalButtonsRow>
        <Button label={t('Ok')} onClick={closeModal} />
      </ModalButtonsRow>
    </Modal>
  )
}

const labels = {
  maiden_name: 'Maiden name',
  first_name: 'First name',
  last_name: 'Last name',
  father: 'Father',
  mother: 'Mother',
  other: 'Other',
  alias: 'Alias',
  age: 'Age',
}
const createDefaultOrder = (order, t, isHusband) =>
  order.map((name) => ({
    value: name,
    label: t(labels[name === 'maiden_name' && isHusband ? 'alias' : name], {
      context: isHusband ? 'male' : 'female',
    }),
  }))

function OrderModalPure({ inputsOrder, closeModal, dispatch, ...props }) {
  const { t } = useTranslation(),
    [husbandOrder, setHusbandOrder] = React.useState(
      createDefaultOrder(inputsOrder.husband, t, true)
    ),
    [wifeOrder, setWifeOrder] = React.useState(
      createDefaultOrder(inputsOrder.wife, t)
    ),
    closeHandler = React.useCallback(() => {
      const order = {
        husband: husbandOrder.map((x) => x.value),
        wife: wifeOrder.map((x) => x.value),
      }
      localStorage.setItem('inputsOrder', JSON.stringify(order))
      dispatch(setPreferences({ inputsOrder: order }))
      closeModal()
    }, [husbandOrder, wifeOrder])

  return (
    <Modal {...props} closeModal={closeHandler}>
      <h3>{t('Input fields order')}</h3>
      <p>{t('Drag to specify the order of the input fields.')}</p>
      <h4>{t('Husband')}</h4>
      <OrderChoice
        id={'config-husband-order'}
        onOrderChanged={setHusbandOrder}
        order={husbandOrder}
      />
      <h4>{t('Wife')}</h4>
      <OrderChoice
        id={'config-wife-order'}
        onOrderChanged={setWifeOrder}
        order={wifeOrder}
      />
      <ModalButtonsRow>
        <Button label={t('Ok')} onClick={closeHandler} />
      </ModalButtonsRow>
    </Modal>
  )
}

export const OrderModal = connect(({ inputsOrder }) => ({ inputsOrder }))(
  OrderModalPure
)
