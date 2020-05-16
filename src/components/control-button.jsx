import React from 'react'
import classNames from 'classnames'
import 'styles/control-button'

export default function ControlButton({ className, icon: Icon, ...props }) {
  return <Icon className={classNames('ControlButton', className)} {...props} />
}
