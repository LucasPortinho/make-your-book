import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    out: './src/db/drizzle/migrations',  // Local das migrations
    schema: './src/db/drizzle/schemas.ts',
    dialect: 'sqlite',
    dbCredentials: {
        url: './db.sqlite3' // caminho da base de dados
    }
})