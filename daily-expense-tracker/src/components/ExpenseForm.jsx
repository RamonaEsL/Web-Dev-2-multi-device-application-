import { useState } from 'react';

// Expense categories
const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'];

function ExpenseForm({ onAdd }) {
  // Get today's date
  const today = new Date().toISOString().split('T')[0];

  // Form fields
  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: 'Food',
    date: today
  });
  const [submitting, setSubmitting] = useState(false);

  // Update input values
  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  // Submit new expense
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    const success = await onAdd(form);

    if (success) {
      setForm({ description: '', amount: '', category: 'Food', date: today });
    }

    setSubmitting(false);
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <label>
        Description
        <input type="text" name="description" value={form.description} onChange={updateField} placeholder="e.g. Lunch" maxLength="60" required />
      </label>

      <div className="form-row">
        <label>
          Amount ($)
          <input type="number" name="amount" value={form.amount} onChange={updateField} min="0.01" step="0.01" placeholder="0.00" required />
        </label>

        <label>
          Date
          <input type="date" name="date" value={form.date} onChange={updateField} required />
        </label>
      </div>

      <label>
        Category
        <select name="category" value={form.category} onChange={updateField}>
          {categories.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>

      <button className="primary-button" type="submit" disabled={submitting}>
        {submitting ? 'Adding...' : 'Add expense'}
      </button>
    </form>
  );
}

export default ExpenseForm;
