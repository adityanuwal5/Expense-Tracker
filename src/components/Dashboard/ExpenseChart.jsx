import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import { useExpense } from "../../context/ExpenseContext";
import { formatCurrency } from "../../utils/helpers";

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "white", border: "1px solid rgba(99,102,241,0.15)",
      borderRadius: "16px", padding: "12px 16px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    }}>
      <p style={{ fontWeight: 700, color: "#374151", marginBottom: 6, fontSize: 13 }}>
        {label}
      </p>
      {payload.map((entry, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center",
                              gap: 8, fontSize: 12, marginBottom: 2 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%",
                         background: entry.color, display: "inline-block" }} />
          <span style={{ color: "#6b7280" }}>{entry.name}:</span>
          <span style={{ fontWeight: 700, color: entry.color }}>
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

const CustomPieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div style={{
      background: "white", borderRadius: "14px", padding: "10px 14px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
      border: "1px solid rgba(99,102,241,0.1)",
    }}>
      <p style={{ fontWeight: 700, color: "#374151", fontSize: 13 }}>
        {d.name}
      </p>
      <p style={{ color: "#6b7280", fontSize: 12, marginTop: 2 }}>
        {formatCurrency(d.value)}
      </p>
    </div>
  );
};

const EmptyChart = ({ message }) => (
  <div style={{ display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                height: 260, color: "#94a3b8" }}>
    <div style={{ fontSize: 48, marginBottom: 12,
                  animation: "float 3s ease-in-out infinite" }}>
      📊
    </div>
    <p style={{ fontWeight: 600, fontSize: 14 }}>{message}</p>
    <p style={{ fontSize: 12, marginTop: 4, color: "#cbd5e1" }}>
      Start adding transactions
    </p>
  </div>
);

const ExpenseChart = () => {
  const { monthlyData, categoryData } = useExpense();
  const [activeTab, setActiveTab] = useState("bar");

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            Financial Overview
          </h2>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">
            Visualize your spending patterns
          </p>
        </div>

        {/* Tab Toggle */}
        <div
          className="flex p-1 gap-1 rounded-xl"
          style={{ background: "#f1f5f9" }}
        >
          {[
            { key: "bar", icon: "📊", label: "Monthly" },
            { key: "pie", icon: "🥧", label: "Category" },
          ].map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="flex items-center gap-1.5 px-3 py-1.5 
                         rounded-lg text-xs font-bold transition-all"
              style={
                activeTab === key
                  ? {
                      background: "white",
                      color: "#6366f1",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                    }
                  : { color: "#94a3b8" }
              }
            >
              <span>{icon}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bar Chart */}
      {activeTab === "bar" && (
        monthlyData.length === 0 ? (
          <EmptyChart message="No monthly data available" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3"
                stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month"
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: "#94a3b8" }}
                axisLine={false} tickLine={false}
                tickFormatter={(v) => `₹${v}`} />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend iconType="circle" iconSize={8}
                wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="income" name="Income"
                fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={40} />
              <Bar dataKey="expenses" name="Expenses"
                fill="#F43F5E" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )
      )}

      {/* Pie Chart */}
      {activeTab === "pie" && (
        categoryData.length === 0 ? (
          <EmptyChart message="No category data available" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={categoryData} dataKey="total"
                nameKey="name" cx="50%" cy="50%"
                innerRadius={60} outerRadius={100} paddingAngle={3}>
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color}
                    stroke="white" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend iconType="circle" iconSize={8}
                wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        )
      )}
    </div>
  );
};

export default ExpenseChart;