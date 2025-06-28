import React from "react";

function Portfolio({ data }) {
  const {
    assets,
    total_spent_value,
    total_current_value,
    total_pnl,
    top_gainer,
  } = data;

  return (
    <div className="p-6 text-amber-50 bg-neutral-900 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Portfolio Overview</h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <div className="bg-neutral-800 p-4 rounded shadow">
          <h3 className="text-xl text-amber-200 font-semibold mb-2">Total Invested</h3>
          <p className="text-2xl">${total_spent_value.toLocaleString()}</p>
        </div>
        <div className="bg-neutral-800 p-4 rounded shadow">
          <h3 className="text-xl text-amber-200 font-semibold mb-2">Current Value</h3>
          <p className="text-2xl">${total_current_value.toLocaleString()}</p>
        </div>
        <div className="bg-neutral-800 p-4 rounded shadow">
          <h3 className="text-xl text-amber-200 font-semibold mb-2">Total PnL</h3>
          <p className={`text-2xl ${total_pnl >= 0 ? "text-green-400" : "text-red-400"}`}>
            ${total_pnl.toLocaleString()}
          </p>
        </div>
        <div className="bg-neutral-800 p-4 rounded shadow">
          <h3 className="text-xl text-amber-200 font-semibold mb-2">Top Gainer</h3>
          <p className="text-2xl">{top_gainer}</p>
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-4">Assets</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse bg-neutral-800 rounded shadow overflow-hidden">
          <thead>
            <tr className="bg-neutral-700 text-left text-sm text-amber-200">
              <th className="px-4 py-2">Asset</th>
              <th className="px-4 py-2">Total Holdings</th>
              <th className="px-4 py-2">Total Spent</th>
              <th className="px-4 py-2">Current Price</th>
              <th className="px-4 py-2">Current Value</th>
              <th className="px-4 py-2">PnL</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((assetObj, idx) => {
              const [symbol, asset] = Object.entries(assetObj)[0];
              return (
                <tr
                  key={idx}
                  className="border-t border-neutral-700 text-sm hover:bg-neutral-700/40 transition"
                >
                  <td className="px-4 py-2 font-semibold">{symbol}</td>
                  <td className="px-4 py-2">{asset.total_qty}</td>
                  <td className="px-4 py-2">${asset.spent_value.toLocaleString()}</td>
                  <td className="px-4 py-2">${asset.current_price.toLocaleString()}</td>
                  <td className="px-4 py-2">${asset.current_value.toLocaleString()}</td>
                  <td
                    className={`px-4 py-2 font-medium ${
                      asset.pnl >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    ${asset.pnl.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Portfolio;
