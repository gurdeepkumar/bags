import { AnimatedNumber } from '../../hooks/useAnimatedNumber';

export default function Tiles(props) {
    const data = props.data;

    if (data["Current Value"] === 0) return <></>;

    return (
        <>
            <h2 className="text-3xl font-bold mb-6">Portfolio Overview</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
                <div className="bg-neutral-800 p-4 rounded shadow">
                    <h3 className="text-amber-200 font-semibold mb-2">Total Invested</h3>
                    <p className="text-2xl">
                        $<AnimatedNumber value={data["Total Invested"]} />
                    </p>
                </div>
                <div className="bg-neutral-800 p-4 rounded shadow">
                    <h3 className="text-amber-200 font-semibold mb-2">Total Current Value</h3>
                    <p className="text-2xl">
                        $<AnimatedNumber value={data["Current Value"]} />
                    </p>
                </div>
                <div className="bg-neutral-800 p-4 rounded shadow">
                    <h3 className="text-amber-200 font-semibold mb-2">Total PnL</h3>
                    <p className={`text-2xl ${data["Total PnL"] >= 0 ? "text-green-400" : "text-red-400"}`}>
                        $<AnimatedNumber value={data["Total PnL"]} />
                    </p>
                </div>
                <div className="bg-neutral-800 p-4 rounded shadow">
                    <h3 className="text-amber-200 font-semibold mb-2">Top Gainer</h3>
                    <p className="text-2xl">{data["Top Gainer"]}</p>
                </div>
            </div>
        </>
    );
}
