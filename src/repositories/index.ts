import { JsonBookRepository } from "@/repositories/json/book-repository";
import { DrizzleAuthenticationRepository } from "./drizzle/authentication-repository";

export const BookRepository = new JsonBookRepository()
export const AuthenticationRepository = new DrizzleAuthenticationRepository() 
