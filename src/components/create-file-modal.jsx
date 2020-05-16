import React from 'react'
import Modal from './modal'
import { Button, ButtonsRow, FileChoiceRow, Form, FormTitle } from './form'
import { useTranslation } from 'react-i18next'
import { remote as electron } from 'electron'
import 'styles/import-modal.scss'
import TableController from '../services/TableController'
import Loading from './loading'

export default function CreateFileModal({ closeModal, ...props }) {
  const { t, i18n } = useTranslation(),
    // File choice
    [path, setPath] = React.useState(localStorage.getItem('lastImport') || ''),
    [loading, setLoading] = React.useState(false),
    [message, setMessage] = React.useState(''),
    [messageModalOpen, setMessageModalOpen] = React.useState(false),
    [
      messageCloseHandler,
      setMessageCloseHandler,
    ] = React.useState(() => () => {}),
    [notificationOpen, setNotificationOpen] = React.useState(false),
    closeNotificationModal = React.useCallback(
      () => setNotificationOpen(false),
      []
    ),
    [exportPath, setExportPath] = React.useState(
      TableController.currentDocument
    ),
    onFileChoice = React.useCallback(() => {
      electron.dialog.showSaveDialog(
        electron.getCurrentWindow(),
        {
          title: t('Create file'),
          filters: [
            { name: t('Microsoft Excel table'), extensions: ['xlsx', 'xls'] },
          ],
          properties: ['openFile'],
          buttonLabel: t('Choose'),
          defaultPath: `${t('Document')}.xlsx`,
        },
        (path) => {
          if (path) {
            setPath(path)
            localStorage.setItem('lastImport', path)
          }
        }
      )
    }, [i18n.language]),
    onSaveDestinationChoice = React.useCallback(() => {
      electron.dialog.showSaveDialog(
        electron.getCurrentWindow(),
        {
          title: t('Save document'),
          filters: [
            { name: t('Microsoft Excel table'), extensions: ['xlsx', 'xls'] },
          ],
          buttonLabel: t('Choose'),
          defaultPath: `${t('Document')}.xlsx`,
        },
        (path) => {
          if (path) {
            setExportPath(path)
          }
        }
      )
    }, [i18n.language]),
    importDocument = React.useCallback(
      async (shouldSave) => {
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
      },
      [i18n.language, path]
    ),
    onImport = React.useCallback(() => {
      if (!path.trim()) return
      TableController.saved ? setNotificationOpen(true) : importDocument(false)
    }, [path])

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
          <Button label={t('Create')} disabled={!path} onClick={onImport} />
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
            <Button label={t('Yes')} onClick={importDocument.bind({}, true)} />
            <Button label={t('No')} onClick={importDocument.bind({}, false)} />
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
