import React, { useState, useEffect } from "react";
import { useExpense, CATEGORIES } from "../../context/ExpenseContext";
import { getTodayDate } from "../../utils/helpers";

const getDefaultForm = () => ({
  title: "", amount: "", type: "expense",
  category: "Food", date: getTodayDate(), note: "",
});

const TransactionForm = () => {
  const { addTransaction, updateTransaction,
          editingTransaction, clearEditing } = useExpense();

  const [form, setForm]               = useState(getDefaultForm());
  const [errors, setErrors]           = useState({});
  const [isOpen, setIsOpen]           = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      setForm({ ...editingTransaction,
                amount: String(editingTransaction.amount) });
      setIsOpen(true);
      setErrors({});
    }
  }, [editingTransaction]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0)
      e.amount = "Enter a valid amount";
    if (!form.date) e.date = "Date is required";
    return e;
  };

  const handleChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 300));
    if (editingTransaction)
      updateTransaction({ ...form, id: editingTransaction.id });
    else addTransaction(form);
    setForm(getDefaultForm());
    setErrors({});
    setIsOpen(false);
    setIsSubmitting(false);
    clearEditing();
  };

  const handleCancel = () => {
    setForm(getDefaultForm());
    setErrors({});
    setIsOpen(false);
    clearEditing();
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "10px 16px",
    borderRadius: "12px",
    border: errors[field]
      ? "1.5px solid #f43f5e"
      : "1.5px solid #e2e8f0",
    background: errors[field] ? "#fff1f2" : "#f8fafc",
    fontSize: "14px",
    color: "#1e293b",
    outline: "none",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  });

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
      {/* Collapsed Button */}
      {!isOpen && !editingTransaction && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-center gap-3 
                     py-5 text-white font-bold text-sm"
          style={{
            background:
              "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)",
            boxShadow: "0 4px 16px rgba(99,102,241,0.35)",
          }}
        >
          <span
            className="w-7 h-7 rounded-full flex items-center 
                         justify-center text-lg font-black"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            +
          </span>
          Add New Transaction
        </button>
      )}

      {/* Form */}
      {(isOpen || editingTransaction) && (
        <div className="p-6">

          {/* Form Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black text-gray-800">
                {editingTransaction
                  ? "✏️ Edit Transaction"
                  : "➕ New Transaction"}
              </h2>
              <p className="text-xs text-gray-400 mt-0.5 font-medium">
                {editingTransaction
                  ? "Update details below"
                  : "Fill in the details below"}
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="w-9 h-9 rounded-xl flex items-center 
                         justify-center text-gray-400 font-bold"
              style={{ background: "#f1f5f9", border: "none" }}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Type Toggle */}
            <div
              className="flex p-1.5 rounded-xl gap-1"
              style={{ background: "#f1f5f9" }}
            >
              {[
                { value: "expense", label: "Expense",
                  icon: "📉", color: "#ef4444" },
                { value: "income",  label: "Income",
                  icon: "📈", color: "#10b981" },
              ].map(({ value, label, icon, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleChange("type", value)}
                  className="flex-1 flex items-center justify-center 
                               gap-2 py-2.5 rounded-lg text-sm font-bold 
                               transition-all"
                  style={
                    form.type === value
                      ? {
                          background: color,
                          color: "white",
                          boxShadow: `0 4px 12px ${color}55`,
                        }
                      : { color: "#94a3b8" }
                  }
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-gray-600 
                                uppercase tracking-wider mb-1.5">
                Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g. Grocery shopping..."
                style={inputStyle("title")}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  ⚠️ {errors.title}
                </p>
              )}
            </div>

            {/* Amount + Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 
                                  uppercase tracking-wider mb-1.5">
                  Amount *
                </label>
                <div className="relative">
                  <span
                    className="absolute left-3 top-1/2 -translate-y-1/2 
                                 font-bold text-sm text-gray-400"
                  >
                    ₹
                  </span>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) =>
                      handleChange("amount", e.target.value)
                    }
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    style={{ ...inputStyle("amount"), paddingLeft: "28px" }}
                  />
                </div>
                {errors.amount && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    ⚠️ {errors.amount}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 
                                  uppercase tracking-wider mb-1.5">
                  Date *
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  style={inputStyle("date")}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-gray-600 
                                uppercase tracking-wider mb-2">
                Category
              </label>
              <div className="grid grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => handleChange("category", cat.name)}
                    className="flex flex-col items-center gap-1 p-2.5 
                               rounded-xl text-xs font-bold transition-all"
                    style={
                      form.category === cat.name
                        ? {
                            background: "rgba(99,102,241,0.08)",
                            border: "1.5px solid #6366f1",
                            color: "#6366f1",
                          }
                        : {
                            background: "#f8fafc",
                            border: "1.5px solid #e2e8f0",
                            color: "#64748b",
                          }
                    }
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs font-bold text-gray-600 
                                uppercase tracking-wider mb-1.5">
                Note (Optional)
              </label>
              <textarea
                value={form.note}
                onChange={(e) => handleChange("note", e.target.value)}
                placeholder="Add any notes..."
                rows={2}
                style={{ ...inputStyle("note"), resize: "none" }}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 py-3 rounded-xl text-sm font-bold 
                           transition-all"
                style={{
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  color: "#64748b",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl text-white text-sm 
                           font-black transition-all"
                style={{
                  background: isSubmitting
                    ? "#94a3b8"
                    : "linear-gradient(135deg,#6366f1,#7c3aed)",
                  boxShadow: isSubmitting
                    ? "none"
                    : "0 4px 16px rgba(99,102,241,0.35)",
                }}
              >
                {isSubmitting
                  ? "⏳ Saving..."
                  : editingTransaction
                  ? "✅ Update"
                  : "➕ Add Transaction"}
              </button>
            </div>

          </form>
        </div>
      )}
    </div>
  );
};

export default TransactionForm;