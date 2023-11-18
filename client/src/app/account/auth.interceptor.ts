import {
    HttpContextToken,
    HttpErrorResponse,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, exhaustMap, of, tap } from 'rxjs';
import { TOKEN_KEY } from '../state/account/account.effects';
import { AuthService } from './auth.service';

export const BYPASS_REFRESH = new HttpContextToken(() => false)

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    refreshingToken = false;

    constructor(private authService: AuthService) {
    }

    /**
     * This interceptor will automatically add the authentication token to the request headers. This token will be used
     * to validate the logged in requests in the API. Also, it will monitor responses on 401 (Unauthorized) errors. This
     * will usually mean the access token is expired. It will then request a new access token using the refresh token
     * and try the request again.
     */
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (req.context.get(BYPASS_REFRESH)) {
            // For some requests, for example isAuthenticated, we don't want to try a token refresh,
            // then we add BYPASS_REFRESH in the request context
            return next.handle(this.addTokenToRequest(req));
        }
        return next.handle(this.addTokenToRequest(req)).pipe(
            catchError(error => {
                // If error is a 401 and the token is not already refreshing
                if (error instanceof HttpErrorResponse && error.status === 401 && !this.refreshingToken && error.error === 'Expired') {
                    this.refreshingToken = true;
                    // Start refresh token request
                    return this.authService.refreshToken().pipe(
                        // On response, set refreshingToken flag back to false
                        tap(() => this.refreshingToken = false),
                        exhaustMap(() => {
                            // It will then try the request again, using the fresh token
                            return next.handle(this.addTokenToRequest(req));
                        }),
                    );
                } else {
                    // Any other type of error must be passed normally, it will be handled later.
                    return of(error);
                }
            }),
        );
    };

    /**
     * Adds the current token from localstorage to the request
     * @param req
     * @private
     */
    private addTokenToRequest(req: HttpRequest<any>): HttpRequest<any> {
        const token = localStorage.getItem(TOKEN_KEY);
        return token ? req.clone({
            headers: req.headers.set('Token', token),
        }) : req;
    }
}
