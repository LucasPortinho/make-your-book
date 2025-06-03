import { drizzleDb } from "@/db/drizzle";
import { booksTable } from "@/db/drizzle/schemas";
import { BookModel } from "@/models/book-model";
import { BookRepository } from "@/repositories/book-repository";
import { queriesAsBookModels, queryAsBookModel } from "@/utils/queries-as-books-models";
import { eq } from "drizzle-orm";

const SIMULATE_WAIT_MS = 1000

export class DrizzleBookRepository implements BookRepository {
    private async simulateWait() {
        if (SIMULATE_WAIT_MS <= 0) return;

        await new Promise(resolve => setTimeout(resolve, SIMULATE_WAIT_MS))
    }

    async findAll(): Promise<BookModel[]> {
        await this.simulateWait()

        const books = await drizzleDb.query.books.findMany({
            orderBy: (books, { desc }) => desc(books.modifiedAt)
        })

        const filteredBooks = queriesAsBookModels(books)

        return filteredBooks
    }

    async findAllByUser(userId: string): Promise<BookModel[]> {
        const books = await drizzleDb.query.books.findMany({
            where: (books, { eq }) => eq(books.ownerId, userId)
        })
        const booksByUser = queriesAsBookModels(books)
        return booksByUser
    }

    async findByBookId(bookId: string): Promise<BookModel> {
        const book = await drizzleDb.query.books.findFirst({
            where: (books, { eq }) => eq(books.id, bookId)
        })

        if (!book) {
            throw new Error('Livro não encontrado')
        }

        const bookModel = queryAsBookModel(book)

        if (!bookModel) {
            throw new Error('Erro ao processar o livro')
        } 
        return bookModel
    }

    async findByUserAndBookId(userId: string, bookId: string): Promise<BookModel> {
        const book = await drizzleDb.query.books.findFirst({
            where: (books, { eq, and }) => and(eq(books.id, bookId), eq(books.ownerId, userId)) 
        })

        if (!book) {
            throw new Error('Livro não encontrado')
        }

        const bookModel = queryAsBookModel(book)

        if (!bookModel) {
            throw new Error('Erro ao processar o livro')
        } 
        return bookModel
    }

    async findByUserAndBookSlug(userId: string, bookSlug: string): Promise<BookModel> {
        const book = await drizzleDb.query.books.findFirst({
            where: (books, { eq, and }) => and(eq(books.ownerId, userId), eq(books.slug, bookSlug))
        })

        if (!book) {
            throw new Error('Livro não encontrado')
        }

        const bookModel = queryAsBookModel(book)

        if (!bookModel) {
            throw new Error('Erro ao processar o livro')
        } 
        return bookModel
    }

    async findAllByUserAndType(userId: string, type: "summary" | "comic" | "illustrate"): Promise<BookModel[]> {
        const books = await drizzleDb.query.books.findMany({
            where: (books, { eq, and }) => and(eq(books.ownerId, userId), eq(books.type, type))
        })
        const booksByType = queriesAsBookModels(books)
        return booksByType
    }

    async delete(bookId: string): Promise<BookModel> {
        const book = await drizzleDb.query.books.findFirst({
            where: (books, { eq }) => eq(books.id, bookId)
        })

        if (!book) {
            throw new Error('Livro não encontrado')
        }

        const bookModel = queryAsBookModel(book)

        if (!bookModel) {
            throw new Error('Erro ao processar o livro')
        } 

        await drizzleDb.delete(booksTable).where(eq(booksTable.id, bookId))
        return bookModel
    }

    async create(book: BookModel): Promise<BookModel> {
        const bookExists = await drizzleDb.query.books.findFirst({
            where: (books, { eq }) => eq(books.id, book.id)
        });

        if (!!bookExists) {
            throw new Error("Um livro com esse ID já existe na base de dados")
        };

        const bookModel = queryAsBookModel(book);

        if (!bookModel) {
            throw new Error('Erro ao processar o livro')
        };

        await drizzleDb.insert(booksTable).values(book);
        return bookModel;
    }

    async update(bookId: string, newBookData: Pick<BookModel, 'projectTitle' | 'agentId' | 'type' | 'modifiedUrl'>): Promise<BookModel> {
        const book = await drizzleDb.query.books.findFirst({
            where: (books, { eq }) => eq(books.id, bookId)
        });

        if (!book) {
            throw new Error('Livro não encontrado')
        };

        const updatedAt = new Date().toISOString();
        const newData = {
            projectTitle: newBookData.projectTitle,
            agentId: newBookData.agentId,
            type: newBookData.type,
            modifiedUrl: newBookData.modifiedUrl,
            updatedAt
        }

        const bookModel = queryAsBookModel(book);

        if (!bookModel) {
            throw new Error('Erro ao processar o livro')
        };

        await drizzleDb.update(booksTable).set(newData).where(eq(booksTable.id, bookId))
        return {
            ...bookModel,
            ...newData
        }
    }
}