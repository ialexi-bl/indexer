const electron = require('electron'),
  { ipcMain } = electron
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const { version } = require('../package')

const path = require('path')
const isDev = require('electron-is-dev')

let mainWindow, previewWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    minWidth: 400,
    minHeight: 300,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )
  if (isDev) {
    // Open the DevTools.
    mainWindow.webContents.openDevTools()
  }
  mainWindow.on('closed', () => {
    mainWindow = null
  })

  ipcMain.on('get-version', (event) => (event.returnValue = version))
  ipcMain.on('open-preview-window', (event) => {
    if (previewWindow) return (event.returnValue = false)

    previewWindow = new BrowserWindow({
      width: 700,
      height: 600,
      minWidth: 600,
      minHeight: 500,
      frame: false,
      parent: mainWindow,
      webPreferences: {
        nodeIntegration: true,
      },
    })
    previewWindow.isPreviewWindow = true
    if (isDev) {
      // Open the DevTools.
      previewWindow.webContents.openDevTools()
    }
    previewWindow.loadURL(
      isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../build/index.html')}`
    )
    previewWindow.on('closed', () => {
      previewWindow = null
    })
    event.returnValue = true
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    if (isDev) process.exit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
