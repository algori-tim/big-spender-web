import { useState, useEffect } from 'react'
import { Expense } from '../../types/expense.type'
import { clearExpensesFromLocal, saveExpenseMapToLocal, saveExpensesToLocal } from '../../Helpers/StorageHelpers'
import { AccountCategory } from '../../types/accountCategory.type'
import { getAccountsCategories } from '../../Helpers/DataHelpers'
import './Ledger.css'
import Button, { ButtonStyle } from '../../components/shared/Button/Button'

const getGuid = (): string => {
  return Math.floor(Math.random() * 0x10000).toString(16)
}

const Ledger = () => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<AccountCategory[]>([])
  const [selectedCategoty, setSelectedCategoty] = useState<number>(0)
  const [expenseMap, setExpenseMap] = useState<Map<string, number>>(new Map<string, number>())

  useEffect(() => {
    const setDropdowns = async () => {
      console.log('setting category data')
      const data = await getAccountsCategories()
      setCategories(data)
    }

    const getLocalExpenses = () => {
      console.log('geting local data')
      const savedExpenses = localStorage.getItem('expenses')
      if (savedExpenses) {
        setExpenses(() => JSON.parse(savedExpenses))
      }

      const savedExpenseMap = localStorage.getItem('expenseMapEntries')
      if (savedExpenseMap) {
        console.log(savedExpenseMap)
        setExpenseMap(() => new Map(Object.entries(JSON.parse(savedExpenseMap))))
      }
    }

    setDropdowns()
    getLocalExpenses()
  }, [])

  const handleAddItem = (e: Event): void => {
    e.preventDefault()
    const dateElement = document.getElementById('date-input') as HTMLInputElement
    const accountElement = document.getElementById('account-input') as HTMLInputElement
    const expenseTypeElement = document.getElementById('expense-type-input') as HTMLInputElement
    const amountElement = document.getElementById('amount-input') as HTMLInputElement
    const noteElement = document.getElementById('note-input') as HTMLInputElement

    const runningTotal = expenseMap.get(accountElement.value) ?? 0
    const addition = Number(amountElement.value) ?? 0
    expenseMap.set(accountElement.value, runningTotal + addition)
    console.log(expenseMap.entries())
    saveExpenseMapToLocal(expenseMap)
    setExpenses((current) => {
      const newExpensese = [
        ...current,
        {
          date: dateElement.value,
          account: accountElement.value,
          expenseType: expenseTypeElement.value,
          amount: Number(amountElement.value),
          note: noteElement.value,
        },
      ]
      saveExpensesToLocal(newExpensese)
      return newExpensese
    })
    noteElement.value = ''
    dateElement.focus()
  }

  const handleClearData = () => {
    setExpenses(() => [])
    clearExpensesFromLocal()
  }

  const handleSaveData = () => {
    alert('We pretend this is saved to the cloud...')
    setExpenses(() => [])
    clearExpensesFromLocal(true)
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
          <select id='account-input' className='input' onChange={(e) => setSelectedCategoty(e.target.selectedIndex)}>
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
            {categories[selectedCategoty]?.subCategories.map((cat) => (
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
          <button className='add-item-button ledger-button' onClick={() => handleAddItem}>
            <span className='material-symbols-outlined'>add_task</span>
          </button>
        </div>
      </form>
      <div className='table-container'>
        <table className='table'>
          <thead>
            <tr className='header-row'>
              <th className='ledger-row-data'>Date</th>
              <th className='ledger-row-data'>Account</th>
              <th className='ledger-row-data'>Expense Type</th>
              <th className='ledger-row-data'>Cost</th>
              <th className='ledger-row-data'>Note</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={getGuid()} className='body-row'>
                <td className='ledger-row-data'>{expense.date}</td>
                <td className='ledger-row-data'>{expense.account}</td>
                <td className='ledger-row-data'>{expense.expenseType}</td>
                <td className='ledger-row-data'>$ {expense.amount}</td>
                <td className='ledger-row-data'>
                  {expense.note.length > 20 ? `${expense.note.slice(0, 20)}...` : expense.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='totals-container'>
        {Array.from(expenseMap.keys()).map((acct) => (
          <div key={getGuid()} className='totals-item'>
            <h4 className='totals-item-header'>{acct}</h4>
            <table>
              <tbody>
                <tr>
                  <td className='reconcile-title'>Owed:</td>
                  <td className='reconcile-data'>
                    <p>${expenseMap.get(acct)}</p>
                  </td>
                </tr>
                <tr>
                  <td className='reconcile-title'>Reconciled:</td>
                  <td className='totals-item-body reconcile-data'>
                    <input
                      type='number'
                      id='reconciled-amount'
                      className='input'
                      defaultValue={expenseMap.get(acct)}
                    ></input>
                  </td>
                </tr>
              </tbody>
            </table>
            <button className='reconcile-button ledger-button'>Reconcile</button>
          </div>
        ))}
      </div>
      <div className='button-container'>
        <button className='clear-data-button ledger-button' onClick={() => handleClearData}>
          <span className='material-symbols-outlined'>delete_history</span>
        </button>
        <button className='save-data-button ledger-button' onClick={() => handleSaveData}>
          <span className='material-symbols-outlined'>save</span>
        </button>
      </div>
    </article>
  ) : (
    <h1>Loading...</h1>
  )
}

export default Ledger
