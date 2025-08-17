export interface ReturnBackTestRequest {
    ticker: string;
    stopLossPercentage: number;
    rewardPercentage: number;
    maxTrades: number;
    startingCapital: number;
}

export interface ReturnBackTestResponse {
    winRatePercentage: number;
    finalCapital: number;
    annualizedReturnPercentage: number;
    tradesTaken: number;
}