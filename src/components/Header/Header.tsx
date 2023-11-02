import Button, { ButtonStyle } from '../shared/Button/Button'
import './Header.css'

const Header = () => {
  return (
    <nav className='header-container'>
      <img className='header-image' src='./images/cactus.jpg' alt='an image of a cactus wearing sunglasses' />
      <div className='buttons-container'>
        <Button
          label='SIGN IN'
          style={ButtonStyle.primary}
          icon={'./images/user.svg'}
          onClick={() => console.log('clicked')}
        />
      </div>
    </nav>
  )
}

export default Header
