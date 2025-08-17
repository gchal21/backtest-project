import yfinance as yf
import pandas as pd
from fastapi import APIRouter

from models import ReturnBackTestResponse, ReturnBackTestRequest

router = APIRouter()


def get_stock_data():
    """Get stock data for backtesting"""
    tickers = ["OPEN", "IREN", "OSCR", "SOFI", "PLUG"]

    # Download data
    all_data = []
    for ticker in tickers:
        df = yf.download(ticker, period="1y", interval="1d")
        df.reset_index(inplace=True)

        # Flatten MultiIndex columns if they exist
        df.columns = [col[0] if isinstance(col, tuple) else col for col in df.columns]

        df["Ticker"] = ticker
        all_data.append(df)

    # Combine all tickers into one DataFrame
    df_all = pd.concat(all_data, ignore_index=True)
    return df_all


def run_backtest(data: pd.DataFrame, ticker: str, stop_loss_pct: float, reward_pct: float, 
                max_trades: int, starting_capital: float):
    """
    Simple backtest strategy:
    - Buy when price is above 20-day moving average
    - Sell when stop loss or reward target is hit
    """
    
    results = []
    current_capital = starting_capital
    trades_taken = 0
    winning_trades = 0
    
    # Filter data for the selected ticker only
    ticker_data = data[data['Ticker'] == ticker].copy()
    
    if ticker_data.empty:
        return {
            'win_rate': 0,
            'final_capital': starting_capital,
            'annualized_return': 0,
            'trades_taken': 0
        }
    
    ticker_data = ticker_data.sort_values('Date').reset_index(drop=True)
    
    # Calculate 20-day moving average
    ticker_data['MA20'] = ticker_data['Close'].rolling(window=20).mean()
    
    # Simple strategy: buy when close > MA20
    in_position = False
    entry_price = 0
    
    for i in range(20, len(ticker_data)):  # Start after MA period
        if trades_taken >= max_trades:
            break
            
        current_price = ticker_data.iloc[i]['Close']
        ma20 = ticker_data.iloc[i]['MA20']
        
        # Entry signal: price above MA20 and not in position
        if not in_position and current_price > ma20:
            entry_price = current_price
            in_position = True
            continue
        
        # Exit signals: stop loss or take profit
        if in_position:
            price_change_pct = ((current_price - entry_price) / entry_price) * 100
            
            # Stop loss hit
            if price_change_pct <= -stop_loss_pct:
                trade_pnl = (current_price - entry_price) / entry_price
                current_capital *= (1 + trade_pnl)
                trades_taken += 1
                in_position = False
                results.append({'trade': trades_taken, 'pnl_pct': price_change_pct, 'win': False})
            
            # Take profit hit
            elif price_change_pct >= reward_pct:
                trade_pnl = (current_price - entry_price) / entry_price
                current_capital *= (1 + trade_pnl)
                trades_taken += 1
                winning_trades += 1
                in_position = False
                results.append({'trade': trades_taken, 'pnl_pct': price_change_pct, 'win': True})
    
    # Calculate metrics
    win_rate = (winning_trades / trades_taken * 100) if trades_taken > 0 else 0
    total_return = ((current_capital - starting_capital) / starting_capital) * 100
    
    # Annualized return (assuming 1 year of data)
    annualized_return = total_return
    
    return {
        'win_rate': win_rate,
        'final_capital': current_capital,
        'annualized_return': annualized_return,
        'trades_taken': trades_taken
    }


@router.post("/get-back-test", response_model=ReturnBackTestResponse)
async def get_return_back_test(return_back_test_data: ReturnBackTestRequest) -> ReturnBackTestResponse:
    print(f"Running backtest with parameters: {return_back_test_data}")
    
    try:
        # Get stock data
        stock_data = get_stock_data()
        
        # Run backtest
        results = run_backtest(
            data=stock_data,
            ticker=return_back_test_data.ticker,
            stop_loss_pct=return_back_test_data.stopLossPercentage,
            reward_pct=return_back_test_data.rewardPercentage,
            max_trades=return_back_test_data.maxTrades,
            starting_capital=return_back_test_data.startingCapital
        )
        
        return ReturnBackTestResponse(
            winRatePercentage=round(results['win_rate'], 2),
            finalCapital=round(results['final_capital'], 2),
            annualizedReturnPercentage=round(results['annualized_return'], 2),
            tradesTaken=results['trades_taken']
        )
        
    except Exception as e:
        print(f"Error in backtest: {e}")
        # Return fallback data in case of error
        return ReturnBackTestResponse(
            winRatePercentage=0.0,
            finalCapital=return_back_test_data.startingCapital,
            annualizedReturnPercentage=0.0,
            tradesTaken=0
        )

