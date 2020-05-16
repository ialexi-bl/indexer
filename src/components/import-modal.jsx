import React from 'react'
import Modal from './modal'
import {
  Button,
  ButtonsRow,
  ChoiceRow,
  FileChoiceRow,
  Form,
  FormTitle,
} from './form'
import { useTranslation } from 'react-i18next'
import { remote as electron } from 'electron'
import 'styles/import-modal.scss'
import OrderChoice from './order-choice'
import TableController from '../services/TableController'
import Loading from './loading'

const getDefaultOrder = (t) => [
  { value: 'year', label: t('Year') },
  { value: 'document', label: t('Document') },
  { value: 'first_name', label: t('First name') },
  { value: 'last_name', label: t('Last name') },
  { value: 'maiden_name', label: t('Maiden name') },
  { value: 'age', label: t('Age') },
  { value: 'father', label: t('Father') },
  { value: 'mother', label: t('Mother') },
  { value: 'other', label: t('Other') },
  { value: 'check', label: t('Check') },
]

export default function ImportModal({ closeModal, ...props }) {
  const { t, i18n } = useTranslation(),
    // File choice
    [path, setPath] = React.useState(localStorage.getItem('lastImport') || ''),
    // Headers
    [headers, setHeaders] = React.useState(null),
    toggleHeaders = React.useCallback((state) => setHeaders(state), []),
    // Order
    [order, setOrder] = React.useState(() => getDefaultOrder(t)),
    onOrderChanged = React.useCallback((order) => setOrder(order), []),
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
      electron.dialog.showOpenDialog(
        electron.getCurrentWindow(),
        {
          title: t('Import file'),
          filters: [
            { name: t('Microsoft Excel table'), extensions: ['xlsx', 'xls'] },
          ],
          properties: ['openFile'],
          buttonLabel: t('Choose'),
        },
        (paths) => {
          if (paths) {
            setPath(paths[0])
            localStorage.setItem('lastImport', paths[0])
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
          await TableController.import(
            path,
            order.map((x) => x.value),
            headers
          )
          setMessage(t('Document imported successfully'))
          setMessageCloseHandler(() => () => {
            setMessageModalOpen(false)
            closeModal()
          })
        } catch (e) {
          console.error(e)
          setMessage(`${t('An error happened during import')}: ${e.message}`)
          setMessageCloseHandler(() => () => setMessageModalOpen(false))
        } finally {
          setLoading(false)
          setMessageModalOpen(true)
        }
      },
      [i18n.language, path, order, headers]
    ),
    onImport = React.useCallback(() => {
      if (!path.trim()) return
      TableController.saved ? setNotificationOpen(true) : importDocument(false)
    }, [path])

  return (
    <Modal className={'ImportModal'} closeModal={closeModal} {...props}>
      <Form>
        <FormTitle level={3}>{t('Import file')}</FormTitle>
        <FileChoiceRow
          value={path}
          label={t('Choose file')}
          onFileChoice={onFileChoice}
        />
        <ChoiceRow
          checked={headers}
          onChange={toggleHeaders}
          label={t("Contains headers (Don't change to auto detect)")}
        />
        <span>
          {t(
            'Drag to specify, in which order the columns are arranged in your file'
          )}
        </span>
        <OrderChoice
          className={'ImportModal__OrderChoice'}
          id={'import-file-choice'}
          onOrderChanged={onOrderChanged}
          order={order}
        />
        <ButtonsRow>
          <Button label={t('Import')} disabled={!path} onClick={onImport} />
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
