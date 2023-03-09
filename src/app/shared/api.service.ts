import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { StocksRequestParams } from "../pages/stock-analysis/stock-analysis.component";

@Injectable({
    providedIn: "root"
})
export class ApiService {

    constructor(private http: HttpClient) {}

    getData(params: StocksRequestParams) {
        return this.http.get(environment.apiURL, {
            params: {
                ...params,
                apikey: environment.apiKey
            }
        });
    }
}