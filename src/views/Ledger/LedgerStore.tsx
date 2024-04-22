import { create } from 'zustand'
import { Expense } from '../../types/expense.type'
import { subscribeWithSelector, persist } from 'zustand/middleware'
import { LedgerEntry } from '../../types/ledgerEntry.type'
import { Carryover } from '../../types/carryover.type'
import { AccountCategory } from '../../types/accountCategory.type'

interface LedgerState {
  expenses: Expense[]
  accountTotals: AccountTotals
  accountCategories: AccountCategory[]
  setAccountCategories(categories: AccountCategory[]): void
  addExpense(expense: Expense): void
  deleteExpense(expense: Expense): void
  updateExpense(expense: Expense): void
  clearExpenses(): void
  reconcileAccountBy(account: string, amount: number): void
  clearAccountTotals(): void
  createLedgerEntry(): LedgerEntry
}

type AccountTotals = {
  [account: string]: number
}

const subtractFromAccountTotalsHandler = (accountTotals: AccountTotals, account: string, amount: number) => {
  const newExpenseMap = { ...accountTotals }
  const prevTotal = newExpenseMap[account] ?? 0
  const newTotal = Math.max(prevTotal - amount, 0)
  if (newTotal === 0) {
    delete newExpenseMap[account]
  } else {
    newExpenseMap[account] = newTotal
  }
  return newExpenseMap
}

const addToAccountTotalsHandler = (accountTotals: AccountTotals, account: string, amount: number) => {
  const newExpenseMap = { ...accountTotals }
  const prevTotal = newExpenseMap[account] ?? 0
  const newTotal = prevTotal + amount
  newExpenseMap[account] = newTotal
  return newExpenseMap
}

export const useLedgerStore = create<LedgerState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        expenses: [],
        accountTotals: {},
        accountCategories: [],
        setAccountCategories(categories: AccountCategory[]) {
          set({ accountCategories: categories })
        },
        addExpense(expense: Expense) {
          set((state) => {
            const newAccountTotals = addToAccountTotalsHandler(state.accountTotals, expense.account, expense.amount)
            const newExpenses = [...state.expenses, expense]

            return {
              ...state,
              expenses: newExpenses,
              accountTotals: newAccountTotals,
            }
          })
        },
        deleteExpense(expense: Expense) {
          set((state) => {
            const newAccountTotals = subtractFromAccountTotalsHandler(
              state.accountTotals,
              expense.account,
              expense.amount
            )
            const newExpenses = state.expenses.filter((item) => item.id !== expense.id)

            return {
              ...state,
              expenses: newExpenses,
              accountTotals: newAccountTotals,
            }
          })
        },
        updateExpense(expense: Expense) {
          set((state) => {
            const newExpenses = state.expenses
            const expIndex = state.expenses.findIndex((item) => item.id === expense.id)
            const oldExp = state.expenses[expIndex]

            newExpenses[expIndex] = expense

            if (oldExp.account === expense.account) {
              return {
                ...state,
                expenses: newExpenses,
              }
            }

            const tempTotals = subtractFromAccountTotalsHandler(state.accountTotals, oldExp.account, oldExp.amount)
            const newAccountTotals = addToAccountTotalsHandler(tempTotals, expense.account, expense.amount)

            return {
              ...state,
              expenses: newExpenses,
              accountTotals: newAccountTotals,
            }
          })
        },
        clearExpenses() {
          set({ expenses: [] })
        },
        clearAccountTotals() {
          set({ accountTotals: {} })
        },
        reconcileAccountBy(account: string, amount: number) {
          set((state) => {
            const newAccountTotals = subtractFromAccountTotalsHandler(state.accountTotals, account, amount)
            return { accountTotals: newAccountTotals }
          })
        },
        createLedgerEntry() {
          const { expenses, accountTotals } = get()

          const ledgerEntry: LedgerEntry = {
            date: new Date(),
            expenses: expenses,
            carryovers: Object.entries(accountTotals).map(([acct, total]) => {
              return { account: acct, amount: total }
            }),
          }

          return ledgerEntry
        },
      }),
      {
        name: 'ledger-storage',
      }
    )
  )
)
