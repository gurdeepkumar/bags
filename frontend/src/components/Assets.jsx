import React, { useState, useMemo } from "react";
import Transactions from "./Transactions";
import api from "../api/axiosInstance";
import { toast } from "react-hot-toast";

export default function Assets({ data, onPortfolioChange }) {
  const [expandedAsset, setExpandedAsset] = useState(null);

  const toggleExpand = (symbol) => {
    setExpandedAsset((prev) => (prev === symbol ? null : symbol));
  };

  const formatNum = (num) => {
    if (typeof num !== "number" || isNaN(num)) return "-";
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleDeleteAsset = async (assetId, symbol) => {
    try {
      await api.delete(`/asset/${assetId}`, { withCredentials: true });
      toast.success("Asset deleted");
      onPortfolioChange?.(); // fetch updated data
    } catch {
      toast.error("Failed to delete asset");
    }
  };

  const assetList = useMemo(() => data, [data]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse bg-neutral-800 rounded shadow overflow-hidden">
        <thead>
          <tr className="bg-neutral-700 text-left text-sm text-amber-200">
            <th className="px-4 py-2 w-28">Asset</th>
            <th className="px-4 py-2 w-24 hidden md:table-cell">Total Holdings</th>
            <th className="px-4 py-2 w-28 hidden md:table-cell">Total Spent</th>
            <th className="px-4 py-2 w-24 hidden md:table-cell">Current Price</th>
            <th className="px-4 py-2 w-28 hidden md:table-cell">Current Value</th>
            <th className="px-4 py-2 w-20">PnL</th>
            <th className="px-4 py-2 w-12 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {assetList.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-4 py-6 text-center text-amber-300">
                No assets found.
              </td>
            </tr>
          ) : (
            assetList.map((assetObj) => {
              const [symbol, asset] = Object.entries(assetObj)[0];
              const isExpanded = expandedAsset === symbol;

              return (
                <React.Fragment key={symbol}>
                  <tr
                    className="border-t border-neutral-700 text-sm hover:bg-neutral-700/40 transition cursor-pointer"
                    onClick={() => toggleExpand(symbol)}
                  >
                    <td className="px-4 py-2 font-semibold w-28">{symbol}</td>
                    <td className="px-4 py-2 w-24 hidden md:table-cell">
                      {formatNum(asset.total_qty)}
                    </td>
                    <td className="px-4 py-2 w-28 hidden md:table-cell">
                      ${formatNum(asset.spent_value)}
                    </td>
                    <td className="px-4 py-2 w-24 hidden md:table-cell">
                      ${formatNum(asset.current_price)}
                    </td>
                    <td className="px-4 py-2 w-28 hidden md:table-cell">
                      ${formatNum(asset.current_value)}
                    </td>
                    <td
                      className={`px-4 py-2 font-medium w-20 ${
                        asset.pnl >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      ${formatNum(asset.pnl)}
                    </td>
                    <td className="px-4 py-2 text-center w-12">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAsset(asset.asset_id, symbol);
                        }}
                        className="bg-red-600 hover:bg-red-700 transition px-2 py-1 rounded text-white"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                      </button>
                    </td>
                  </tr>

                  <tr className="bg-neutral-700 transition-all duration-300 ease-in-out">
                    <td colSpan="7" className="p-0">
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out origin-top ${
                          isExpanded
                            ? "max-h-[1000px] opacity-100 scale-100"
                            : "max-h-0 opacity-0 scale-95 pointer-events-none"
                        }`}
                      >
                        {isExpanded && (
                          <Transactions
                            key={symbol}
                            assetId={asset.asset_id}
                            assetSymbol={symbol}
                            onAssetChange={onPortfolioChange}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
