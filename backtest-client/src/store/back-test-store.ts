import {makeAutoObservable} from "mobx";
import type {BackTestService} from "../service/back-test-service.ts";
import type {ReturnBackTestRequest, ReturnBackTestResponse} from "../models/backtest-models.ts";

export class BackTestStore {
    private backTestService: BackTestService;

    constructor(backTestService: BackTestService) {
        this.backTestService = backTestService;
        makeAutoObservable(this);
    }

    async getBackTest(request: ReturnBackTestRequest): Promise<ReturnBackTestResponse> {
        console.log("Calling backtest with request:", request);
        return await this.backTestService.getBackTest(request);
    }
}