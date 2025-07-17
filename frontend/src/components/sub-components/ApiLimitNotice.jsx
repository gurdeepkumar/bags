import React from "react";

const ApiLimitNotice = () => {
  return (
    <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 rounded-2xl shadow-md m-6">
      <div className="flex items-start space-x-3">
        <svg
          className="w-6 h-6 text-amber-500 mt-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M12 9v2m0 4h.01M4.93 4.93l1.41 1.41M1 12h2m16 0h2m-3.34 5.66l-1.41-1.41M12 1v2m5.66 3.34l-1.41 1.41"
          />
        </svg>
        <div>
          <p className="font-semibold">API Notice</p>
          <p className="text-sm mt-1">
            Due to free tier limitations with CoinGecko and CoinMarketCap APIs,
            this app currently only supports Binance-listed coins.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiLimitNotice;