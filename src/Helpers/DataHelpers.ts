import { AccountCategory } from '../types/accountCategory.type'
import { Carryover } from '../types/carryover.type'
import { LedgerEntry } from '../types/ledgerEntry.type'

export const getAccountsCategories = async (): Promise<AccountCategory[]> => {
  return await fetchLocalJsonFile<AccountCategory[]>('./data/accountCatorgies.json')
}

export const getLastLedger = async (): Promise<LedgerEntry> => {
  return await fetchLocalJsonFile<LedgerEntry>('./data/ledgerEntry.json')
}

export const getAnyCarryovers = async (): Promise<Carryover[]> => {
  return await fetchLocalJsonFile<Carryover[]>('./data/carryovers.json')
}

const fetchLocalJsonFile = async <T>(url: string): Promise<T> => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = await response.json()
    return data as T
  } catch (error) {
    console.error('Error fetching JSON:', error)
    throw error
  }
}
