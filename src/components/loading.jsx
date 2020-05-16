import React from 'react'
import classNames from 'classnames'
import 'styles/loading.scss'

export default function Loading({ className, visible }) {
  return (
    <div
      className={classNames('Loading', className, { Loading_visible: visible })}
    />
  )
}
