import React from 'react'
import TableController from 'services/TableController'
import { useTranslation } from 'react-i18next'
import DataGrid from 'react-data-grid'
import { TitleBar } from 'electron-react-titlebar'
import 'styles/preview-table.scss'
import 'styles/title-bar.scss'
import KeyBinding from '../services/KeyBinding'

const CELL_CHANGE = 'CELL_CHANGE'
const ROW_DELETED = 'ROW_DELETED'

export default function TablePreview() {
  const { t, i18n } = useTranslation()
      , [data, setData] = React.useState([])
      , [tableHeight, setTableHeight] = React.useState(window.innerHeight - 28)
      , [changes, setChanges] = React.useState([])
      , [currState, setCurrState] = React.useState(0)
      , columns = React.useMemo(() => [
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
      ], [i18n.language])
      
      // State control
      ,
      undo = React.useCallback((change, state = currState) => {
        change = change || changes[state - 1]
        if(!change) return
        
        if(change.type === CELL_CHANGE) {
          TableController.updateCell(change.number, change.prev)
          const rows = data.slice()
          rows[change.number] = change.prev
          setData(rows)
        }
        if(!change) setCurrState(currState - 1)
      }, [data, changes, currState]),
      undoAll = React.useCallback(() => {
        for(let i = currState - 1; i >= 0; i--)
          undo(changes[i], i + 1)
        setCurrState(0)
      }, [currState]),
      onRowsUpdated = React.useCallback(({ fromRow: row, updated, redoing }) => {
        if(row % 2 !== 0 && (updated.year || updated.document)) row--
        
        const rows = data.slice()
        TableController.updateCell(row, updated)
        if(!redoing) {
          setChanges(changes.slice(0).concat({ type: CELL_CHANGE, number: row, prev: rows[row], updated }))
          setCurrState(currState + 1)
        }
        rows[row] = { ...rows[row], ...updated }
        setData(rows)
      }, [data, changes, currState]),
      redo = React.useCallback(() => {
        const change = changes[currState]
        if(!change) return
        if(change.type === CELL_CHANGE) onRowsUpdated(
            { fromRow: change.number, updated: change.updated, redoing: true })
        setCurrState(currState + 1)
      }, [changes, currState, onRowsUpdated]),
      onKeyDown = React.useCallback((e) => {
        if(KeyBinding.get('undo').test(e)) return undo()
        if(KeyBinding.get('redo').test(e)) return redo()
      }, [undo, redo])
      
      , menu = React.useMemo(() => [{
        label: t('Edit'),
        submenu: [{
          label: t('Undo'),
          click: undo,
        }, {
          label: t('Redo'),
          click: redo,
        }, {
          label: t('Undo all'),
          click: undoAll,
        }],
      }], [i18n.language, undoAll, undo, redo])
      , onWindowResize = React.useCallback(function() {
        setTableHeight(window.innerHeight - 28)
      }, [])
  
  React.useEffect(() => {
    KeyBinding.init()
    TableController.getTable()
        .then((data) => {
          let lastYear
          setData(data.map((value, index) => {
            if(index % 2 !== 0) { // Do not display year and doc for wife
              delete value.year
              delete value.document
            } else if(lastYear === String(value.year)) { // Do not display many years in a row
              delete value.year
            } else {
              lastYear = String(value.year)
            }
            
            return value
          }))
        })
    
    window.addEventListener('resize', onWindowResize)
    return () => window.removeEventListener('resize', onWindowResize)
  }, [])
  
  return (
      <div className={'App'} onKeyDown={onKeyDown}>
        <TitleBar menu={menu} className={'TitleBar'}/>
        <DataGrid
            columns={columns}
            rowGetter={(i) => data[i]}
            rowsCount={data.length}
            minHeight={tableHeight}
            enableCellSelect={true}
            onGridRowsUpdated={onRowsUpdated}
            // rowRenderer={RowRenderer}
        />
      </div>
  )
}
