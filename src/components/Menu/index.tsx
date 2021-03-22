import React, { useState} from 'react'
import classNames from "classnames";
import { IMenuItemProps } from './MenuItem'

export type MenuMode = 'vertical' | 'horizontal'

export interface IMenuProps {
  defaultIndex?: number,
  className?: string,
  style?: React.CSSProperties,
  onSelect?: (selectedIndex: number | string) => void,
  mode?: MenuMode
}

interface IMenuContext {
  activeIndex: number | string
  onSelect?: (selectedIndex: number | string) => void,
  mode?:MenuMode
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
  const [activeIndex, setActiveIndex] = useState<string | number>(defaultIndex)

  const classes = classNames('whmk-menu', {
    'whmk-menu-vertical': mode === 'vertical',
    [`${className}`]: !!className,
  })

  const handleClick = (index: number | string) => {
    setActiveIndex(index)
    onSelect && onSelect(index)
  }

  const passwordContext:IMenuContext = {
    activeIndex,
    onSelect:handleClick,
    mode
  }

  // 渲染子节点，同时约束子节点必须为MenuItem
  const renderChildren = () => {
    return React.Children.map(children,(child,index)=>{
      const childElement = child as React.FunctionComponentElement<IMenuItemProps>
      const { displayName  } = childElement.type
      if (displayName !== 'MenuItem' && displayName !=='SubMenu') {
        console.error('Warning: Menu has a child which is not a MenuItem or SubMenu component')
        return null
      }
      return React.cloneElement(childElement,{
        index
      })
    })
  }

  return (
    <ul className={classes} style={style} data-testid='test-menu'>
      <MenuContext.Provider value={passwordContext}>
        {renderChildren()}
      </MenuContext.Provider>
    </ul>
  )
}

export default Menu
