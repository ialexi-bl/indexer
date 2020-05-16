import React from 'react'
import classNames from 'classnames'
import MdSettings from 'react-ionicons/lib/MdSettings'
import 'styles/control-button'

export default function ControlButton({ className, icon: Icon, ...props }) {
  return (
      <Icon className={classNames('ControlButton', className)} {...props}/>
  )
}
