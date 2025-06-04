import { DrizzleAuthenticationRepository } from "./drizzle/authentication-repository";
import { DrizzleBookRepository } from "./drizzle/book-repository";

export const BookRepository = new DrizzleBookRepository()
export const AuthenticationRepository = new DrizzleAuthenticationRepository() 
