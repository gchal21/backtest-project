# import yfinance as yf
# import pandas as pd
#
#
#
# def get_excel_file():
#     # List of tickers
#     tickers = ["OPEN", "IREN", "OSCR", "SOFI", "PLUG"]
#
#     # Download data
#     all_data = []
#     for ticker in tickers:
#         df = yf.download(ticker, period="1y", interval="1d")
#         df.reset_index(inplace=True)
#
#         # Flatten MultiIndex columns if they exist
#         df.columns = [col[0] if isinstance(col, tuple) else col for col in df.columns]
#
#         df["Ticker"] = ticker
#         all_data.append(df)
#
#     # Combine all tickers into one DataFrame
#     df_all = pd.concat(all_data, ignore_index=True)
#
#     # Save to Excel
#     df_all.to_excel("trade_model.xlsx", sheet_name="Data", index=False)
#
#     print("Saved trade_model.xlsx with all 5 tickers' data.")
#
#
#
#
# if __name__ == "__main__":
#     get_excel_file()
