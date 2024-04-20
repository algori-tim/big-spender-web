import '../Ledger.css'
import { useLedgerStore } from '../LedgerStore'

//TO DO:
//add edit entry button
const Expenses = () => {
  const { expenses, deleteExpense } = useLedgerStore()

  return (
    <>
      <div className='table-container'>
        <table className='table'>
          <thead>
            <tr className='header-row'>
              <th className='ledger-row-data'>Date</th>
              <th className='ledger-row-data'>Account</th>
              <th className='ledger-row-data'>Expense Type</th>
              <th className='ledger-row-data'>Cost</th>
              <th className='ledger-row-data'>Note</th>
              <th className='ledger-row-data'></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className='body-row'>
                <td className='ledger-row-data'>{expense.date}</td>
                <td className='ledger-row-data'>{expense.account}</td>
                <td className='ledger-row-data'>{expense.expenseType}</td>
                <td className='ledger-row-data'>$ {expense.amount}</td>
                <td className='ledger-row-data delete-ledger-row'>
                  {expense.note.length > 20 ? `${expense.note.slice(0, 20)}...` : expense.note}
                </td>
                <td>
                  <button onClick={() => deleteExpense(expense)}>
                    <img alt='delete ledger entry button' src='icons/ledger/delete.svg' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Expenses
