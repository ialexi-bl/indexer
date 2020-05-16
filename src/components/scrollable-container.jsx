import React from 'react'
import { Scrollbars } from 'react-custom-scrollbars'
import 'styles/scrollable-container.scss'

const renderScrollView = (props) => (
  <div className={'App__Content'} {...props} />
)
const renderScrollThumb = (props) => (
  <div {...props} className={'Scrollbar__Thumb'} />
)

export default function ScrollableContainer({ children }) {
  return (
    <Scrollbars
      renderThumbHorizontal={renderScrollThumb}
      renderThumbVertical={renderScrollThumb}
      renderView={renderScrollView}
    >
      {children}
    </Scrollbars>
  )
}
