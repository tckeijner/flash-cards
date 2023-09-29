import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { selectToken } from "../state/account/account.selectors";
import { TOKEN_KEY } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    token: null | string = null;

    constructor(private store: Store) {
        // retrieve token from the store
        this.store.select(selectToken).subscribe(token => this.token = token)
    }

    /**
     * This interceptor will automatically add the authentication token to the request headers,
     * this token will be used to validate the logged in requests in the API
     */
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        // if there is an authentication token present, set it to the Authorization header.
        // Otherwise leave the request unchanged.
        const token = localStorage.getItem(TOKEN_KEY);
        const authReq = token ? req.clone({
            headers: req.headers.set('Authorization', token)
        }) : req;

        return next.handle(authReq);
    }
}
