import React from "react";
import { useExpense, CATEGORIES } from "../../context/ExpenseContext";
import { formatCurrency, getPercentage } from "../../utils/helpers";

const CategoryBreakdown = () => {
  const { transactions, totalExpenses } = useExpense();

  const categoryTotals = CATEGORIES.filter((c) => c.name !== "Income")
    .map((cat) => {
      const txns = transactions.filter(
        (t) => t.category === cat.name && t.type === "expense"
      );
      return {
        ...cat,
        total: txns.reduce((s, t) => s + t.amount, 0),
        count: txns.length,
      };
    })
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "rgba(255,255,255,0.92)",
        border: "1px solid rgba(99,102,241,0.1)",
        boxShadow:
          "0 2px 12px rgba(99,102,241,0.06), 0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            Category Breakdown
          </h2>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">
            Expense distribution
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center 
                      justify-center text-xl"
          style={{ background: "rgba(99,102,241,0.08)" }}
        >
          🏷️
        </div>
      </div>

      {/* Empty */}
      {categoryTotals.length === 0 ? (
        <div className="flex flex-col items-center py-10 text-gray-400">
          <span className="text-4xl mb-3"
            style={{ animation: "float 3s ease-in-out infinite",
                     display: "inline-block" }}>
            📭
          </span>
          <p className="font-semibold text-sm">No expense data yet</p>
          <p className="text-xs mt-1 text-gray-300">
            Add expenses to see breakdown
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {categoryTotals.map((cat) => {
            const pct = getPercentage(cat.total, totalExpenses);
            return (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center 
                                  justify-center text-base"
                      style={{
                        background: `${cat.color}18`,
                      }}
                    >
                      {cat.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-700">
                        {cat.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {cat.count} txn{cat.count !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-800">
                      {formatCurrency(cat.total)}
                    </p>
                    <p className="text-xs text-gray-400">{pct}%</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div
                  className="w-full rounded-full overflow-hidden"
                  style={{ height: 8, background: "#f1f5f9" }}
                >
                  <div
                    className="progress-fill"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${cat.color}cc, ${cat.color})`,
                    }}
                  />
                </div>
              </div>
            );
          })}

          {/* Total */}
          <div
            className="flex items-center justify-between pt-4 mt-2"
            style={{ borderTop: "1px solid #f1f5f9" }}
          >
            <span className="text-sm font-bold text-gray-600">
              Total Expenses
            </span>
            <span className="text-base font-black text-rose-500">
              {formatCurrency(totalExpenses)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryBreakdown;