import React, {useContext} from 'react'
import classNames from "classnames";
import {MenuContext} from './index'

export interface IMenuItemProps {
  index?: number
  disabled?: boolean,
  className?: string,
  style?: React.CSSProperties
}

const MenuItem: React.FC<IMenuItemProps> = (props) => {
  const {
    index,
    disabled = false,
    className,
    style,
    children
  } = props
  const context = useContext(MenuContext)
  const classes = classNames('whmk-menu-item', {
    'is-disabled': disabled,
    'is-active': context.activeIndex === index,
    [`${className}`]: !!className,
  })
  return (
    <li className={classes} style={style} onClick={(event) => {
      !disabled &&
      typeof index === 'number' &&
      context.onSelect &&
      context.onSelect(index)
    }}>
      {children}
    </li>
  )
}

MenuItem.displayName = 'MenuItem'

export default MenuItem
