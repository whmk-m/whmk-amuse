import React from 'react'
import classNames from "classnames";

export type MenuMode = 'vertical' | 'horizontal'

export interface IMenuProps {
  defaultIndex?: number,
  className?: string,
  style?: React.CSSProperties,
  onSelect?: (selectedIndex: number) => void,
  mode?: MenuMode
}

const Menu: React.FC<IMenuProps> = (props) => {
  const {
    defaultIndex,
    className,
    style,
    onSelect,
    mode,
    children
  } = props
  const classes = classNames('whmk-menu', {
    'whmk-menu-vertical': mode === 'vertical',
    [`${className}`]: !!className,
  })
  return (
    <ul className={classes} style={style}>
      {children}
    </ul>
  )
}

Menu.defaultProps = {
  defaultIndex: 0,
  mode: 'horizontal'
}

export default Menu
