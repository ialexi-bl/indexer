import React from 'react'
import ReactModal from 'react-modal'
import classNames from 'classnames'
import { connect } from 'react-redux'
import 'styles/modal.scss'
import { ButtonsRow } from './form'

const app = document.getElementById('root')
function Modal({ closeModal, className, nightMode, ...props}) {
    const closeHandler = React.useCallback((e) => e.target === e.currentTarget && closeModal(), [closeModal])
    
    return (
        <ReactModal
            appElement={app}
            shouldCloseOnEsc={true}
            closeTimeoutMS={300}
            overlayClassName={classNames('Modal__Overlay', { Modal_night: nightMode })}
            className={'Modal__DefaultContent'}
            onRequestClose={closeModal}
            {...props}
        >
            <div className={'Modal__Container'} onClick={closeHandler}>
                <div className={classNames('Modal__Content', className)}>
                    {props.children}
                </div>
            </div>
        </ReactModal>
    )
}

export default connect(({ nightMode }) => ({ nightMode }))(Modal)

export function ModalButtonsRow({ className, ...props }) {
    return (
        <ButtonsRow className={classNames(className, 'Modal__ButtonsRow')} {...props}/>
    )
}
