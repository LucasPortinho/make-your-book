import { BookModel } from "@/models/book-model"
import { UserModel } from "@/models/user-model";

export type BookRepository = {
    // Read - user and admin
    findAllByUser(userId: UserModel['id']): Promise<BookModel[]>;
    findByUserAndBookSlug(userId: UserModel['id'], bookSlug: BookModel['slug']): Promise<BookModel>;
    findAllByUserAndType(userId: UserModel['id'], type: BookModel['type']): Promise<BookModel[]>
    findByUserAndBookId(userId: UserModel['id'], bookId: BookModel['id']): Promise<BookModel>;  // Necessary because of caching
    
    // Read - admin
    findAll(): Promise<BookModel[]>;
    findByBookId(bookId: BookModel['id']): Promise<BookModel>;

    create(book: BookModel): Promise<BookModel>;
    update(bookId: BookModel['id'], newBookData: Pick<BookModel, 'projectTitle' | 'agentId' | 'type' | 'modifiedUrl'>): Promise<BookModel>;
    delete(bookId: BookModel['id']): Promise<BookModel>;
}