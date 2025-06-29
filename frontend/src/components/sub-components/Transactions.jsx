import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { toast } from "react-hot-toast";

export default function Transactions({ assetId, assetSymbol, onAssetChange }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState("");
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editQty, setEditQty] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  const formatNum = (num) => {
    if (typeof num !== "number" || isNaN(num)) return "-";
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  useEffect(() => {
    if (!assetId) return;
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/asset/${assetId}`, { withCredentials: true });
        setTransactions(response.data);
      } catch {
        toast.error("Failed to load transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [assetId]);

  const handleAdd = async () => {
    const parsedQty = parseFloat(qty);
    const parsedValue = parseFloat(value);
    if (isNaN(parsedQty) || parsedQty <= 0) return toast.error("Transaction quantity must be > 0.");
    if (isNaN(parsedValue)) return toast.error("Invalid transaction value.");

    try {
      setSubmitting(true);
      const res = await api.post("/asset/transaction", {
        asset_id: assetId,
        qty: parsedQty,
        value: parsedValue,
      }, { withCredentials: true });

      setTransactions((prev) => [...prev, res.data]);
      setQty(""); 
      setValue("");
      toast.success("Transaction added");
      onAssetChange?.()
    } catch {
      toast.error("Transaction add failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/asset/transaction/${id}`, { withCredentials: true });
      setTransactions((prev) => prev.filter(tx => tx.tx_id !== id));
      toast.success("Transaction deleted");
      onAssetChange?.()
    } catch {
      toast.error("Transaction delete failed");
    }
  };

  const startEdit = (tx) => {
    setEditingId(tx.tx_id);
    setEditQty(tx.qty.toString());
    setEditValue(tx.value.toString());
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditQty("");
    setEditValue("");
  };

  const handleUpdate = async (id) => {
    const parsedQty = parseFloat(editQty);
    const parsedValue = parseFloat(editValue);
    if (isNaN(parsedQty) || parsedQty <= 0 || isNaN(parsedValue)) {
      return toast.error("Invalid transaction values");
    }

    try {
      setEditSubmitting(true);
      await api.put(`/asset/transaction/${id}`, { qty: parsedQty, value: parsedValue }, { withCredentials: true });
      setTransactions((prev) =>
        prev.map(tx => tx.tx_id === id ? { ...tx, qty: parsedQty, value: parsedValue } : tx)
      );
      toast.success("Transaction updated");
      onAssetChange?.()
      cancelEdit();
    } catch {
      toast.error("Transaction update failed");
    } finally {
      setEditSubmitting(false);
    }
  };

  const buyPrice = qty && value && Number(qty) > 0 ? Number(value) / Number(qty) : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="md:w-11/12 p-0.5 m-auto mt-4">
      <h3 className="bg-neutral-700 text-white font-semibold px-2 py-2 rounded mb-2">
        Transactions for {assetSymbol}
      </h3>

      <table className="w-full mb-7 bg-neutral-700 rounded shadow text-sm">
        <thead className="bg-neutral-800 text-left text-amber-200">
          <tr>
            <th className="px-4 py-2">Qty</th>
            <th className="px-4 py-2">Spent</th>
            <th className="hidden md:table-cell px-4 py-2">Buy Price</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center text-amber-300 py-4">No transactions</td>
            </tr>
          ) : (
            transactions.map((tx) => {
              const isEditing = editingId === tx.tx_id;
              const buyPrice = tx.qty ? tx.value / tx.qty : null;

              return (
                <tr key={tx.tx_id} className="border-t border-neutral-800 text-white">
                  {isEditing ? (
                    <>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={editQty}
                          onChange={(e) => setEditQty(e.target.value)}
                          className="w-full bg-neutral-600 p-1 rounded"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full bg-neutral-600 p-1 rounded"
                        />
                      </td>
                      <td className="hidden md:table-cell px-4 py-2">
                        ${(Number(editQty) > 0 && Number(editValue)) ? formatNum(Number(editValue) / Number(editQty)) : "-"}
                      </td>
                      <td className="px-4 py-2 text-center space-x-2">
                        <button onClick={() => handleUpdate(tx.tx_id)} disabled={editSubmitting} className="bg-amber-500 px-3 py-1 rounded text-black">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                        </button>
                        <button onClick={cancelEdit} className="bg-gray-500 px-3 py-1 rounded text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2">{formatNum(tx.qty)}</td>
                      <td className="px-4 py-2">${formatNum(tx.value)}</td>
                      <td className="hidden md:table-cell px-4 py-2">${formatNum(buyPrice)}</td>
                      <td className="px-4 py-2 text-center space-x-2">
                        <button onClick={() => startEdit(tx)} className="bg-amber-500 px-3 py-1 rounded text-black">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>
                        </button>
                        <button onClick={() => handleDelete(tx.tx_id)} className="bg-red-600 px-3 py-1 rounded text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              );
            })
          )}

          {/* Add Row */}
          <tr className="border-t border-neutral-800 bg-neutral-800/50">
            <td className="px-4 py-2">
              <input
                type="number"
                value={qty}
                placeholder="Qty"
                onChange={(e) => setQty(e.target.value)}
                className="w-full bg-neutral-600 p-1 rounded"
              />
            </td>
            <td className="px-4 py-2">
              <input
                type="number"
                value={value}
                placeholder="Spent"
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-neutral-600 p-1 rounded"
              />
            </td>
            <td className="hidden md:table-cell px-4 py-2">
              {buyPrice !== null ? `$${formatNum(buyPrice)}` : ""}
            </td>
            <td className="px-4 py-2 text-center">
              <button
                onClick={handleAdd}
                disabled={submitting}
                className="bg-amber-500 w-24 px-3 py-1 rounded text-black"
              >
                {submitting ? "Adding..." : "Add Tx"}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
