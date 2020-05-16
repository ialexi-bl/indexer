import React from 'react'
import classNames from 'classnames'
import 'styles/list.scss'

export default function List({ className, children, ...props }) {
  return (
      <div className={classNames('List', className)} {...props}>{children}</div>
  )
}