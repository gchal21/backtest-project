import {post} from './axios-config';
import type {ReturnBackTestRequest, ReturnBackTestResponse} from '../models/backtest-models';

export class BackTestService {
    async getBackTest(request: ReturnBackTestRequest): Promise<ReturnBackTestResponse> {
        console.log("Sending backtest request:", request);
        const {data} = await post<ReturnBackTestResponse>('/api/get-back-test', request);
        return data;
    }
}