import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#1f77b4", // Blue
  "#ff7f0e", // Orange
  "#2ca02c", // Green
  "#9467bd", // Purple
  "#e377c2", // Pink
  "#7f7f7f", // Gray
  "#bcbd22", // Olive green
  "#17becf", // Cyan
];

// Helper to get asset name from wrapper object
const assetName = (assetWrapper) => Object.keys(assetWrapper)[0];

// Helper to get asset data from wrapper object
const assetData = (assetWrapper) => Object.values(assetWrapper)[0];

const PortfolioCharts = ({ data }) => {

  const [showTiles, setShowTiles] = useState(false);
  
  useEffect(() => {
    if (data["total_current_value"] > 0) {
      const timeout = setTimeout(() => {
        setShowTiles(true);
      }, 200); // simulate short animation delay
      return () => clearTimeout(timeout);
    } else {
      setShowTiles(false);
    }
  }, [data["total_current_value"]]);

  if (!showTiles) return null;

  // Filter assets where current_value is not zero
  const filteredAssets = data.assets
    .map((item) => ({
      name: assetName(item),
      ...assetData(item),
    }))
    .filter((asset) => asset.current_value !== 0); // only keep assets with current_value > 0

  // Data for Portfolio Allocation (Pie)
  const allocationData = filteredAssets.map(({ name, current_value }) => ({
    name,
    value: current_value,
  }));

  // Data for Spent vs Current Value Bar Chart
  const spentVsCurrentData = filteredAssets.map(({ name, spent_value, current_value }) => ({
    name,
    Spent: spent_value,
    Value: current_value,
  }));

  return (
    <div className="mt-10">
      <div className="mb-5 text-2xl">Portfolio Visualisation</div>
        <div className="p-5 rounded bg-neutral-700 text-white space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-5">
          {/* Portfolio Allocation Pie Chart */}
          <div>
            <h2 className="text-lg text-amber-200 font-semibold mb-4">Portfolio Allocation</h2>
            <div className="bg-neutral-800 pb-5 rounded">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={allocationData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={80}
                    innerRadius={50}
                    label={false}  // No slice labels
                  >
                    {allocationData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) =>
                      new Intl.NumberFormat("en", {
                        style: "currency",
                        currency: "USD",
                      }).format(value)
                    }
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Custom Legend Under the Chart */}
              <div className="flex flex-wrap justify-center gap-4">
                {allocationData.map((entry, index) => (
                  <div
                    key={`legend-${index}`}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <div
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      className="w-4 h-4 rounded-sm"
                    />
                    <span>{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Spent vs Current Value Bar Chart */}
          <div>
            <h2 className="text-lg text-amber-200 font-semibold mb-4">Spent vs Current Value</h2>
            <section className="bg-neutral-800 p-3 rounded">
              <ResponsiveContainer width="100%" height={265}>
                <BarChart data={spentVsCurrentData} activeShape={null} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#ccc" tick={{ fontSize: 14, fill: "#ccc" }}/>
                  <YAxis stroke="#ccc" tick={{ fontSize: 14, fill: "#ccc", fontWeight: "normal" }}/>
                  <Legend />
                  <Bar dataKey="Spent" fill="#8884d8" style={{ pointerEvents: "none" }} />
                  <Bar dataKey="Value" fill="#ffc658" style={{ pointerEvents: "none" }} />
                </BarChart>
              </ResponsiveContainer>
            </section>
          </div>
        </div>
    </div>
  );
};


export default PortfolioCharts;
