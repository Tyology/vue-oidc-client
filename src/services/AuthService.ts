import { User, UserManager, WebStorageStateStore } from "oidc-client";

export default class AuthService {
    private userManager: UserManager;

    constructor() {
        const SECURE_TOKEN_SERVICE_DOMAIN: string = "https://localhost:44332";

        const settings: any = {
            userStore: new WebStorageStateStore({ store: window.localStorage }),
            authority: SECURE_TOKEN_SERVICE_DOMAIN,
            client_id: "pointstire.com",
            redirect_uri: "http://localhost:52669/callback.html",
            automaticSilentRenew: true,
            silent_redirect_uri: 'https://localhost:44357/silent-renew.html',
            response_type: "code",
            scope: "openid profile email phone address central.api.access",
            post_logout_redirect_uri: "http://localhost:52669/",
            filterProtocolClaims: true,
        };

        this.userManager = new UserManager(settings);
    }

    public getAccessToken(): Promise<string> {
        return this.userManager.getUser().then((data: any) => {
            return data.access_token;
        });
    }

    public getUser(): Promise<User | null> {
        return this.userManager.getUser();
    }

    public login(): Promise<void> {
        return this.userManager.signinRedirect();
    }

    public logout(): Promise<void> {
        return this.userManager.signoutRedirect();
    }

    public async isLoggedIn(): Promise<boolean> {
        const user: User | null = await this.getUser();

        return (user !== null && !user.expired);
    }
}