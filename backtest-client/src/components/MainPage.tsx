import {observer} from "mobx-react-lite";
import {useContext, useState} from "react";
import {RootStoreContext} from "../store/RootStore.tsx";
import type {ReturnBackTestRequest} from "../models/backtest-models.ts";

export const MainPage = observer(() => {
    const rootStore = useContext(RootStoreContext);
    const [formData, setFormData] = useState<ReturnBackTestRequest>({
        ticker: 'OPEN',
        stopLossPercentage: 0,
        rewardPercentage: 0,
        maxTrades: 0,
        startingCapital: 0
    });

    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleInputChange = (field: keyof ReturnBackTestRequest, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: parseFloat(value) || 0
        }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await rootStore.backTestStore.getBackTest(formData);
            setResult(response);
        } catch (error) {
            console.error('Error calling backtest:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div  style={{ padding: '20px',  display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-evenly', height: '100%'}}>
            <div>
                <h2>Backtest Parameters</h2>

                <div style={{marginBottom: '15px'}}>
                    <label>Ticker:</label>
                    <select
                        value={formData.ticker}
                        onChange={(e) => setFormData(prev => ({...prev, ticker: e.target.value}))}
                        style={{width: '100%', padding: '8px', marginTop: '5px'}}
                    >
                        <option value="OPEN">OPEN</option>
                        <option value="IREN">IREN</option>
                        <option value="OSCR">OSCR</option>
                        <option value="SOFI">SOFI</option>
                        <option value="PLUG">PLUG</option>
                    </select>
                </div>

                <div style={{marginBottom: '15px'}}>
                    <label>Stop Loss Percentage:</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.stopLossPercentage}
                        onChange={(e) => handleInputChange('stopLossPercentage', e.target.value)}
                        style={{width: '100%', padding: '8px', marginTop: '5px'}}
                    />
                </div>

                <div style={{marginBottom: '15px'}}>
                    <label>Reward Percentage:</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.rewardPercentage}
                        onChange={(e) => handleInputChange('rewardPercentage', e.target.value)}
                        style={{width: '100%', padding: '8px', marginTop: '5px'}}
                    />
                </div>

                <div style={{marginBottom: '15px'}}>
                    <label>Max Trades:</label>
                    <input
                        type="number"
                        value={formData.maxTrades}
                        onChange={(e) => handleInputChange('maxTrades', e.target.value)}
                        style={{width: '100%', padding: '8px', marginTop: '5px'}}
                    />
                </div>

                <div style={{marginBottom: '15px'}}>
                    <label>Starting Capital:</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.startingCapital}
                        onChange={(e) => handleInputChange('startingCapital', e.target.value)}
                        style={{width: '100%', padding: '8px', marginTop: '5px'}}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isLoading ? 'Running Backtest...' : 'Run Backtest'}
                </button>

            </div>

            {result && (
                <div style={{marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px'}}>
                    <h3>Results:</h3>
                    <p>Win Rate: {result.winRatePercentage}%</p>
                    <p>Final Capital: ${result.finalCapital}</p>
                    <p>Annualized Return: {result.annualizedReturnPercentage}%</p>
                    <p>Trades Taken: {result.tradesTaken}</p>
                </div>
            )}
        </div>
    )
});