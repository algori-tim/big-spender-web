import { useState, useEffect } from 'react'
import { Expense } from '../../types/expense.type'
import { AccountCategory } from '../../types/accountCategory.type'
import { getAccountsCategories, getAnyCarryovers, getLastLedger } from '../../Helpers/DataHelpers'
import { useLedgerStore } from './LedgerStore'
import Expenses from './components/Expenses'
import Totals from './components/Totals'
import './Ledger.css'

//TO DO:
// Add/Remove account or expense type
// reconsider how we're managing carryovers.
// look at saving ledger in actual remote location
const Ledger = () => {
  const { addExpense, clearExpenses, clearAccountTotals, createLedgerEntry } = useLedgerStore()

  const [categories, setCategories] = useState<AccountCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<number>(0)

  useEffect(() => {
    const setDropdowns = async () => {
      console.log('setting category data')
      const data = await getAccountsCategories()
      setCategories(data)
    }

    const getCarryovers = async () => {
      console.log('getting carryovers')
      const data = await getAnyCarryovers()
      let carryoverExpenses: Expense[] = []

      data.forEach((x) => {
        carryoverExpenses = [
          ...carryoverExpenses,
          {
            account: x.account,
            amount: x.amount,
            date: new Date().toISOString().split('T')[0],
            expenseType: 'carryover',
            note: '',
            id: Date.now().toString(),
          },
        ]
      })
    }

    setDropdowns()
    getCarryovers()
  }, [])

  const handleAddItem = (e: any): void => {
    e.preventDefault()
    const dateElement = document.getElementById('date-input') as HTMLInputElement
    const accountElement = document.getElementById('account-input') as HTMLInputElement
    const expenseTypeElement = document.getElementById('expense-type-input') as HTMLInputElement
    const amountElement = document.getElementById('amount-input') as HTMLInputElement
    const noteElement = document.getElementById('note-input') as HTMLInputElement
    const note = noteElement.value

    let newExpense = {
      date: dateElement.value,
      account: accountElement.value,
      expenseType: expenseTypeElement.value,
      amount: Number(amountElement.value),
      note: note,
      id: Date.now().toString(),
    }

    addExpense(newExpense)

    dateElement.focus()
    noteElement.value = ''
  }

  const handleClearData = () => {
    clearExpenses()
    clearAccountTotals()
  }

  const handleSaveData = () => {
    const ledger = createLedgerEntry()
    localStorage.setItem('LEDGER', JSON.stringify(ledger))
    // alert('We pretend this is saved to the cloud...')
    clearExpenses()
    clearAccountTotals()
  }

  return categories ? (
    <article>
      <form className='inputs-container'>
        <h3 className='imputs-label'>ADD NEW ITEM</h3>
        <div>
          <label htmlFor='date-input'>Date:</label>
          <input type='date' id='date-input' className='input' defaultValue={new Date().toISOString().split('T')[0]} />
        </div>
        <div>
          <label htmlFor='account-input'>Account:</label>
          <select id='account-input' className='input' onChange={(e) => setSelectedCategory(e.target.selectedIndex)}>
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor='expense-type-input'>Expense Type:</label>
          <select id='expense-type-input' className='input'>
            {categories[selectedCategory]?.subCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor='amount-input'>Amount:</label>
          <input type='number' id='amount-input' className='input' step='.01' />
        </div>
        <div>
          <label htmlFor='note-input'>Note:</label>
          <input type='text' id='note-input' className='input' />
        </div>
        <div className=''>
          <button className='add-item-button ledger-button' onClick={handleAddItem}>
            <span className='material-symbols-outlined'>add_task</span>
          </button>
        </div>
      </form>
      <Expenses />
      <Totals />
      <div className='button-container'>
        <button className='clear-data-button ledger-button' onClick={handleClearData}>
          <span className='material-symbols-outlined'>delete_history</span>
        </button>
        <button className='save-data-button ledger-button' onClick={handleSaveData}>
          <span className='material-symbols-outlined'>save</span>
        </button>
      </div>
    </article>
  ) : (
    <h1>Loading...</h1>
  )
}

export default Ledger
