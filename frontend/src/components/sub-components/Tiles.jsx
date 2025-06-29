import { useEffect, useState } from 'react';
import { AnimatedNumber } from '../../hooks/useAnimatedNumber';

export default function Tiles({ data }) {
  const [showTiles, setShowTiles] = useState(false);

  useEffect(() => {
    if (data["Current Value"] > 0) {
      const timeout = setTimeout(() => {
        setShowTiles(true);
      }, 200); // simulate short animation delay
      return () => clearTimeout(timeout);
    } else {
      setShowTiles(false);
    }
  }, [data["Current Value"]]);

  if (!showTiles) return null;

  return (
    <div className="opacity-0 animate-fadein">
      <h2 className="text-3xl font-bold mb-6">Portfolio Overview</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <div className="bg-neutral-800 p-4 rounded shadow transition-all duration-500 transform hover:scale-105">
          <h3 className="text-amber-200 font-semibold mb-2">Total Invested</h3>
          <p className="text-2xl">
            $<AnimatedNumber value={data["Total Invested"]} />
          </p>
        </div>
        <div className="bg-neutral-800 p-4 rounded shadow transition-all duration-500 transform hover:scale-105">
          <h3 className="text-amber-200 font-semibold mb-2">Total Current Value</h3>
          <p className="text-2xl">
            $<AnimatedNumber value={data["Current Value"]} />
          </p>
        </div>
        <div className="bg-neutral-800 p-4 rounded shadow transition-all duration-500 transform hover:scale-105">
          <h3 className="text-amber-200 font-semibold mb-2">Total PnL</h3>
          <p className={`text-2xl ${data["Total PnL"] >= 0 ? "text-green-400" : "text-red-400"}`}>
            $<AnimatedNumber value={data["Total PnL"]} />
          </p>
        </div>
        <div className="bg-neutral-800 p-4 rounded shadow transition-all duration-500 transform hover:scale-105">
          <h3 className="text-amber-200 font-semibold mb-2">Top Gainer</h3>
          <p className="text-2xl">{data["Top Gainer"]}</p>
        </div>
      </div>
    </div>
  );
}
