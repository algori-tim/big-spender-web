import { useState, useEffect } from 'react'
import { Expense } from '../../types/expense.type'
import { clearExpensesFromLocal, saveExpensesToLocal } from '../../Helpers/StorageHelpers'
import { AccountCategory } from '../../types/accountCategory.type'
import { getAccountsCategories } from '../../Helpers/DataHelpers'
import './Ledger.css'
import Button, { ButtonStyle } from '../shared/Button/Button'

const getGuid = (): string => {
  return Math.floor(Math.random() * 0x10000).toString(16)
}

const Ledger = () => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<AccountCategory[]>([])
  const [selectedCategoty, setSelectedCategoty] = useState<number>(0)

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
    }

    setDropdowns()
    getLocalExpenses()
  }, [])

  const handleAddItem = () => {
    const dateElement = document.getElementById('date-input') as HTMLInputElement
    const accountElement = document.getElementById('account-input') as HTMLInputElement
    const expenseTypeElement = document.getElementById('expense-type-input') as HTMLInputElement
    const amountElement = document.getElementById('amount-input') as HTMLInputElement

    const date = new Date(dateElement.value)
    console.log(date.toDateString())

    setExpenses((current) => {
      const newExpensese = [
        ...current,
        {
          date: dateElement.value,
          account: accountElement.value,
          expenseType: expenseTypeElement.value,
          amount: Number(amountElement.value),
        },
      ]
      saveExpensesToLocal(newExpensese)
      return newExpensese
    })

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
    <>
      <form>
        <div className='inputs-container'>
          <div>
            <label htmlFor='date-input input'>Date:</label>
            <input
              type='date'
              id='date-input'
              className='input'
              defaultValue={new Date().toISOString().split('T')[0]}
            />
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
            <label htmlFor='amount-input input'>Amount:</label>
            <input type='number' id='amount-input' className='input' />
          </div>
          <Button label='Add Item' style={ButtonStyle.primary} onClick={handleAddItem} />
        </div>
      </form>
      <table className='table'>
        <thead>
          <tr className='header-row'>
            <th>Date</th>
            <th>Account</th>
            <th>Expense Type</th>
            <th>Cost</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={getGuid()} className='body-row'>
              <td>{expense.date}</td>
              <td>{expense.account}</td>
              <td>{expense.expenseType}</td>
              <td>{expense.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='button-container'>
        <Button label='Clear Data' style={ButtonStyle.secondary} onClick={handleClearData} />
        <Button label='Save Data' style={ButtonStyle.primary} onClick={handleSaveData} />
      </div>
    </>
  ) : (
    <h1>Loading...</h1>
  )
}

export default Ledger
