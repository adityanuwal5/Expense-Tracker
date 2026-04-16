import React from "react";
import { useExpense } from "../../context/ExpenseContext";
import { formatCurrency } from "../../utils/helpers";

const Header = () => {
  const { balance, transactions } = useExpense();

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background:
          "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)",
        boxShadow: "0 4px 24px rgba(79, 70, 229, 0.35)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center
                          justify-center text-2xl flex-shrink-0"
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "1px solid rgba(255,255,255,0.3)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              💸
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white 
                               tracking-tight leading-none">
                  ExpenseTracker
                </h1>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.25)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                >
                  V2
                </span>
              </div>
              <p className="text-indigo-200 text-xs font-medium mt-0.5">
                Personal Finance Manager
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            {/* Transaction Count */}
            <div
              className="hidden md:flex items-center gap-2 
                          px-4 py-2 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <span className="text-lg">📊</span>
              <span className="text-sm font-semibold text-white">
                {transactions.length} transactions
              </span>
            </div>

            {/* Balance */}
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}
            >
              <span className="text-white/70 text-sm font-medium 
                               hidden sm:block">
                Balance:
              </span>
              <span
                className="text-lg font-black"
                style={{
                  color: balance >= 0 ? "#86efac" : "#fca5a5",
                  textShadow: "0 1px 4px rgba(0,0,0,0.2)",
                }}
              >
                {formatCurrency(balance)}
              </span>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;