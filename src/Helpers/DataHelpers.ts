import { AccountCategory } from '../types/accountCategory.type'

export const getAccountsCategories = async (): Promise<AccountCategory[]> => {
  return await fetchLocalJsonFile<AccountCategory>('./data/accountCatorgies.json')
}

const fetchLocalJsonFile = async <T>(url: string): Promise<T[]> => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = await response.json()
    return data as T[]
  } catch (error) {
    console.error('Error fetching JSON:', error)
    throw error
  }
}
