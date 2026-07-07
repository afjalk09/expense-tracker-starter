import { useState, useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import './App.css'

function App() {
  const [transactions, setTransactions] = useState([
    { id: 1, description: "Salary", amount: 5000, type: "income", category: "salary", date: "2025-01-01" },
    { id: 2, description: "Rent", amount: 1200, type: "expense", category: "housing", date: "2025-01-02" },
    { id: 3, description: "Groceries", amount: 150, type: "expense", category: "food", date: "2025-01-03" },
    { id: 4, description: "Freelance Work", amount: 800, type: "income", category: "salary", date: "2025-01-05" },
    { id: 5, description: "Electric Bill", amount: 95, type: "expense", category: "utilities", date: "2025-01-06" },
    { id: 6, description: "Dinner Out", amount: 65, type: "expense", category: "food", date: "2025-01-07" },
    { id: 7, description: "Gas", amount: 45, type: "expense", category: "transport", date: "2025-01-08" },
    { id: 8, description: "Netflix", amount: 15, type: "expense", category: "entertainment", date: "2025-01-10" },
  ]);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("food");
  const [errors, setErrors] = useState({});
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const categories = ["food", "housing", "utilities", "transport", "entertainment", "salary", "other"];

  const spendingByCategory = useMemo(() => {
    const expenses = transactions.filter(t => t.type === "expense");
    const totals = {};
    expenses.forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const COLORS = ["#1B7A5A", "#C73A3A", "#D4A030", "#3B6EA5", "#8B5CF6", "#D97706", "#64748B"];

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = spendingByCategory.reduce((sum, c) => sum + c.value, 0);

  const balance = totalIncome - totalExpenses;

  const formatCurrency = (value) =>
    value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const filteredTransactions = useMemo(() => {
    let filtered = transactions;
    if (filterType !== "all") {
      filtered = filtered.filter(t => t.type === filterType);
    }
    if (filterCategory !== "all") {
      filtered = filtered.filter(t => t.category === filterCategory);
    }
    return filtered;
  }, [transactions, filterType, filterCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!description.trim()) newErrors.description = "Description is required";
    if (!amount || Number(amount) <= 0) newErrors.amount = "Valid amount is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const newTransaction = {
      id: Date.now(),
      description,
      amount: Number(amount),
      type,
      category,
      date: new Date().toISOString().split('T')[0],
    };

    setTransactions([...transactions, newTransaction]);
    setDescription("");
    setAmount("");
    setType("expense");
    setCategory("food");
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const balanceStatus = balance > 0 ? "positive" : balance < 0 ? "negative" : "balanced";

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-inner">
          <div className="hero-top">
            <h1 className="hero-title">Finance Tracker</h1>
            <span className={`hero-status hero-status--${balanceStatus}`}>
              <span className={`hero-dot hero-dot--${balanceStatus}`} />
              {balanceStatus === "positive" && `$${formatCurrency(balance)} positive`}
              {balanceStatus === "negative" && `$${formatCurrency(Math.abs(balance))} negative`}
              {balanceStatus === "balanced" && "Balanced"}
            </span>
          </div>
          <div className="hero-balance">
            <span className="hero-currency">$</span>
            <span className="hero-number">
              {balance >= 0 ? formatCurrency(balance) : `(${formatCurrency(Math.abs(balance))})`}
            </span>
          </div>
          <div className="hero-line" />
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-arrow hero-stat-arrow--up">↗</span>
              <span className="hero-stat-value hero-stat-value--income">${formatCurrency(totalIncome)}</span>
              <span className="hero-stat-label">Income</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-arrow hero-stat-arrow--down">↘</span>
              <span className="hero-stat-value hero-stat-value--expense">${formatCurrency(totalExpenses)}</span>
              <span className="hero-stat-label">Expenses</span>
            </div>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="panel">
          <section className="card chart-card">
            <h2 className="card-title">Spending by Category</h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={spendingByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={85}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {spendingByCategory.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={value => [`$${value}`]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </section>

          <section className="card form-card">
            <h2 className="card-title">Add Transaction</h2>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="field-label">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Freelance payment"
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); setErrors(prev => ({ ...prev, description: undefined })); }}
                  className={errors.description ? "input-error" : ""}
                />
                {errors.description && <span className="field-error">{errors.description}</span>}
              </div>
              <div className="field">
                <label className="field-label">Amount</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => { setAmount(e.target.value); setErrors(prev => ({ ...prev, amount: undefined })); }}
                  className={errors.amount ? "input-error" : ""}
                />
                {errors.amount && <span className="field-error">{errors.amount}</span>}
              </div>
              <div className="form-row">
                <div className="field">
                  <label className="field-label">Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div className="field">
                  <label className="field-label">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn">Add Transaction</button>
            </form>
          </section>
        </div>

        <section className="card table-card">
          <div className="table-header">
            <h2 className="card-title">Transactions</h2>
            <div className="table-filters">
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th className="th-amount">Amount</th>
                  <th className="th-action">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-row">No transactions match your filters.</td>
                  </tr>
                ) : (
                  filteredTransactions.map(t => (
                    <tr key={t.id}>
                      <td className="cell-date">{t.date}</td>
                      <td className="cell-desc">{t.description}</td>
                      <td><span className="tag">{t.category}</span></td>
                      <td className={`cell-amount cell-amount--${t.type}`}>
                        <span className="cell-mono">
                          {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
                        </span>
                      </td>
                      <td className="cell-action">
                        <button className="btn-delete" onClick={() => handleDelete(t.id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App
