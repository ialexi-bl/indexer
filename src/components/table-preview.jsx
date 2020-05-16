import React from 'react'
import TableController from 'services/TableController'
import { useTranslation } from 'react-i18next'
import DataGrid from 'react-data-grid'
import { TitleBar } from 'electron-react-titlebar'
import 'styles/preview-table.scss'
import 'styles/title-bar.scss'
import KeyBinding from '../services/KeyBinding'

const CELL_CHANGE = 'CELL_CHANGE'

export default function TablePreview() {
  const { t } = useTranslation()
  const columns = React.useMemo(() => getColumns(t), [t])

  const [tableHeight, setTableHeight] = React.useState(window.innerHeight - 28)
  const [currState, setCurrState] = React.useState(0)
  const [changes, setChanges] = React.useState([])
  const [data, setData] = React.useState([])

  // State control
  const undo = React.useCallback(
    (change, state = currState) => {
      console.log('undoing', change || changes[state - 1], state)
      change = change || changes[state - 1]
      if (!change) return

      if (change.type === CELL_CHANGE) {
        TableController.updateCell(change.number, change.prev)
        const rows = [...data]
        console.log('old', rows, 'number', change.number, 'prev', change.prev)
        rows[change.number] = change.prev
        console.log('new', rows)
        setData(rows)
        setCurrState(currState - 1)
      }
    },
    [data, changes, currState]
  )
  const undoAll = React.useCallback(() => {
    for (let i = currState - 1; i >= 0; i--) undo(changes[i], i + 1)
    setCurrState(0)
  }, [currState, changes, undo])
  const updateRows = React.useCallback(
    ({ fromRow: row, updated, redoing }) => {
      if (row % 2 !== 0 && (updated.year || updated.document)) row--

      const rows = data.slice()
      TableController.updateCell(row, updated)
      if (!redoing) {
        setChanges(
          changes.slice(0).concat({
            type: CELL_CHANGE,
            number: row,
            prev: rows[row],
            updated,
          })
        )
        setCurrState(currState + 1)
      }
      rows[row] = { ...rows[row], ...updated }
      setData(rows)
    },
    [data, changes, currState]
  )
  const redo = React.useCallback(() => {
    const change = changes[currState]
    if (!change) return
    if (change.type === CELL_CHANGE)
      updateRows({
        fromRow: change.number,
        updated: change.updated,
        redoing: true,
      })
    setCurrState(currState + 1)
  }, [changes, currState, updateRows])

  const onKeyDown = React.useCallback(
    (e) => {
      if (KeyBinding.get('undo').test(e)) {
        console.log('undoing')
        undo()
      } else if (KeyBinding.get('redo').test(e)) {
        console.log('redoing')
        redo()
      }
    },
    [undo, redo]
  )

  const menu = React.useMemo(
    () => [
      {
        label: t('Edit'),
        submenu: [
          {
            label: t('Undo'),
            click: undo,
          },
          {
            label: t('Redo'),
            click: redo,
          },
          {
            label: t('Undo all'),
            click: undoAll,
          },
        ],
      },
    ],
    [t, undoAll, undo, redo]
  )

  React.useEffect(() => {
    KeyBinding.init()
    TableController.getTable().then((data) => {
      let lastYear
      setData(
        data.map((value, index) => {
          if (index % 2 !== 0) {
            // Do not display year and doc for wife
            delete value.year
            delete value.document
          } else if (lastYear === String(value.year)) {
            // Do not display many years in a row
            delete value.year
          } else {
            lastYear = String(value.year)
          }

          return value
        })
      )
    })

    const onWindowResize = () => {
      setTableHeight(window.innerHeight - 28)
    }
    window.addEventListener('resize', onWindowResize)
    return () => window.removeEventListener('resize', onWindowResize)
  }, [])

  console.log(currState, changes)

  return (
    <div className={'App'} onKeyDown={onKeyDown}>
      <TitleBar menu={menu} className={'TitleBar'} />
      <DataGrid
        columns={columns}
        rowGetter={(i) => data[i]}
        rowsCount={data.length}
        minHeight={tableHeight}
        enableCellSelect={true}
        onGridRowsUpdated={updateRows}
        onGridKeyDown={onKeyDown}
      />
    </div>
  )
}

function getColumns(t) {
  return [
    { editable: true, key: 'year', name: t('Year') },
    { editable: true, key: 'document', name: t('Document') },
    { editable: true, key: 'first_name', name: t('First name') },
    { editable: true, key: 'last_name', name: t('Last name') },
    { editable: true, key: 'maiden_name', name: t('Maiden name') },
    { editable: true, key: 'age', name: t('Age') },
    { editable: true, key: 'father', name: t('Father') },
    { editable: true, key: 'mother', name: t('Mother') },
    { editable: true, key: 'other', name: t('Other') },
    { editable: true, key: 'check', name: t('Check') },
  ]
}
