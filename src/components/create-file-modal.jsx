import React from 'react'
import Modal from './modal'
import { Button, ButtonsRow, FileChoiceRow, Form, FormTitle } from './form'
import { useTranslation } from 'react-i18next'
import { remote as electron } from 'electron'
import 'styles/import-modal.scss'
import TableController from '../services/TableController'
import Loading from './loading'

export default function CreateFileModal({ closeModal, ...props }) {
  const { t } = useTranslation()

  // File choice
  const [path, setPath] = React.useState(
    localStorage.getItem('lastImport') || ''
  )
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState('')
  const [messageModalOpen, setMessageModalOpen] = React.useState(false)
  const [
    messageCloseHandler,
    setMessageCloseHandler,
  ] = React.useState(() => () => {})
  const [notificationOpen, setNotificationOpen] = React.useState(false)

  const closeNotificationModal = () => setNotificationOpen(false)
  const [exportPath, setExportPath] = React.useState(
    TableController.currentDocument
  )

  const onFileChoice = () => {
    electron.dialog
      .showSaveDialog(electron.getCurrentWindow(), {
        title: t('Create file'),
        filters: [
          { name: t('Microsoft Excel table'), extensions: ['xlsx', 'xls'] },
        ],
        properties: ['openFile'],
        buttonLabel: t('Choose'),
        defaultPath: `${t('Document')}.xlsx`,
      })
      .then(({ filePath: path }) => {
        if (path) {
          setPath(path)
          localStorage.setItem('lastImport', path)
        }
      })
  }

  const onSaveDestinationChoice = () => {
    electron.dialog
      .showSaveDialog(electron.getCurrentWindow(), {
        title: t('Save document'),
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
  }

  const createDocument = async (shouldSave) => {
    setLoading(true)
    closeNotificationModal()
    try {
      if (shouldSave) await TableController.export(exportPath)
      await TableController.createDocument(path)
      setMessage(t('Document created successfully'))
      setMessageCloseHandler(() => () => {
        setMessageModalOpen(false)
        closeModal()
      })
    } catch (e) {
      console.error(e)
      setMessage(
        `${t('An error happened while creating a file')}: ${e.message}`
      )
      setMessageCloseHandler(() => () => setMessageModalOpen(false))
    } finally {
      setLoading(false)
      setMessageModalOpen(true)
    }
  }
  const onCreate = () => {
    if (!path.trim()) return
    console.dir(TableController)
    TableController.saved ? createDocument(false) : setNotificationOpen(true)
  }

  return (
    <Modal closeModal={closeModal} {...props}>
      <Form>
        <FormTitle level={3}>{t('Create file')}</FormTitle>
        <FileChoiceRow
          value={path}
          label={t('Choose file')}
          onFileChoice={onFileChoice}
        />
        <ButtonsRow>
          <Button label={t('Create')} disabled={!path} onClick={onCreate} />
        </ButtonsRow>
        <Loading visible={loading} />
      </Form>
      {/* Save notification modal */}
      <Modal isOpen={notificationOpen} closeModal={closeNotificationModal}>
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
            <Button label={t('Yes')} onClick={() => createDocument(true)} />
            <Button label={t('No')} onClick={() => createDocument(false)} />
            <Button label={t('Cancel')} onClick={closeNotificationModal} />
          </ButtonsRow>
        </Form>
      </Modal>
      {/* Message modal */}
      <Modal isOpen={messageModalOpen} closeModal={messageCloseHandler}>
        <p>{message}</p>
        <ButtonsRow>
          <Button label={t('Ok')} onClick={messageCloseHandler} />
        </ButtonsRow>
      </Modal>
    </Modal>
  )
}
