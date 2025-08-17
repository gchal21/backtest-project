from pydantic import BaseModel


class ReturnBackTestRequest(BaseModel):
    ticker: str
    stopLossPercentage: float
    rewardPercentage: float
    maxTrades: int
    startingCapital: float

    


class ReturnBackTestResponse(BaseModel):
    winRatePercentage: float
    finalCapital: float
    annualizedReturnPercentage: float
    tradesTaken: int