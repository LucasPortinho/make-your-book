import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { resolve } from 'path'
import { agentsTable, booksTable, usersTable } from './schemas'

const sqliteDatabasePath = resolve(process.cwd(), 'db.sqlite3')
const sqliteDatabase = new Database(sqliteDatabasePath)

export const drizzleDb = drizzle(sqliteDatabase, {
    schema: {
        users: usersTable,
        agents: agentsTable,
        books: booksTable,
    }
})