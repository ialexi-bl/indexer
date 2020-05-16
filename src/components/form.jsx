import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import Select from 'react-select'
import Switch from 'react-switch'
import FolderIcon from 'react-ionicons/lib/MdFolder'
import EraseIcon from 'react-ionicons/lib/MdClose'
import Alive from 'react-ionicons/lib/MdAdd'
import Dead from 'react-ionicons/lib/MdAddCircle'
import Sure from 'react-ionicons/lib/MdHelpCircle'
import Unsure from 'react-ionicons/lib/MdHelp'
import 'styles/form.scss'

export function Form({ className, children, workspace }) {
  return (
    <article
      className={classNames('Form', className, { Form_workspace: workspace })}
    >
      {children}
    </article>
  )
}

export function FormTitle({ level = 2, className, children, ...props }) {
  const Title = `h${level}`
  return (
    <Title className={classNames('Form__Title', className)} {...props}>
      {children}
    </Title>
  )
}

FormTitle.propTypes = {
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
}

export function DeadBtn({ checked, onChange }) {
  const Icon = checked ? Dead : Alive
  return <Icon className={'Form__Dead'} onClick={() => onChange(!checked)} />
}

export function UnsureBtn({ checked, onChange }) {
  const Icon = checked ? Sure : Unsure
  return <Icon className={'Form__Unsure'} onClick={() => onChange(!checked)} />
}

export function Input({ className, inputRef, disabled, ...props }) {
  return (
    <input
      className={classNames('Form__Input', className, {
        Form__Input_disabled: disabled,
      })}
      ref={inputRef}
      {...props}
    />
  )
}

export function ErasabledInput({ onChange, ...props }) {
  return (
    <div className={'Form__ErasableInput'}>
      <Input {...props} onChange={onChange} />
      <EraseIcon
        className={'Form__Eraser'}
        onClick={() => onChange && onChange({ target: { value: '' } })}
      />
    </div>
  )
}

export function InputRow({ className, label, erasable, ...props }) {
  const InputTag = erasable ? ErasabledInput : Input
  return (
    <label className={classNames('Form__InputRow', classNames)}>
      <span className={'Form__Label'}>{label}</span>
      <InputTag {...props} />
    </label>
  )
}

export function ButtonsRow({
  className,
  children,
  disabled,
  final,
  label,
  ...props
}) {
  return (
    <div className={classNames(className, 'Form__ButtonsRow')}>{children}</div>
  )
}

export function Button({
  className,
  disabled,
  cancel,
  center,
  label,
  btnRef,
  ...props
}) {
  return (
    <button
      className={classNames('Form__Button Form__Button_single', className, {
        Form__Button_disabled: disabled,
        Form__Button_cancel: cancel,
        Form__Button_center: center,
      })}
      ref={btnRef}
      {...props}
    >
      {label}
    </button>
  )
}

export function SelectRow({ className, label, ...props }) {
  return (
    <label className={classNames('Form__InputRow Form__InputRow_select')}>
      <span className={'Form__Label'}>{label}</span>
      <Select className={'Form__Select'} {...props} />
    </label>
  )
}

export function ChoiceRow({ className, label, checked, ...props }) {
  return (
    <label className={classNames('Form__InputRow Form__InputRow_select')}>
      <span className={'Form__Label'}>{label}</span>
      <Switch
        className={classNames('Form__Checkbox', {
          Form__Checkbox_undefined: checked === null,
        })}
        uncheckedIcon={false}
        checkedIcon={false}
        onColor={'#5b2bda'} // $i_main
        checked={checked || false}
        {...props}
      />
    </label>
  )
}

export function FileChoiceRow({ label, onFileChoice, value, ...props }) {
  return (
    <>
      <span className={'Form__Label'}>{label}</span>
      <input
        className={'Form__Input Form__Input_readonly Form__FilePreview'}
        value={value}
        title={value}
        readOnly
      />
      <button
        className={'Form__Button Form__Button_file'}
        onClick={onFileChoice}
      >
        <FolderIcon className={'Form__Icon'} />
      </button>
    </>
  )
}
