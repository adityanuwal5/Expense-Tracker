import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useExpense } from "../../context/ExpenseContext";
import { formatCurrency } from "../../utils/helpers";

const ExportButton = () => {
  const { transactions, totalIncome, totalExpenses, balance } =
    useExpense();
  const [showMenu, setShowMenu] = useState(false);

  const exportCSV = () => {
    if (!transactions.length) {
      alert("No transactions to export!");
      return;
    }
    const rows = [
      ["#", "Date", "Title", "Type", "Category", "Amount", "Note"],
      ...transactions.map((t, i) => [
        i + 1, t.date, t.title,
        t.type.charAt(0).toUpperCase() + t.type.slice(1),
        t.category, t.amount, t.note || "",
      ]),
      [],
      ["SUMMARY"],
      ["Total Income",   "", "", "", "", totalIncome],
      ["Total Expenses", "", "", "", "", totalExpenses],
      ["Net Balance",    "", "", "", "", balance],
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${c}"`).join(","))
      .join("\n");
    saveAs(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
      `expense-tracker-v2-${new Date().toISOString().split("T")[0]}.csv`
    );
    setShowMenu(false);
  };

  const exportExcel = () => {
    if (!transactions.length) {
      alert("No transactions to export!");
      return;
    }
    const wb = XLSX.utils.book_new();

    // Sheet 1
    const ws1 = XLSX.utils.json_to_sheet(
      transactions.map((t, i) => ({
        "#": i + 1, Date: t.date, Title: t.title,
        Type: t.type.charAt(0).toUpperCase() + t.type.slice(1),
        Category: t.category, Amount: t.amount, Note: t.note || "",
      }))
    );
    ws1["!cols"] = [
      { wch: 5 }, { wch: 12 }, { wch: 25 },
      { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 30 },
    ];
    XLSX.utils.book_append_sheet(wb, ws1, "Transactions");

    // Sheet 2
    const ws2 = XLSX.utils.json_to_sheet([
      { Metric: "Total Transactions", Value: transactions.length },
      { Metric: "Total Income",       Value: totalIncome,
        Formatted: formatCurrency(totalIncome) },
      { Metric: "Total Expenses",     Value: totalExpenses,
        Formatted: formatCurrency(totalExpenses) },
      { Metric: "Net Balance",        Value: balance,
        Formatted: formatCurrency(balance) },
      { Metric: "Export Date",        Value: new Date().toLocaleDateString() },
    ]);
    ws2["!cols"] = [{ wch: 22 }, { wch: 15 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, ws2, "Summary");

    // Sheet 3
    const cats = {};
    transactions.forEach((t) => {
      if (!cats[t.category])
        cats[t.category] = { income: 0, expenses: 0, count: 0 };
      if (t.type === "income") cats[t.category].income += t.amount;
      else cats[t.category].expenses += t.amount;
      cats[t.category].count++;
    });
    const ws3 = XLSX.utils.json_to_sheet(
      Object.entries(cats).map(([name, d]) => ({
        Category: name,
        Income: d.income,
        Expenses: d.expenses,
        Transactions: d.count,
        Net: d.income - d.expenses,
      }))
    );
    ws3["!cols"] = [
      { wch: 15 }, { wch: 12 }, { wch: 12 },
      { wch: 14 }, { wch: 12 },
    ];
    XLSX.utils.book_append_sheet(wb, ws3, "By Category");

    XLSX.writeFile(
      wb,
      `expense-tracker-v2-${new Date().toISOString().split("T")[0]}.xlsx`
    );
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl 
                   text-sm font-bold text-white transition-all"
        style={{
          background:
            "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          boxShadow: "0 4px 14px rgba(16,185,129,0.35)",
        }}
      >
        <span>📤</span>
        <span>Export</span>
        <span style={{
          display: "inline-block",
          transition: "transform 0.2s",
          transform: showMenu ? "rotate(180deg)" : "rotate(0deg)",
        }}>
          ▼
        </span>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div
            className="absolute right-0 top-12 z-20 min-w-[210px] 
                        overflow-hidden animate-fadeIn"
            style={{
              background: "white",
              borderRadius: "18px",
              border: "1px solid rgba(99,102,241,0.1)",
              boxShadow:
                "0 4px 6px rgba(0,0,0,0.04), 0 20px 44px rgba(99,102,241,0.13)",
            }}
          >
            {/* Menu Header */}
            <div
              className="px-4 py-3"
              style={{
                background: "#f8fafc",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <p className="text-xs font-black text-gray-500 uppercase 
                            tracking-wider">
                Export Data
              </p>
              <p className="text-xs text-gray-400 mt-0.5 font-medium">
                {transactions.length} transactions ready
              </p>
            </div>

            {/* CSV */}
            <button
              onClick={exportCSV}
              className="w-full flex items-center gap-3 px-4 py-3 
                         text-left transition-all"
              style={{ border: "none", background: "none" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f0fdf4")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "none")
              }
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center 
                            justify-center text-xl"
                style={{ background: "#dcfce7" }}
              >
                📄
              </div>
              <div>
                <p className="text-sm font-bold text-gray-700">
                  Export as CSV
                </p>
                <p className="text-xs text-gray-400 font-medium">
                  Simple spreadsheet
                </p>
              </div>
            </button>

            <div style={{ height: 1, background: "#f1f5f9",
                          margin: "0 16px" }} />

            {/* Excel */}
            <button
              onClick={exportExcel}
              className="w-full flex items-center gap-3 px-4 py-3 
                         text-left transition-all"
              style={{ border: "none", background: "none" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#eff6ff")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "none")
              }
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center 
                            justify-center text-xl"
                style={{ background: "#dbeafe" }}
              >
                📊
              </div>
              <div>
                <p className="text-sm font-bold text-gray-700">
                  Export as Excel
                </p>
                <p className="text-xs text-gray-400 font-medium">
                  3 sheets with full data
                </p>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExportButton;