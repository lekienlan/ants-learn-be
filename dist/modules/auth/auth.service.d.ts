export declare const loginWithEmail: (email: string) => Promise<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    updatedAt: Date | null;
    createdAt: Date | null;
}>;
export declare const refresh: (refreshToken: string) => Promise<{
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        updatedAt: Date | null;
        createdAt: Date | null;
    };
    tokens: import("../token/token.interface").AccessAndRefreshTokens;
}>;
