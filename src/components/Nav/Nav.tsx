import './Nav.css'

const Nav = () => {
  return (
    <div className='navContainer'>
      <nav>
        <ul>
          <li>
            <img className='header-image' src='./images/cactus.jpg' alt='an image of a cactus wearing sunglasses' />
          </li>
          <li>
            <a className='navItems' href='/'>
              <span className='material-symbols-outlined'>home</span>Home
            </a>
          </li>
          <li>
            <a className='navItems' href='/budget'>
              <span className='material-symbols-outlined'>calculate</span>Budget
            </a>
          </li>
          <li>
            <a className='navItems' href='/ledger'>
              <span className='material-symbols-outlined'>assignment_add</span>Ledger
            </a>
          </li>
        </ul>
        <footer>
          <ul>
            <li>
              <a className='loginItems'>
                <span className='material-symbols-outlined'>account_circle</span>Tim
              </a>
            </li>
            <li>
              <a className='loginItems'>
                <span className='material-symbols-outlined'>logout</span>Logout
              </a>
            </li>
          </ul>
        </footer>
      </nav>
    </div>
  )
}

export default Nav
