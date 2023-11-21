import { Expense } from '../types/expense.type'

export const saveExpensesToLocal = (expenses: Expense[]): void => {
  localStorage.setItem('expenses', JSON.stringify(expenses))
}

export const saveExpenseMapToLocal = (expenseMap: Map<string, number>): void => {
  console.log(JSON.stringify(Object.fromEntries(expenseMap.entries())))
  localStorage.setItem('expenseMapEntries', JSON.stringify(Object.fromEntries(expenseMap.entries())))
}

export const clearExpensesFromLocal = (createBackup: boolean = false): void => {
  if (createBackup) {
    localStorage.setItem('expenses.backup', localStorage.getItem('expenses') ?? '[]')
    localStorage.setItem('expensesMap.backup', localStorage.getItem('expenseMap') ?? '[]')
  }
  localStorage.setItem('expenses', '[]')
  localStorage.setItem('expensesMap', '{}')
}
