import React from 'react'
import ReactDOM from 'react-dom'
import App from 'components/app'
import TablePreview from 'components/table-preview'
import { remote as electron } from 'electron'
import 'styles/index.scss'
import 'services/i18n'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(electron.getCurrentWindow().isPreviewWindow ?
    <TablePreview/> :
    <App />
, document.getElementById('root'))

serviceWorker.register()
