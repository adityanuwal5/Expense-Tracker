import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
} from "react";
import useLocalStorage from "../hooks/useLocalStorage";

// ── Categories ────────────────────────────────────────────────────────────────
export const CATEGORIES = [
  { name: "Food",      icon: "🍔", color: "#FF6384" },
  { name: "Travel",    icon: "✈️",  color: "#36A2EB" },
  { name: "Bills",     icon: "📄", color: "#FFCE56" },
  { name: "Shopping",  icon: "🛍️", color: "#4BC0C0" },
  { name: "Health",    icon: "🏥", color: "#9966FF" },
  { name: "Education", icon: "📚", color: "#FF9F40" },
  { name: "Income",    icon: "💰", color: "#2ECC71" },
  { name: "Other",     icon: "📦", color: "#95A5A6" },
];

// ── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
  transactions: [],
  filter: "All",
  editingTransaction: null,
};

// ── Reducer ───────────────────────────────────────────────────────────────────
const expenseReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter(
          (t) => t.id !== action.payload
        ),
      };
    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
        editingTransaction: null,
      };
    case "SET_FILTER":
      return { ...state, filter: action.payload };
    case "SET_EDITING":
      return { ...state, editingTransaction: action.payload };
    case "CLEAR_EDITING":
      return { ...state, editingTransaction: null };
    default:
      return state;
  }
};

// ── Monthly Chart Data ────────────────────────────────────────────────────────
const getMonthlyData = (transactions) => {
  const months = {};
  transactions.forEach((t) => {
    const month = t.date?.substring(0, 7);
    if (!month) return;
    if (!months[month]) months[month] = { income: 0, expenses: 0 };
    if (t.type === "income") months[month].income += t.amount;
    else months[month].expenses += t.amount;
  });
  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, data]) => ({
      month: new Date(month + "-01").toLocaleString("default", {
        month: "short",
        year: "2-digit",
      }),
      ...data,
    }));
};

// ── Context ───────────────────────────────────────────────────────────────────
const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [savedTransactions, setSavedTransactions] = useLocalStorage(
    "expense-tracker-v2",
    []
  );

  const [state, dispatch] = useReducer(expenseReducer, {
    ...initialState,
    transactions: savedTransactions,
  });

  useEffect(() => {
    setSavedTransactions(state.transactions);
  }, [state.transactions]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const addTransaction = (transaction) => {
    dispatch({
      type: "ADD_TRANSACTION",
      payload: {
        ...transaction,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        amount: parseFloat(transaction.amount),
        createdAt: new Date().toISOString(),
      },
    });
  };

  const deleteTransaction = (id) =>
    dispatch({ type: "DELETE_TRANSACTION", payload: id });

  const updateTransaction = (transaction) =>
    dispatch({
      type: "UPDATE_TRANSACTION",
      payload: { ...transaction, amount: parseFloat(transaction.amount) },
    });

  const setFilter   = (filter) =>
    dispatch({ type: "SET_FILTER", payload: filter });

  const setEditing  = (transaction) =>
    dispatch({ type: "SET_EDITING", payload: transaction });

  const clearEditing = () =>
    dispatch({ type: "CLEAR_EDITING" });

  // ── Computed ───────────────────────────────────────────────────────────────
  const filteredTransactions =
    state.filter === "All"
      ? state.transactions
      : state.transactions.filter((t) => t.category === state.filter);

  const totalIncome = state.transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = state.transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const categoryData = CATEGORIES.map((cat) => ({
    ...cat,
    total: state.transactions
      .filter((t) => t.category === cat.name && t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0),
  })).filter((cat) => cat.total > 0);

  const monthlyData = getMonthlyData(state.transactions);

  const thisMonth = new Date().toISOString().substring(0, 7);
  const thisMonthExpenses = state.transactions
    .filter((t) => t.type === "expense" && t.date?.startsWith(thisMonth))
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsRate =
    totalIncome > 0
      ? (((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)
      : 0;

  return (
    <ExpenseContext.Provider
      value={{
        transactions: state.transactions,
        filteredTransactions,
        filter: state.filter,
        editingTransaction: state.editingTransaction,
        totalIncome,
        totalExpenses,
        balance,
        categoryData,
        monthlyData,
        thisMonthExpenses,
        savingsRate,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        setFilter,
        setEditing,
        clearEditing,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context)
    throw new Error("useExpense must be used within ExpenseProvider");
  return context;
};

export default ExpenseContext;