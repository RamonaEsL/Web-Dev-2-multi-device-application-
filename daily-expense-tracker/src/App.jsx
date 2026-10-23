import { useEffect, useMemo, useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import FilterBar from './components/FilterBar';
import SummaryCards from './components/SummaryCards';

function App() {
  // Main app data
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Load expenses from Express
  const loadExpenses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/expenses');
      if (!response.ok) throw new Error('Could not load expenses.');
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  // Add a new expense
  const addExpense = async (formData) => {
    setMessage('');

    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not add expense.');

      setMessage('Expense added successfully.');
      await loadExpenses();
      return true;
    } catch (error) {
      setMessage(error.message);
      return false;
    }
  };

  // Delete one expense.
const deleteExpense = async (id) => {
  const confirmDelete = window.confirm(
    'Are you sure you want to delete this expense?'
  );

  if (!confirmDelete) {
    return;
  }

  setMessage('');

  try {
    const response = await fetch(`/api/expenses/${id}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Could not delete expense.');
    }

    setMessage('Expense deleted.');
    await loadExpenses();

  } catch (error) {
    setMessage(error.message);
  }
};

  // Build the category filter options
  const categories = useMemo(() => {
    const names = expenses.map((expense) => expense.category);
    return ['All', ...new Set(names)];
  }, [expenses]);

  // Filter the visible expense list
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const matchesCategory = category === 'All' || expense.category === category;
      const text = `${expense.description} ${expense.category}`.toLowerCase();
      const matchesSearch = text.includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [expenses, category, search]);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-icon">S</div>
          <div>
            <p className="eyebrow">DAILY EXPENSE TRACKER</p>
            <h1>SpendWise</h1>
          </div>
        </div>
      </header>

      <main className="page-content">
        <section className="hero">
          <p className="eyebrow accent">YOUR MONEY, MADE SIMPLE</p>
          <h2>Track daily spending without the stress.</h2>
          <p>Add expenses, view your totals, filter transactions, and keep a simple record of where your money goes.</p>
        </section>

        <SummaryCards expenses={expenses} />

        {message && <div className="status-message">{message}</div>}

        <section className="workspace">
          <div className="form-panel">
            <div className="section-heading">
              <p className="eyebrow accent">NEW ENTRY</p>
              <h3>Add an expense</h3>
            </div>
            <ExpenseForm onAdd={addExpense} />
          </div>

          <div className="list-panel">
            <div className="section-heading list-heading">
              <div>
                <p className="eyebrow accent">TRANSACTIONS</p>
                <h3>Recent expenses</h3>
              </div>
              <span className="result-count">{filteredExpenses.length} shown</span>
            </div>

            <FilterBar
              search={search}
              setSearch={setSearch}
              category={category}
              setCategory={setCategory}
              categories={categories}
            />

            {loading ? (
              <p className="empty-state">Loading expenses...</p>
            ) : (
              <ExpenseList expenses={filteredExpenses} onDelete={deleteExpense} />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
