import { useState, useEffect } from 'react'
import { Expense } from '../../types/expense.type'
import { getAccountsCategories, getAnyCarryovers, getLastLedger } from '../../Helpers/DataHelpers'
import { useLedgerStore } from './LedgerStore'
import Expenses from './components/Expenses'
import Totals from './components/Totals'
import './Ledger.css'
import IconButton, { IconButtonColors } from '../../components/IconButton/IconButton'

//TO DO:
// Add/Remove account or expense type
// reconsider how we're managing carryovers.
// look at saving ledger in actual remote location
const Ledger = () => {
  const { addExpense, clearExpenses, clearAccountTotals, createLedgerEntry, setAccountCategories, accountCategories } =
    useLedgerStore()

  const [selectedCategory, setSelectedCategory] = useState<number>(0)

  useEffect(() => {
    const setDropdowns = async () => {
      console.log('setting category data')
      const data = await getAccountsCategories()
      setAccountCategories(data)
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
    localStorage.setItem(`LEDGER-${new Date().toLocaleDateString()}`, JSON.stringify(ledger))
    clearExpenses()
    clearAccountTotals()
  }

  return accountCategories.length > 0 ? (
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
            {accountCategories.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor='expense-type-input'>Expense Type:</label>
          <select id='expense-type-input' className='input'>
            {accountCategories[selectedCategory]?.subCategories.map((cat) => (
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
          <IconButton
            icon='icons/ledger/add.svg'
            color={IconButtonColors.green}
            iconAlt='Delete ledger entries.'
            onClick={handleAddItem}
          />
        </div>
      </form>
      <Expenses />
      <Totals />
      <div className='button-container'>
        <IconButton
          icon='icons/ledger/delete.svg'
          color={IconButtonColors.red}
          iconAlt='Delete ledger entries.'
          onClick={handleClearData}
        />
        <IconButton
          icon='icons/ledger/save.svg'
          color={IconButtonColors.green}
          iconAlt='Save ledger entries.'
          onClick={handleSaveData}
        />
      </div>
    </article>
  ) : (
    <h1>Loading...</h1>
  )
}

export default Ledger
