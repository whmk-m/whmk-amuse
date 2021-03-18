import React, {useState} from 'react'
import classNames from "classnames";

export type MenuMode = 'vertical' | 'horizontal'

export interface IMenuProps {
  defaultIndex?: number,
  className?: string,
  style?: React.CSSProperties,
  onSelect?: (selectedIndex: number) => void,
  mode?: MenuMode
}

interface IMenuContext {
  activeIndex: number
  onSelect?: (selectedIndex: number) => void,
}
// 创建context上下文，与子组件之间可以共享属性
export const MenuContext = React.createContext<IMenuContext>({
  activeIndex: 0
})

const Menu: React.FC<IMenuProps> = (props) => {
  const {
    defaultIndex = 0,
    className,
    style,
    onSelect,
    mode = 'horizontal',
    children
  } = props
  const [activeIndex, setActiveIndex] = useState(defaultIndex)

  const classes = classNames('whmk-menu', {
    'whmk-menu-vertical': mode === 'vertical',
    [`${className}`]: !!className,
  })

  const handleClick = (index: number) => {
    setActiveIndex(index)
    onSelect && onSelect(index)
  }

  const passwordContext:IMenuContext = {
    activeIndex,
    onSelect:handleClick
  }

  return (
    <ul className={classes} style={style}>
      <MenuContext.Provider value={passwordContext}>
        {children}
      </MenuContext.Provider>
    </ul>
  )
}

export default Menu
