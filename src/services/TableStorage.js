import Dexie from 'dexie'

const db = new Dexie('xlsx_storage')
db.version(1).stores({
  xlsx: 'number, year, document, first_name, last_name',
})

export default db
