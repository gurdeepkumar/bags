import Portfolio from "../compnents/Portfolio"

const apiData = {
  data: {
    assets: [
      {
        ETH: {
          asset_id: 1,
          total_qty: 19.54,
          spent_value: 3700,
          current_price: 2421.75,
          current_value: 47320.99,
          pnl: 43620.99,
        },
      },
      {
        BTC: {
          asset_id: 2,
          total_qty: 1.27,
          spent_value: 15400,
          current_price: 107162.75,
          current_value: 136096.69,
          pnl: 120696.69,
        },
      },
      {
        XMR: {
          asset_id: 3,
          total_qty: 1,
          spent_value: 12162.75,
          current_price: 1162.75,
          current_value: 1162.75,
          pnl: -11000,
        },
      },
    ],
    total_spent_value: 31262.75,
    total_current_value: 184580.43,
    total_pnl: 153317.68,
    top_gainer: "BTC",
  },
};

export default function Home() {
  return (
    <div className="md:w-4/5 w-full mx-auto">
      <Portfolio data={apiData.data} />
    </div>
  );
}
