import React from 'react'
import Modal from './modal'
import { useTranslation } from 'react-i18next'
import 'styles/key-bindings-modal.scss'

export default function KeyBindingsModal({ closeModal, ...props }) {
  const { t } = useTranslation()
  
  return (
    <Modal
        closeModal={closeModal}
        {...props}
    >
      <h3>{t('Key bindings')}</h3>
      <section className={'BindingsTable'}>
      
      </section>
    </Modal>
  )
}