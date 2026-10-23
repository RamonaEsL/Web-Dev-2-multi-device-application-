import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3001;

// Find the JSON data file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, 'data', 'expenses.json');

app.use(cors());
app.use(express.json());

// Read all expenses
async function readExpenses() {
  const file = await fs.readFile(dataFile, 'utf8');
  return JSON.parse(file);
}

// Save all expenses
async function saveExpenses(expenses) {
  await fs.writeFile(dataFile, JSON.stringify(expenses, null, 2));
}

// Get expense list
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await readExpenses();
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Could not read expense data.' });
  }
});

// Add a new expense
app.post('/api/expenses', async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;
    const numberAmount = Number(amount);

    if (!description?.trim() || !category || !date || !numberAmount || numberAmount <= 0) {
      return res.status(400).json({ message: 'Please enter valid expense details.' });
    }

    const expenses = await readExpenses();
    const newExpense = {
      id: Date.now(),
      description: description.trim(),
      amount: Number(numberAmount.toFixed(2)),
      category,
      date
    };

    expenses.push(newExpense);
    await saveExpenses(expenses);
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: 'Could not save the expense.' });
  }
});

// Delete an expense
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const expenses = await readExpenses();
    const updated = expenses.filter((expense) => expense.id !== id);

    if (updated.length === expenses.length) {
      return res.status(404).json({ message: 'Expense not found.' });
    }

    await saveExpenses(updated);
    res.json({ message: 'Expense deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Could not delete the expense.' });
  }
});

app.listen(PORT, () => {
  console.log(`Expense Tracker API running at http://localhost:${PORT}`);
});
