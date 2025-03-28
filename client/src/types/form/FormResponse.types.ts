export interface AuthErrorReponse {
	message: string;
	statusCode: number;
}

export type AuthResponse = undefined | AuthErrorReponse;
