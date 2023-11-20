import { Routes, Route } from 'react-router-dom'
import Home from './views/Home/Home'
import Ledger from './views/Ledger/Ledger'
import Budget from './views/Budget/Budget'
import './App.css'
function App() {
  return (
    <div className='routesContainer'>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/ledger' element={<Ledger />} />
        <Route path='/budget' element={<Budget />} />
      </Routes>
    </div>
  )
}

export default App
