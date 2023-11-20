import './Button.css'

export interface INavButtonProps {
  label: string
  style: ButtonStyle
  icon?: string
  onClick: (e: any) => void
}

export enum ButtonStyle {
  primary = 'primary',
  secondary = 'secondary',
}

const Button = ({ label, onClick, style, icon }: INavButtonProps) => {
  return icon !== null ? (
    <button className='button' onClick={onClick} data-style={style}>
      {label}
    </button>
  ) : (
    <button className='button' onClick={onClick} data-style={style}>
      {<img src={icon} />}
      {label}
    </button>
  )
}

export default Button
