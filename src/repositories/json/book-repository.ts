import { BookModel } from "@/models/book-model";
import { BookRepository } from "@/repositories/book-repository";
import { readFile } from "fs/promises";
import { resolve } from "path";

const JSON_BOOK_FILE_PATH = resolve(process.cwd(), 'src', 'db', 'json', 'book-seed.json')
const SIMULATE_WAIT_MS = 1000

export class JsonBookRepository implements BookRepository {
    private async readFromDisk(): Promise<BookModel[]> {
        const jsonContent = await readFile(JSON_BOOK_FILE_PATH, 'utf-8')
        const books = JSON.parse(jsonContent)
        return books
    }

    private async simulateWait() {
        if (SIMULATE_WAIT_MS <= 0) return;

        await new Promise(resolve => setTimeout(resolve, SIMULATE_WAIT_MS))
    }

    async findAll(): Promise<BookModel[]> {
        await this.simulateWait()

        const books = await this.readFromDisk()
        return books
    }

    async findAllByUser(userId: string): Promise<BookModel[]> {
        const books = await this.findAll()
        const booksByUser = books.filter(book => book.ownerId === userId)
        return booksByUser
    }

    async findByBookId(bookId: string): Promise<BookModel> {
        const books = await this.findAll()
        const book = books.find(book => book.id === bookId)

        if (!book) {
            throw new Error('Livro não encontrado')
        }

        return book
    }

    async findByUserAndBookId(userId: string, bookId: string): Promise<BookModel> {
        const books = await this.findAllByUser(userId)
        const book = books.find(book => book.id === bookId)

        if (!book) {
            throw new Error('Livro não encontrado')
        }

        return book
    }

    async findByUserAndBookSlug(userId: string, bookSlug: string): Promise<BookModel> {
        const books = await this.findAllByUser(userId)
        const book = books.find(book => book.slug === bookSlug)

        if (!book) {
            throw new Error('Livro não encontrado')
        }

        return book
    }

    async findAllByUserAndType(userId: string, type: "summary" | "comic" | "illustrate"): Promise<BookModel[]> {
        const books = await this.findAllByUser(userId)
        const booksByType = books.filter(book => book.type === type)

        return booksByType
    }

}