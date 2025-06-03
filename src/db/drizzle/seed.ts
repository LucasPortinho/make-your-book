import { readFile } from "fs/promises"
import { resolve } from "path"
import { drizzleDb } from "."
import { agentsTable, booksTable, usersTable } from "./schemas"

(async() => {
    const SEED_PATH = resolve(process.cwd(), 'src', 'db', 'seed', 'seed.json')
    const jsonContent = await readFile(SEED_PATH, 'utf-8')
    const parsedJson = JSON.parse(jsonContent)
    
    const books = parsedJson['books']
    const users = parsedJson['users']
    const agents = parsedJson['agents'] 


    
    try {
        await drizzleDb.insert(usersTable).values(users)
        await drizzleDb.insert(agentsTable).values(agents)
        await drizzleDb.insert(booksTable).values(books)
    } catch(e) {
        console.log(`Ocorreu um erro... ${e}`)
    }

})()