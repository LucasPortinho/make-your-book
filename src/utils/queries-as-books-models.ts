import { BookModel } from "@/models/book-model";

type QueryType = Omit<BookModel, 'type'> & {
    type: string
}

export const queriesAsBookModels = (queries: QueryType[]) => queries.filter(book => ['summary', 'comic', 'illustrate'].includes(book.type))
.map(book => ({
  ...book,
  type: book.type as 'summary' | 'comic' | 'illustrate'
}))

export const queryAsBookModel = (query: QueryType) => {
  if (['summary', 'comic', 'illustrate'].includes(query.type)) {
    return {
      ...query,
      type: query.type as 'summary' | 'comic' | 'illustrate'
    }
  }
  return null
}
