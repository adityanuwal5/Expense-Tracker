import React, { useState, useMemo } from "react";
import { useExpense } from "../../context/ExpenseContext";
import TransactionItem from "./TransactionItem";

const ITEMS_PER_PAGE = 8;

const TransactionList = () => {
  const { filteredTransactions, filter } = useExpense();
  const [searchQuery, setSearchQuery]   = useState("");
  const [sortBy, setSortBy]             = useState("date-desc");
  const [currentPage, setCurrentPage]   = useState(1);

  const processed = useMemo(() => {
    let r = filteredTransactions.filter(
      (t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    r = [...r].sort((a, b) => {
      switch (sortBy) {
        case "date-desc":   return new Date(b.date) - new Date(a.date);
        case "date-asc":    return new Date(a.date) - new Date(b.date);
        case "amount-desc": return b.amount - a.amount;
        case "amount-asc":  return a.amount - b.amount;
        case "name-asc":    return a.title.localeCompare(b.title);
        default:            return 0;
      }
    });
    return r;
  }, [filteredTransactions, searchQuery, sortBy]);

  const totalPages = Math.ceil(processed.length / ITEMS_PER_PAGE);
  const paginated  = processed.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.92)",
        border: "1px solid rgba(99,102,241,0.1)",
        boxShadow:
          "0 2px 12px rgba(99,102,241,0.06), 0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      <div className="p-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center 
                        justify-between gap-3 mb-5">
          <div>
            <h2 className="text-lg font-black text-gray-800">
              Transactions
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">
              {processed.length} record{processed.length !== 1 ? "s" : ""}
              {filter !== "All" ? ` in "${filter}"` : ""}
            </p>
          </div>

          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className="text-sm rounded-xl px-3 py-2 font-semibold 
                       cursor-pointer"
            style={{
              background: "#f8fafc",
              border: "1.5px solid #e2e8f0",
              color: "#475569",
            }}
          >
            <option value="date-desc">📅 Latest First</option>
            <option value="date-asc">📅 Oldest First</option>
            <option value="amount-desc">💰 Highest Amount</option>
            <option value="amount-asc">💰 Lowest Amount</option>
            <option value="name-asc">🔤 Name A-Z</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 
                           text-gray-400">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by title or category..."
            className="w-full pl-10 pr-10 py-3 rounded-xl text-sm 
                       font-medium"
            style={{
              background: "#f8fafc",
              border: "1.5px solid #e2e8f0",
              color: "#1e293b",
            }}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 
                         text-gray-400 hover:text-gray-600"
              style={{ border: "none", background: "none" }}
            >
              ✕
            </button>
          )}
        </div>

        {/* List */}
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <div
              className="w-20 h-20 rounded-2xl flex items-center 
                          justify-center text-4xl mb-4"
              style={{
                background: "#f1f5f9",
                animation: "float 3s ease-in-out infinite",
              }}
            >
              📭
            </div>
            <p className="font-black text-gray-500 text-base">
              No transactions found
            </p>
            <p className="text-sm mt-1 text-gray-400 font-medium">
              {searchQuery
                ? `No results for "${searchQuery}"`
                : "Add your first transaction above"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {paginated.map((t) => (
              <TransactionItem key={t.id} transaction={t} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between mt-6 pt-5"
            style={{ borderTop: "1px solid #f1f5f9" }}
          >
            <p className="text-xs text-gray-400 font-semibold">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold 
                           disabled:opacity-40"
                style={{ background: "#f8fafc",
                         border: "1.5px solid #e2e8f0",
                         color: "#475569" }}
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - currentPage) <= 1
                )
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((item, i) =>
                  item === "..." ? (
                    <span key={`d${i}`}
                      className="px-2 text-gray-400 text-sm">
                      ...
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setCurrentPage(item)}
                      className="w-8 h-8 rounded-lg text-sm font-bold"
                      style={
                        currentPage === item
                          ? {
                              background:
                                "linear-gradient(135deg,#6366f1,#7c3aed)",
                              color: "white",
                              boxShadow:
                                "0 2px 8px rgba(99,102,241,0.4)",
                            }
                          : {
                              background: "#f8fafc",
                              color: "#64748b",
                              border: "1.5px solid #e2e8f0",
                            }
                      }
                    >
                      {item}
                    </button>
                  )
                )}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold 
                           disabled:opacity-40"
                style={{ background: "#f8fafc",
                         border: "1.5px solid #e2e8f0",
                         color: "#475569" }}
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;