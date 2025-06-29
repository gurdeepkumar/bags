import React, { useEffect, useRef, useState } from "react";
import api from "../api/axiosInstance";
import { toast, Toaster } from "react-hot-toast";
import Tiles from "../components/sub-components/Tiles";
import Assets from "../components/sub-components/Assets";
import { useAuth } from "../auth/AuthContext";

export default function Portfolio() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { accessToken, loading: authLoading } = useAuth();

  const fetchPortfolio = async () => {
    try {
      const response = await api.get("/portfolio", { withCredentials: true });
      setData(response.data.data);
    } catch (err) {
      toast.error("Failed to load portfolio");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || !accessToken) return;

    fetchPortfolio(); 

    const interval = setInterval(() => {
      fetchPortfolio(); 
    }, 5000);

    return () => clearInterval(interval); 
  }, [authLoading, accessToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-amber-200 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-amber-200 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
          <div className="w-3 h-3 bg-amber-200 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center text-red-400 py-6">No portfolio data available.</div>;
  }

  const {
    assets = [],
    total_spent_value = 0,
    total_current_value = 0,
    total_pnl = 0,
    top_gainer = "N/A",
  } = data;

  const tiles_data = {
    "Total Invested": total_spent_value,
    "Current Value": total_current_value,
    "Total PnL": total_pnl,
    "Top Gainer": top_gainer,
  };


  return (
    <div className="p-6 text-amber-50 bg-neutral-900 mb-14">
      <Toaster position="top-center" />
      <Tiles data={tiles_data} />
      <h3 className="text-2xl font-bold mb-4">Assets</h3>
      <Assets onPortfolioChange={fetchPortfolio} data={assets} />
    </div>
  );
}


