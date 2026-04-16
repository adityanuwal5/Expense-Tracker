import React from "react";
import { useExpense } from "../../context/ExpenseContext";
import { formatCurrency } from "../../utils/helpers";

const SummaryCard = ({ title, amount, icon, gradient, badge }) => (
  <div
    className="relative overflow-hidden rounded-2xl p-6 cursor-default"
    style={{
      background: gradient,
      boxShadow:
        "0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)",
      minHeight: "160px",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
      e.currentTarget.style.boxShadow =
        "0 24px 48px rgba(0,0,0,0.2), 0 8px 16px rgba(0,0,0,0.1)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0) scale(1)";
      e.currentTarget.style.boxShadow =
        "0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.08)";
    }}
  >
    {/* Decorative circles */}
    <div style={{
      position: "absolute", top: "-40px", right: "-40px",
      width: "150px", height: "150px", borderRadius: "50%",
      background: "rgba(255,255,255,0.12)", pointerEvents: "none",
    }} />
    <div style={{
      position: "absolute", bottom: "-28px", right: "48px",
      width: "100px", height: "100px", borderRadius: "50%",
      background: "rgba(255,255,255,0.08)", pointerEvents: "none",
    }} />
    <div style={{
      position: "absolute", top: "50%", left: "-24px",
      width: "70px", height: "70px", borderRadius: "50%",
      background: "rgba(255,255,255,0.06)", pointerEvents: "none",
      transform: "translateY(-50%)",
    }} />

    {/* Content */}
    <div className="relative z-10 flex flex-col h-full gap-4">

      {/* Icon + Badge */}
      <div className="flex items-start justify-between">
        <div
          className="w-12 h-12 rounded-xl flex items-center
                      justify-center text-2xl"
          style={{
            background: "rgba(255,255,255,0.22)",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          {icon}
        </div>
        <span
          className="text-xs font-bold px-3 py-1.5 rounded-full"
          style={{
            background: "rgba(255,255,255,0.22)",
            color: "rgba(255,255,255,0.95)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          {badge}
        </span>
      </div>

      {/* Label + Amount */}
      <div className="mt-auto">
        <p className="text-white/75 text-sm font-semibold mb-1">
          {title}
        </p>
        <p
          className="text-white text-3xl font-black tracking-tight"
          style={{ textShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
        >
          {formatCurrency(Math.abs(amount))}
        </p>
      </div>

    </div>
  </div>
);

const SummaryCards = () => {
  const {
    totalIncome, totalExpenses, balance,
    thisMonthExpenses, savingsRate, transactions,
  } = useExpense();

  const currentMonth = new Date().toLocaleString("default", {
    month: "short",
  });

  const cards = [
    {
      title: "Total Income",
      amount: totalIncome,
      icon: "📈",
      gradient:
        "linear-gradient(135deg, #10b981 0%, #059669 50%, #0d9488 100%)",
      badge: "All Time",
    },
    {
      title: "Total Expenses",
      amount: totalExpenses,
      icon: "📉",
      gradient:
        "linear-gradient(135deg, #f43f5e 0%, #e11d48 50%, #db2777 100%)",
      badge: "All Time",
    },
    {
      title: "Net Balance",
      amount: balance,
      icon: balance >= 0 ? "✅" : "⚠️",
      gradient:
        balance >= 0
          ? "linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #7c3aed 100%)"
          : "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%)",
      badge: `${savingsRate}% saved`,
    },
    {
      title: `${currentMonth} Expenses`,
      amount: thisMonthExpenses,
      icon: "📅",
      gradient:
        "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #a855f7 100%)",
      badge: `${transactions.length} total`,
    },
  ];

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      style={{ padding: "4px 2px 12px 2px" }}
    >
      {cards.map((card, i) => (
        <SummaryCard key={i} {...card} />
      ))}
    </div>
  );
};

export default SummaryCards;