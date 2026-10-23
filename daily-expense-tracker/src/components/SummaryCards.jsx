function SummaryCards({ expenses }) {
  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0); // Calculate total spending
  const today = new Date().toISOString().split('T')[0]; // Get today's date
  // Calculate today's spending
  const todayTotal = expenses
    .filter((expense) => expense.date === today)
    .reduce((sum, expense) => sum + Number(expense.amount), 0);

  return (
    <section className="summary-grid" aria-label="Expense summary">
      <article className="summary-card">
        <span>Total spending</span>
        <strong>${total.toFixed(2)}</strong>
        <small>All saved expenses</small>
      </article>

      <article className="summary-card">
        <span>Today</span>
        <strong>${todayTotal.toFixed(2)}</strong>
        <small>Today's spending</small>
      </article>

      <article className="summary-card">
        <span>Transactions</span>
        <strong>{expenses.length}</strong>
        <small>Saved entries</small>
      </article>
    </section>
  );
}

export default SummaryCards;
