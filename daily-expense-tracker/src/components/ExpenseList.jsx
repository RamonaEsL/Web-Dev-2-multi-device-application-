function ExpenseList({ expenses, onDelete }) {
  if (expenses.length === 0) {
    return <p className="empty-state">No expenses match your search.</p>;
  }

  return (
    <div className="expense-list">

      {/* Display each expense */}
      {expenses.map((expense) => (
        <article className="expense-item" key={expense.id}>
          {/* Expense information */}
          <div className="expense-main">
            {/* Category colour */}
            <span className={`category-dot ${expense.category.toLowerCase()}`}></span>
            <div>
              <h4>{expense.description}</h4>
              <p>{expense.category} · {expense.date}</p>
            </div>
          </div>

          <div className="expense-actions">
            <strong>${Number(expense.amount).toFixed(2)}</strong>
            <button type="button" onClick={() => onDelete(expense.id)} aria-label={`Delete ${expense.description}`}>
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default ExpenseList;
