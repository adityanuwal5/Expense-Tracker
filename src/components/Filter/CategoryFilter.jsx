import React from "react";
import { useExpense, CATEGORIES } from "../../context/ExpenseContext";

const CategoryFilter = () => {
  const { filter, setFilter, transactions } = useExpense();

  const allFilters = [
    { name: "All", icon: "🔍" },
    ...CATEGORIES,
  ];

  const getCount = (name) => {
    if (name === "All") return transactions.length;
    return transactions.filter((t) => t.category === name).length;
  };

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.92)",
        border: "1px solid rgba(99,102,241,0.1)",
        boxShadow:
          "0 2px 12px rgba(99,102,241,0.06), 0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center 
                      justify-center text-sm"
          style={{ background: "rgba(99,102,241,0.1)" }}
        >
          🏷️
        </div>
        <h3 className="text-sm font-black text-gray-700 uppercase 
                       tracking-wider">
          Filter by Category
        </h3>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-2">
        {allFilters.map((cat) => {
          const count  = getCount(cat.name);
          const active = filter === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setFilter(cat.name)}
              className="flex items-center gap-1.5 px-3 py-1.5 
                         rounded-full text-sm font-semibold 
                         transition-all duration-200"
              style={
                active
                  ? {
                      background:
                        "linear-gradient(135deg,#6366f1,#7c3aed)",
                      color: "white",
                      border: "1px solid transparent",
                      boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
                      transform: "scale(1.05)",
                    }
                  : {
                      background: "#f8fafc",
                      color: "#475569",
                      border: "1px solid #e2e8f0",
                    }
              }
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              {count > 0 && (
                <span
                  className="text-xs rounded-full px-1.5 py-0.5 font-bold"
                  style={
                    active
                      ? { background: "rgba(255,255,255,0.25)",
                          color: "white" }
                      : { background: "#e2e8f0", color: "#64748b" }
                  }
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;