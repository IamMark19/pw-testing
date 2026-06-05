export class RequestHandler {

    private baseUrl?: string;
    private defaultBaseUrl: string = 'https://conduit-api.bondaracademy.com/api';
    private apiPath: string = '';
    private queryParams: object = {};
    private apiHeaders: object = {};
    private apiBody: object = {};

    url(url: string) {
        this.baseUrl = url;

        return this
    }

    path(path: string) {
        this.apiPath = path;

        return this
    }

    params(params: object) {
        this.queryParams = { ...this.queryParams, ...params };
        return this;
    }

    headers(headers: object) {
        this.apiHeaders = { ...this.apiHeaders, ...headers };
        return this;
    }

    body(body: object) {
        this.apiBody = body;

        return this
    }

    private getUrl(){
        
        const url = new URL(`${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`);
       
        for (const [key, value] of Object.entries(this.queryParams)) {
            url.searchParams.append(key, String(value));
        }
        
        return url.toString();
    }
}