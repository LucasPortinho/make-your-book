import { BookModel } from "@/models/book-model";
import { BookRepository } from "@/repositories"
import { notFound } from "next/navigation";
import { cache } from "react";

export const findAllBooksByUserCached = cache(async(userId: string) => {
        const books = await BookRepository.findAllByUser(userId);
        if (!books) notFound();
        return books
    }
)

export const findBookByUserAndIdCached = cache(async(userId: string, bookId: string) => {
        const book = await BookRepository.findByUserAndBookId(userId, bookId).catch(() => undefined);
        if (!book) notFound();
        return book
    }
)

export const findAllBooksByUserAndTypeCached = cache(async(userId: string, type: BookModel['type']) => {
        const books = await BookRepository.findAllByUserAndType(userId, type)
        if (!books) notFound();
        return books
    }
)
