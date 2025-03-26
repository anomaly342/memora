export interface AuthErrorReponse {
	errors: string[];
}

export type AuthResponse = undefined | AuthErrorReponse;
