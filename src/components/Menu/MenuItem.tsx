import React from 'react'
import classNames from "classnames";

export interface IMenuItemProps {
  disabled?: boolean,
  className?: string,
  style?: React.CSSProperties
}

const MenuItem: React.FC<IMenuItemProps> = (props) => {
  const {
    disabled,
    className,
    style,
    children
  } = props
  const classes = classNames('whmk-menu-item',{
    'is-disabled':disabled,
    [`${className}`]:!!className,
  })
  return (
    <li className={classes} style={style}>
      {children}
    </li>
  )
}

MenuItem.defaultProps = {
  disabled:false
}

export default MenuItem
