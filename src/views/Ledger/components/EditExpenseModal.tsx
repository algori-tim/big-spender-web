import { Expense } from '../../../types/expense.type'
import '../Ledger.css'
import './EditExpenseModal.css'
import { useLedgerStore } from '../LedgerStore'
import IconButton, { IconButtonColors } from '../../../components/IconButton/IconButton'
import { useEffect, useRef, useState } from 'react'
import { AccountCategory } from '../../../types/accountCategory.type'

interface EditExpenseModalProps {
  expense: Expense
  id: string
}

function generateGUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const EditExpenseModal = (props: EditExpenseModalProps) => {
  const { accountCategories, updateExpense } = useLedgerStore()
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState<number>(
    accountCategories.findIndex((x) => x.name === props.expense.account)
  )
  const [selectedCategory, setSelectedCategory] = useState<string>(props.expense.account)
  const [selectedExpenseType, setSelectedExpenseType] = useState<string>(props.expense.expenseType)
  const [note, setNote] = useState<string>(props.expense.note)
  const [amount, setAmount] = useState<number>(props.expense.amount)
  const [date, setDate] = useState<string>(props.expense.date)

  const closeDialog = () => {
    const dialog = document.getElementById(props.id) as HTMLDialogElement
    dialog?.close()
  }

  const handleCategoryChange = (e: any) => {
    setSelectedCategoryIdx(() => e.target.selectedIndex)
    setSelectedCategory(() => e.target.value)
  }

  const handleExpenseTypeChange = (e: any) => {
    setSelectedExpenseType(() => e.target.value)
  }

  const handleSave = (e: any) => {
    e.preventDefault()
    updateExpense({
      id: props.expense.id,
      date: date,
      account: selectedCategory,
      expenseType: selectedExpenseType,
      amount: amount,
      note: note,
    })
    closeDialog()
  }

  const handleCancel = (e: any) => {
    e.preventDefault()
    closeDialog()
  }

  return (
    <dialog id={props.id} className='edit-expense-modal'>
      <div className='edit-inputs-container'>
        <form className='edit-inputs-form'>
          <div>
            <label htmlFor='edit-date-input'>Date:</label>
            <input
              type='date'
              id='edit-date-input'
              className='edit-input'
              defaultValue={props.expense.date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor='edit-account-input'>Account:</label>
            <select
              id='edit-account-input'
              className='edit-input'
              onChange={handleCategoryChange}
              value={selectedCategory}
            >
              {accountCategories.map((cat) => (
                <option key={generateGUID()} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor='expense-type-input'>Expense Type:</label>
            <select
              id='edit-expense-type-input'
              className='edit-input'
              value={selectedExpenseType}
              onChange={handleExpenseTypeChange}
            >
              {accountCategories[selectedCategoryIdx]?.subCategories.map((subCat) => (
                <option key={`${props.expense.id}${subCat}`} value={subCat}>
                  {subCat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor='edit-amount-input'>Amount:</label>
            <input
              type='number'
              id='edit-amount-input'
              className='edit-input'
              step='.01'
              defaultValue={props.expense.amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor='edit-note-input'>Note:</label>
            <input
              type='text'
              id='edit-note-input'
              className='edit-input'
              defaultValue={props.expense.note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </form>
        <div className='edit-button-container'>
          <IconButton
            icon='icons/ledger/circle-cancel.svg'
            color={IconButtonColors.red}
            iconAlt='Cancel changes.'
            onClick={handleCancel}
          />
          <IconButton
            icon='icons/ledger/save.svg'
            color={IconButtonColors.green}
            iconAlt='Save changes.'
            onClick={handleSave}
          />
        </div>
      </div>
    </dialog>
  )
}

export default EditExpenseModal
