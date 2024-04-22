import './IconButton.css'

export enum IconButtonColors {
  red = 'red',
  yellow = 'yellow',
  green = 'green',
}

export interface IconButtonProps {
  icon: string
  iconAlt: string
  color: IconButtonColors
  onClick: (e: any) => void
}

const IconButton = (props: IconButtonProps) => {
  return (
    <button className='icon-button' onClick={props.onClick} data-color={props.color}>
      <img alt={props.iconAlt} src={props.icon} />
    </button>
  )
}

export default IconButton
