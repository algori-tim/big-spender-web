import '../Ledger.css'
import { useLedgerStore } from '../LedgerStore'

//TO DO:
// Fix applied amount amount
const Totals = () => {
  const { accountTotals, reconcileAccountBy } = useLedgerStore()

  const handleReconcile = (acct: string) => {
    const reconciledAmountElement = document.getElementById(`reconciled-amount-${acct}`) as HTMLInputElement
    const reconciled = Number(reconciledAmountElement.value)
    reconcileAccountBy(acct, reconciled)
  }

  return (
    <div className='totals-container'>
      {Object.entries(accountTotals).map(([acct, total]) => (
        <div key={acct} className='totals-item' id={`totals-item-${acct}`}>
          <h4 className='totals-item-header'>{acct}</h4>
          <table>
            <tbody>
              <tr>
                <td className='reconcile-title'>Owed:</td>
                <td className='reconcile-data'>
                  <p id={`owed-amount-${acct}`}>${total}</p>
                </td>
              </tr>
              <tr>
                <td className='reconcile-title'>Applied:</td>
                <td className='totals-item-body reconcile-data'>
                  <input
                    type='number'
                    id={`reconciled-amount-${acct}`}
                    className='reconciled-amount input'
                    defaultValue={0}
                  ></input>
                </td>
              </tr>
            </tbody>
          </table>
          <button className='reconcile-button ledger-button' onClick={() => handleReconcile(acct)}>
            Reconcile
          </button>
        </div>
      ))}
    </div>
  )
}

export default Totals
