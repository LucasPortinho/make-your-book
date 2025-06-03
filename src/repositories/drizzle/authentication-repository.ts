import { UserModel } from "@/models/user-model";
import { AuthenticationRepository, JwtPayload } from "../authentication-repository";
import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { drizzleDb } from "@/db/drizzle";
import { usersTable } from "@/db/drizzle/schemas";
import { eq } from "drizzle-orm";

const jwtSecretKey = process.env.JWT_SECRET_KEY || '';
const jwtEncodedKey = new TextEncoder().encode(jwtSecretKey);  // Secret key

const loginExpSeconds = Number(process.env.LOGIN_EXPIRATION_SECONDS) || 604800
const loginExpStr = process.env.LOGIN_EXPIRATION_STRING || '7d'
const loginCookieName = process.env.LOGIN_COOKIE_NAME || 'loginSession'

export class DrizzleAuthenticationRepository implements AuthenticationRepository {
    async signJwt(jwtPayload: JwtPayload): Promise<string> {
        return new SignJWT(jwtPayload)
        .setProtectedHeader({ alg: 'HS256', type: 'JWT' }).setIssuedAt().setExpirationTime(loginExpStr).sign(jwtEncodedKey);
    }

    async verifyJwt(jwt: string | undefined = ''): Promise<JwtPayload | false> {
        try {
            const { payload } = await jwtVerify(jwt, jwtEncodedKey, {
                algorithms: ['HS256']
            });
            return payload;
        } catch {
            return false;
        }
    }

    async createPasswordHash(password: string): Promise<string> {
        const hash = await bcrypt.hash(password, 10);
        return hash;
    }

    async verifyPasswordHash(password: string, hash: string): Promise<boolean> {
        const isValid = await bcrypt.compare(password, hash);
        return isValid;
    }

    async updatePasswordHash(userId: string, oldPassword: string, newPassword: string): Promise<string> {
        const user = await drizzleDb.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, userId)
        })

        if (!user) {
            throw new Error('Usuário não encontrado')
        }

        const isValid = await this.verifyPasswordHash(oldPassword, user.passwordHash)
        
        if (!isValid) {
            throw new Error('Senha atual diferente da enviada')
        }

        const newPasswordHash = await this.createPasswordHash(newPassword)

        await drizzleDb.update(usersTable).set({ passwordHash: newPasswordHash }).where(eq(usersTable.passwordHash, user.passwordHash))
        return newPassword
    }

    async createLoginJwtSession(id: string): Promise<void> {
        const expiresAt = new Date(Date.now() + loginExpSeconds * 1000);
        const loginSessionPayload = await this.signJwt({ id, expiresAt });

        const cookieStore = await cookies();
        cookieStore.set(loginCookieName, loginSessionPayload, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            expires: expiresAt
        });
    }

    async getLoginJwtSession(): Promise<false | JwtPayload> {
        const cookieStore = await cookies();
        const jwt = cookieStore.get(loginCookieName)?.value;  // Encoded Payload
        if (!jwt) return false;
        return this.verifyJwt(jwt);
    }     

    async deleteLoginJwtSession(): Promise<void> {
        const cookieStore = await cookies();
        cookieStore.set(loginCookieName, '', {
            expires: new Date(0)
        });
        cookieStore.delete(loginCookieName);
    }

    async verifyLoginSession(): Promise<boolean> {
        const jwtPayload = await this.getLoginJwtSession();
        if (!jwtPayload) return false

        const user = await drizzleDb.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, jwtPayload.id)
        })

        return !!user
    }

    async requireLoginSessionOrRedirect(): Promise<void> {
        const isAuthenticated = await this.verifyLoginSession()
        if (!isAuthenticated) { 
            redirect('/login')
        }
    }

    async getUserByEmail(email: string): Promise<UserModel> {
        const user = await drizzleDb.query.users.findFirst({
            where: (users, { eq }) => eq(users.email, email)
        })

        if (!user) {
            throw new Error('Usuário não encontrado')
        }

        return user
    }

    async loginUser(email: string, password: string): Promise<boolean> {
        try {
            const user = await this.getUserByEmail(email)
            const isValid = await this.verifyPasswordHash(password, user.passwordHash)

            if (!isValid) return false
            
            await this.createLoginJwtSession(user.id);
            return true
        } catch {
            return false
        }
    }

    async createUser(user: UserModel): Promise<UserModel> {
        const userExists = await drizzleDb.query.users.findFirst({
            where: (users, {eq, or}) => or(eq(users.id, user.id), eq(users.email, user.email)),
            columns: { id: true }  // Coluna de retorno
        })

        if (!!userExists) {
            throw new Error('Usuário com esse ID ou esse e-mail já existe')
        }

        await drizzleDb.insert(usersTable).values(user)
        return user
    }

    async deleteUser(userId: string): Promise<UserModel> {
        const user = await drizzleDb.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, userId)
        })

        if (!user) {
            throw new Error("Usuário com esse ID não existe")
        }

        await drizzleDb.delete(usersTable).where(eq(usersTable.id, userId))
        return user
    }

}