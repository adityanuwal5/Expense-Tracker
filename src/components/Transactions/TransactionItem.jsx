import React, { useState } from "react";
import { useExpense, CATEGORIES } from "../../context/ExpenseContext";
import { formatCurrency, formatDate } from "../../utils/helpers";

const TransactionItem = ({ transaction }) => {
  const { deleteTransaction, setEditing } = useExpense();
  const [showConfirm, setShowConfirm]     = useState(false);

  const category  = CATEGORIES.find((c) => c.name === transaction.category);
  const isExpense = transaction.type === "expense";

  return (
    <div
      className="flex items-center gap-3 p-4 rounded-xl transition-all 
                  duration-200 group"
      style={{
        border: "1px solid transparent",
        background: "white",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background =
          "linear-gradient(135deg,rgba(99,102,241,0.04),rgba(139,92,246,0.03))";
        e.currentTarget.style.borderColor = "rgba(99,102,241,0.14)";
        e.currentTarget.style.transform = "translateX(4px)";
        e.currentTarget.style.boxShadow =
          "0 2px 12px rgba(99,102,241,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "white";
        e.currentTarget.style.borderColor = "transparent";
        e.currentTarget.style.transform = "translateX(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Category Icon */}
      <div
        className="w-11 h-11 rounded-xl flex items-center 
                    justify-center text-xl flex-shrink-0"
        style={{ background: `${category?.color}18` }}
      >
        {category?.icon || "📦"}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-bold text-gray-800 text-sm truncate pr-2">
            {transaction.title}
          </p>
          <p
            className="font-black text-sm flex-shrink-0"
            style={{ color: isExpense ? "#f43f5e" : "#10b981" }}
          >
            {isExpense ? "−" : "+"}
            {formatCurrency(transaction.amount)}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{
              background: `${category?.color}18`,
              color: category?.color,
            }}
          >
            {transaction.category}
          </span>
          <span className="text-xs text-gray-400 font-medium">
            {formatDate(transaction.date)}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold ml-auto"
            style={
              isExpense
                ? { background: "#fff1f2", color: "#f43f5e" }
                : { background: "#f0fdf4", color: "#10b981" }
            }
          >
            {isExpense ? "Expense" : "Income"}
          </span>
        </div>

        {transaction.note && (
          <p className="text-xs text-gray-400 mt-1 truncate font-medium">
            📝 {transaction.note}
          </p>
        )}
      </div>

      {/* Actions */}
      <div
        className="flex flex-col gap-1 flex-shrink-0"
        style={{ opacity: 0, transition: "opacity 0.2s" }}
        ref={(el) => {
          if (el) {
            el.parentElement.addEventListener("mouseenter", () => {
              el.style.opacity = "1";
            });
            el.parentElement.addEventListener("mouseleave", () => {
              el.style.opacity = "0";
            });
          }
        }}
      >
        <button
          onClick={() => setEditing(transaction)}
          className="w-8 h-8 rounded-lg flex items-center 
                     justify-center text-sm"
          style={{ background: "rgba(99,102,241,0.08)",
                   color: "#6366f1", border: "none" }}
        >
          ✏️
        </button>

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="w-8 h-8 rounded-lg flex items-center 
                       justify-center text-sm"
            style={{ background: "rgba(244,63,94,0.08)",
                     color: "#f43f5e", border: "none" }}
          >
            🗑️
          </button>
        ) : (
          <div className="flex flex-col gap-1">
            <button
              onClick={() => deleteTransaction(transaction.id)}
              className="w-8 h-8 rounded-lg flex items-center 
                         justify-center text-xs font-black text-white"
              style={{ background: "#f43f5e", border: "none" }}
            >
              ✓
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="w-8 h-8 rounded-lg flex items-center 
                         justify-center text-xs font-black"
              style={{ background: "#f1f5f9", color: "#64748b",
                       border: "none" }}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionItem;