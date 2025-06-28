export default function Tiles(props) {
    return(
        <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
                <div className="bg-neutral-800 p-4 rounded shadow">
                <h3 className="text-xl text-amber-200 font-semibold mb-2">Total Invested</h3>
                <p className="text-2xl">${Math.round(props.data["Total Invested"]).toLocaleString()}</p>
                </div>
                <div className="bg-neutral-800 p-4 rounded shadow">
                <h3 className="text-xl text-amber-200 font-semibold mb-2">Total Current Value</h3>
                <p className="text-2xl">${Math.round(props.data["Current Value"]).toLocaleString()}</p>
                </div>
                <div className="bg-neutral-800 p-4 rounded shadow">
                <h3 className="text-xl text-amber-200 font-semibold mb-2">Total PnL</h3>
                <p className={`text-2xl ${props.data["Total PnL"] >= 0 ? "text-green-400" : "text-red-400"}`}>
                    ${Math.round(props.data["Total PnL"]).toLocaleString()}
                </p>
                </div>
                <div className="bg-neutral-800 p-4 rounded shadow">
                <h3 className="text-xl text-amber-200 font-semibold mb-2">Top Gainer</h3>
                <p className="text-2xl">{props.data["Top Gainer"]}</p>
                </div>
            </div>
        </>
    );
};