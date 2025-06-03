import { UserModel } from "@/models/user-model";
import { readFile } from "fs/promises";
import { AuthenticationRepository, JwtPayload } from "../authentication-repository";
import bcrypt from 'bcryptjs'
import { resolve } from "path";
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const USER_FILE_PATH = resolve(process.cwd(), 'src', 'db', 'json', 'user-seed.json')

const jwtSecretKey = process.env.JWT_SECRET_KEY || '';
const jwtEncodedKey = new TextEncoder().encode(jwtSecretKey);  // Secret key

const loginExpSeconds = Number(process.env.LOGIN_EXPIRATION_SECONDS) || 604800
const loginExpStr = process.env.LOGIN_EXPIRATION_STRING || '7d'
const loginCookieName = process.env.LOGIN_COOKIE_NAME || 'loginSession'

export class JsonAuthenticationRepository implements AuthenticationRepository {
    private async readFromDisk(): Promise<UserModel[]> {
        const jsonContent = await readFile(USER_FILE_PATH, 'utf-8');
        const users = JSON.parse(jsonContent);
        return users;
    }

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

        const users = await this.readFromDisk()
        const usersId = users.map(user => user.id)

        return usersId.includes(jwtPayload?.id)
    }

    async requireLoginSessionOrRedirect(): Promise<void> {
        const isAuthenticated = await this.verifyLoginSession()
        if (!isAuthenticated) { 
            redirect('/login')
        }
    }

    async getUserByEmail(email: string): Promise<UserModel> {
        const users = await this.readFromDisk();
        const user = users.find(user => user.email === email)
        
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
}