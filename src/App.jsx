import React from "react";
import { ExpenseProvider } from "./context/ExpenseContext";
import Header from "./components/Layout/Header";
import SummaryCards from "./components/Dashboard/SummaryCards";
import ExpenseChart from "./components/Dashboard/ExpenseChart";
import CategoryBreakdown from "./components/Dashboard/CategoryBreakdown";
import CategoryFilter from "./components/Filter/CategoryFilter";
import TransactionForm from "./components/Transactions/TransactionForm";
import TransactionList from "./components/Transactions/TransactionList";
import ExportButton from "./components/Export/ExportButton";

const App = () => {
  return (
    <ExpenseProvider>
      <div
        className="min-h-screen"
        style={{
          background:
            "linear-gradient(135deg,#eef2ff 0%,#f5f3ff 30%,#fdf4ff 65%,#f0fdf4 100%)",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Header */}
        <Header />

        {/* Main */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Page Title */}
          <div className="mb-7">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-gray-800 
                             tracking-tight">
                Dashboard
              </h2>
              <span
                className="text-xs font-black px-2.5 py-1 rounded-full 
                            text-white"
                style={{
                  background:
                    "linear-gradient(135deg,#6366f1,#7c3aed)",
                }}
              >
                V2
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-1 font-medium">
              Track and manage your personal finances
            </p>
          </div>

          {/* Summary Cards */}
          <section className="mb-8">
            <SummaryCards />
          </section>

          {/* Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left */}
            <div className="lg:col-span-2 space-y-5">
              <TransactionForm />
              <CategoryFilter />

              {/* Transaction History Header */}
              <div
                className="flex items-center justify-between 
                            px-5 py-4 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.92)",
                  border: "1px solid rgba(99,102,241,0.1)",
                  boxShadow:
                    "0 2px 12px rgba(99,102,241,0.06)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center 
                                justify-center text-xl"
                    style={{
                      background:
                        "linear-gradient(135deg,#6366f1,#7c3aed)",
                    }}
                  >
                    📋
                  </div>
                  <div>
                    <h2 className="text-base font-black text-gray-800">
                      Transaction History
                    </h2>
                    <p className="text-xs text-gray-400 font-medium">
                      All your financial records
                    </p>
                  </div>
                </div>
                <ExportButton />
              </div>

              <TransactionList />
            </div>

            {/* Right */}
            <div className="space-y-5">
              <ExpenseChart />
              <CategoryBreakdown />
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer
          className="mt-16 py-6"
          style={{
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(12px)",
            borderTop: "1px solid rgba(99,102,241,0.08)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center 
                            justify-between gap-2">
              <p
                className="text-sm font-black"
                style={{
                  background:
                    "linear-gradient(135deg,#6366f1,#7c3aed)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                💸 ExpenseTracker V2 — Personal Finance Manager
              </p>
              <p className="text-xs text-gray-400 font-medium">
                Built with React · Recharts · Tailwind CSS
              </p>
            </div>
          </div>
        </footer>

      </div>
    </ExpenseProvider>
  );
};

export default App;