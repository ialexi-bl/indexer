import db from './TableStorage'
import Xlsx from 'exceljs'
import { remote as electron } from 'electron'
import path from 'path'
import fs from 'fs'

const DEFAULT_ORDER = ['year', 'document', 'first_name', 'last_name', 'maiden_name', 'age', 'mother', 'father', 'other', 'check']
const COLUMNS_DESCRIPTION = [
  { header: 'Rok', key: 'year' },
  { header: 'Dokument', key: 'document' },
  { header: 'Imię', key: 'first_name' },
  { header: 'Nazwisko', key: 'last_name' },
  { header: 'Z Domu', key: 'maiden_name' },
  { header: 'Wiek', key: 'age' },
  { header: 'Ojciec', key: 'father' },
  { header: 'Matka', key: 'mother' },
  { header: 'Inne', key: 'other' },
  { header: 'Sprawdzić', key: 'check' },
]

function getStandardPath(filename) {
  const base = electron.app.getPath('userData')
  let result = path.join(base, `${filename}.xlsx`)
  for(let i = 1; fs.existsSync(result); i++) {
    result = path.join(base, `${filename}(${i})`)
  }
  return result
}

export default window.TablerController = class TableController {
  
  static lastNumber = -1
  static saved = true
  
  static async init() {
    this.lastNumber = await this.getItemsCount()
  }
  
  static set currentDocument(path) {
    localStorage.setItem('currentFile', path)
  }
  
  static get currentDocument() {
    return localStorage.getItem('currentFile')
  }
  
  static async hasCurrentDocument() {
    return await this.getItemsCount() > 0
  }
  
  /**
   * Proceeds xlsx file import
   * @param {string} path - Absolute path to xlsx file
   * @param {array<string>} order - Order in which fields in the file are arranged
   * @param {boolean|null} hasHeader - True if the document contains header, false if not, null to auto detect
   * @return {boolean}
   * @throws {Error}
   */
  static async import(path, order = DEFAULT_ORDER, hasHeader = null) {
    if(order.length !== DEFAULT_ORDER.length ||
        order.filter(x => !DEFAULT_ORDER.includes(x)).length) {
      throw new Error('Order must contain the same items as DEFAULT_ORDER')
    }
  
    // Loading worksheet from system
    const ws = await this._read(path)
  
    // Converting to JSON
    const array = ws.getSheetValues().slice(1)
        , header = array[0]
    
    // Removing header
    if(typeof hasHeader != 'boolean') {
      // Header auto detection
      hasHeader = (function(){
        const year = header[order.indexOf('year') + 1]
        if(year && isNaN(+year)) return true
        const document = header[order.indexOf('document') + 1]
        if(document && isNaN(+document)) return true
        const age = header[order.indexOf('age') + 1]
        return !!(age && isNaN(+age));
      })()
    }
    if(hasHeader) array.shift()
    
    // Clearing db
    // TODO: do backups
    await this._clearDatabase()
    this.currentDocument = void 0
    
    // Saving to memory
    for(let i = 0, l = array.length; i < l; i++) {
      const row = array[i]
      if(!row){
        this.addRow({ number: 1 })
        continue
      }
      
      const data = {}
      for(let j = 0; j < order.length; j++) {
        data[order[j]] = row[j + 1]
      }
      this.addRow(data)
    }
    this.saved = true
    return true
  }
  
  /**
   * Reads xlsx from filesystem then returns the worksheet
   * @param {string} path - Absolute path to xlsx file
   * @return {Promise<Worksheet>}
   * @private
   */
  static async _read(path) {
    const workbook = new Xlsx.Workbook()
    window.wb = workbook // TODO: delete
    await workbook.xlsx.readFile(path)
    
    return workbook.getWorksheet(1)
  }
  
  static async createDocument(path) {
    const wb = new Xlsx.Workbook()
    const ws = wb.addWorksheet('Worksheet1')
    ws.columns = COLUMNS_DESCRIPTION
    this._clearDatabase()
    this.currentDocument = path
    this.saved = true
    return wb.xlsx.writeFile(path)
  }
  
  /**
   * Saves current table in memory into the current working file
   * @return {Promise<void>}
   */
  static save(t, useCurrentPath = true) {
    if(!this.hasCurrentDocument) return Promise.resolve()
    if(!this.currentDocument || !useCurrentPath) {
      return new Promise((resolve) => {
        electron.dialog.showSaveDialog(electron.getCurrentWindow(),  {
          title: t('Choose file'),
          filters: [{ name: t('Microsoft Excel table'), extensions: ['xlsx', 'xls'] }],
          buttonLabel: t('Save'),
          defaultPath: `${t('Document')}.xlsx`
        }, (path) => {
          if(path) {
            this.currentDocument = path
            this.export(path)
            this.saved = true
          }
          resolve()
        })
      })
    }
    return this.export(this.currentDocument)
  }
  
  /**
   * Saves table from memory to specified file
   * @param {string} path - Absolute path to the file where the table will be exported
   * @return {Promise<void>}
   */
  static async export(path) {
    const wb = new Xlsx.Workbook()
    /** @type {Worksheet} */
    const ws = wb.addWorksheet('Worksheet1')
    
    ws.columns = COLUMNS_DESCRIPTION
    
    const table = await this.getTable()
    ws.addRows(table)
    
    return wb.xlsx.writeFile(path)
  }
  
  /**
   * Creates a backup of current table in memory
   * @return {Promise<void>}
   */
  static backupTable() {
    return this.export(getStandardPath('Backup'))
  }
  
  /**
   * Saves table to memory
   * @param {array<Object>} json - Table
   */
  static async saveToMemory(json) {
    await db.xlsx.bulkPut(json)
  }
  
  /**
   * Gets the table from memory
   * @return {Promise<array<Object>>}
   */
  static async getTable() {
    const data = await db.xlsx.toArray()
    this.lastNumber = data.length - 1
    return data
  }
  
  /**
   * Returns a range of rows from database (element with index "to" is not returned)
   * @param {number} from - The starting position
   * @param {number=} to - The ending position. If not specified, the range will start at 0 and end at the number, specified by the 1st argument
   * @return {Promise<array<Object>>}
   */
  static async getRange(from, to) {
    if(!to) {
      if(!from) throw new Error('Starting value not provided')
      to = from
      from = 0
    }
    
    const data = db.xlsx.where('number').between(from, to).toArray()
    this.lastNumber = await db.xlsx.count() - 1
    return data
  }
  
  /**
   * Adds a new row to the table
   * @param {Object} data - Row data
   * @return {Promise<void>}
   */
  static addRow(data) {
    if(!data.number) data.number = ++this.lastNumber
    this.saved = false
    return db.xlsx.put(data)
  }
  
  /**
   * Updates one cell's content
   * @param {number} number
   * @param {Object} changes
   * @return {Promise<number>}
   */
  static updateCell(number, changes) {
    this.saved = false
    return db.xlsx.where('number').equals(number).modify(changes)
  }
  
  /**
   *  Gets the number of rows in the table
   * @return {Promise<number>}
   */
  static getItemsCount() {
    return db.xlsx.count()
  }
  
  /**
   * Removes all table entries
   * @return {Promise}
   * @private
   */
  static _clearDatabase() {
    this.lastNumber = -1
    this.saved = true
    return db.xlsx.clear()
  }
  
  /**
   * Proceed the hard reset for the database
   * @return {Promise<void>}
   * @private
   */
  static async _hardReset() {
    await db.delete()
    await db.open()
  }

}
