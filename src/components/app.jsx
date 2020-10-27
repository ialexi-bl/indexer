import React from 'react'
import { TitleBar } from 'electron-react-titlebar'
import { Provider as ReduxProvider, connect } from 'react-redux'
import { createStore, setPreferences, initialState } from 'services/store'
import ScrollableContainer from './scrollable-container'
import Workspace from './workspace'
import { useTranslation } from 'react-i18next'
import ImportModal from './import-modal'
import CreateFileModal from './create-file-modal'
import classNames from 'classnames'
import { remote as electron, ipcRenderer } from 'electron'
import { AboutModal, HelpModal, LanguageModal } from './main-modals.jsx'
import { Slide, toast } from 'react-toastify'
import TableController from '../services/TableController'
import Modal from './modal'
import { Button, ButtonsRow, FileChoiceRow, Form } from './form'
import { OrderModal } from './main-modals'
import KeyBinding from '../services/KeyBinding'
import 'electron-react-titlebar/assets/style.css'
import 'react-web-tabs/dist/react-web-tabs.css'
import 'react-toastify/dist/ReactToastify.css'
import 'styles/title-bar.scss'
import 'styles/app.scss'

toast.configure()

function initStore() {
  const str = JSON.stringify

  const notGuest = localStorage.getItem('notGuest')

  // Reading
  if (notGuest && JSON.parse(notGuest)) {
    const newPreferences = {}

    for (const key of Object.keys(initialState)) {
      const value = localStorage.getItem(key)

      if (value)
        try {
          newPreferences[key] = JSON.parse(value)
          continue
        } catch (e) {}

      localStorage.setItem(key, str(initialState[key]))
    }

    return {
      isGuest: false,
      ...newPreferences,
    }
  }
  // Initialization
  else {
    localStorage.setItem('notGuest', str(true))
    for (const key of Object.keys(initialState)) {
      localStorage.setItem(key, str(initialState[key]))
    }
    return {
      isGuest: true,
    }
  }
}

export default function ReduxWrapper() {
  const store = React.useMemo(
    () => createStore({ ...initialState, ...initStore() }),
    []
  )
  return (
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
  )
}
window.React = React

const App = connect((preferences) => ({ preferences }))(function App({
  preferences,
  dispatch,
}) {
  const { t, i18n } = useTranslation()
  const [modal, setModal] = React.useState(
    preferences.isGuest ? 'about_guest' : null
  )
  const [nightMode, setNightMode] = React.useState(preferences.nightMode)
  const [unloading, setUnloading] = React.useState(false)
  const closeModal = React.useCallback(() => setModal(null), [])

  console.log(preferences)

  const menu = React.useMemo(
    () => [
      {
        label: t('File'),
        submenu: [
          {
            label: t('New'),
            click: () => setModal('create_file'),
          },
          {
            label: t('Import'),
            click: () => setModal('import_file'),
          },
          {
            type: 'separator',
          },
          {
            label: t('Preview'),
            click: () => ipcRenderer.send('open-preview-window'),
          },
          {
            label: t('Save'),
            click: () => TableController.save(t),
          },
          {
            label: t('Save as') + '...',
            click: () => TableController.save(t, false),
          },
        ],
      },
      {
        label: t('Edit'),
        submenu: [
          {
            label: t('Fields order'),
            click: () => setModal('order'),
          },
        ],
      },
      {
        label: t('View'),
        submenu: [
          {
            label: t('Pin on top of other windows'),
            type: 'checkbox',
            checked: preferences.pin,
            click: () => {
              const state = !preferences.pin
              localStorage.setItem('pin', String(state))
              dispatch(setPreferences({ pin: state }))
            },
          },
          {
            label: t('Night mode'),
            type: 'checkbox',
            checked: preferences.nightMode,
            click: () => {
              const state = !preferences.nightMode
              localStorage.setItem('nightMode', String(state))
              dispatch(setPreferences({ nightMode: state }))
            },
          },
          {
            type: 'separator',
          },
          {
            label: `${t('Language')}${
              i18n.language === 'en' ? '' : ' | Language'
            }`,
            click: () => setModal('language'),
          },
        ],
      },
      {
        label: t('Help'),
        submenu: [
          {
            label: t('About'),
            click: () => setModal('about'),
          },
          {
            label: t('Help'),
            click: () => setModal('help'),
          },
        ],
      },
    ],
    [t, dispatch, i18n.language, preferences.nightMode, preferences.pin]
  )

  React.useEffect(() => {
    TableController.init()
    KeyBinding.init()

    function onBeforeUnload() {
      console.log('beforeunload')
      if (!TableController.saved) {
        setUnloading(true)
        return false
      } else {
        window.removeEventListener('beforeunload', onBeforeUnload)
        // return true

        electron.getCurrentWindow().close()
      }
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [])

  React.useEffect(() => {
    function onKeyDown(e) {
      if (KeyBinding.get('save').test(e)) {
        toast.dismiss('saveNotification')
        TableController.save(t)
          .then(() =>
            toast.info(t('Table was saved'), {
              position: toast.POSITION.TOP_CENTER,
              autoClose: 2000,
              hideProgressBar: true,
              transition: Slide,
              toastId: 'saveNotification',
              className: 'App__Toast',
            })
          )
          .catch((e) => {
            toast.error(`Couldn't save file: ${e}`)
          })
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [t])

  React.useEffect(() => {
    setNightMode(preferences.nightMode)
  }, [preferences.nightMode])
  React.useEffect(() => {
    electron.getCurrentWindow().setAlwaysOnTop(preferences.pin)
  }, [preferences.pin])

  return (
    <div className={classNames('App', { App_night: nightMode })}>
      <TitleBar className={'TitleBar'} menu={menu} />
      <ScrollableContainer>
        <Workspace className={'App__Workspace'} />
      </ScrollableContainer>
      {/* <SettingsModal isOpen={modal === 'settings'} closeModal={closeModal}/> */}
      <AboutModal
        isOpen={['about', 'about_guest'].includes(modal)}
        isGuest={modal === 'about_guest'}
        closeModal={closeModal}
      />
      <ImportModal isOpen={modal === 'import_file'} closeModal={closeModal} />
      <CreateFileModal
        isOpen={modal === 'create_file'}
        closeModal={closeModal}
      />
      <LanguageModal isOpen={modal === 'language'} closeModal={closeModal} />
      <HelpModal isOpen={modal === 'help'} closeModal={closeModal} />
      <OrderModal isOpen={modal === 'order'} closeModal={closeModal} />
      <UnloadingModal
        isOpen={unloading}
        closeModal={() => setUnloading(false)}
      />
    </div>
  )
})

function UnloadingModal({ closeModal, ...props }) {
  const { t } = useTranslation()

  const [exportPath, setExportPath] = React.useState(
    TableController.currentDocument
  )

  const onSaveDestinationChoice = React.useCallback(() => {
    electron.dialog
      .showSaveDialog(electron.getCurrentWindow(), {
        title: t('Import file'),
        filters: [
          { name: t('Microsoft Excel table'), extensions: ['xlsx', 'xls'] },
        ],
        buttonLabel: t('Choose'),
        defaultPath: `${t('Document')}.xlsx`,
      })
      .then(({ filePath: path }) => {
        if (path) {
          setExportPath(path)
        }
      })
  }, [t])

  const closeWindow = React.useCallback(() => {
    electron.getCurrentWindow().destroy()
  }, [])

  const onSave = React.useCallback(() => {
    TableController.save(t).then(closeWindow)
  }, [closeWindow, t])

  return (
    <Modal {...props} closeModal={closeModal}>
      <p>
        {t(
          'If you continue, all unsaved changes will be lost. Do you want to save them?'
        )}
      </p>
      <Form>
        <FileChoiceRow
          label={t('Export path')}
          onFileChoice={onSaveDestinationChoice}
          value={exportPath}
        />
        <ButtonsRow>
          <Button label={t('Yes')} onClick={onSave} />
          <Button label={t('No')} onClick={closeWindow} />
          <Button label={t('Cancel')} onClick={closeModal} />
        </ButtonsRow>
      </Form>
    </Modal>
  )
}
