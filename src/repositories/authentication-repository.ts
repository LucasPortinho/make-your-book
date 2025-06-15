import { UserModel } from "@/models/user-model";

export type JwtPayload = {
    id: string;
    expiresAt: Date;
}

export type AuthenticationRepository = {
    // Password management
    createPasswordHash(password: string): Promise<string>;
    verifyPasswordHash(password: string, hash: string): Promise<boolean>;
    updatePasswordHash(userId: UserModel['id'], oldPassword: string, newPassword: string): Promise<string>;
    
    // JWT management
    verifyJwt(jwt: string | undefined): Promise<JwtPayload | false>;
    createLoginJwtSession(id: string): Promise<void>;
    deleteLoginJwtSession(): Promise<void>;  // Logout
    getLoginJwtSession(): Promise<JwtPayload | false>;
    signJwt(jwtPayload: JwtPayload): Promise<string>;

    // Verify login
    verifyLoginSession(): Promise<boolean>;
    requireLoginSessionOrRedirect(): Promise<void>;
    getUserByLoginSession(): Promise<UserModel | false>

    // Login management
    getUserByEmail(email: string): Promise<UserModel>;
    loginUser(email: string, password: string): Promise<boolean>

    createUser(user: UserModel): Promise<UserModel>;
    deleteUser(userId: UserModel['id']): Promise<UserModel>;
}