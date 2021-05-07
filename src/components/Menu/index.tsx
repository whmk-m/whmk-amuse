import React, {FC, useState} from 'react'
import classNames from "classnames";
import SubMenu, { ISubMenuProps } from "./SubMenu1";
import MenuItem, { IMenuItemProps } from "./MenuItem";
export type MenuMode = 'vertical' | 'horizontal'

export interface IMenuProps {
  /**
   * 默认选中的菜单项的索引
   */
  defaultIndex?: string,
  /**
   * 自定义类名
   */
  className?: string,
  /**
   * 自定义CSS样式
   */
  style?: React.CSSProperties,
  /**
   * 点击当前菜单项的回调
   * @param selectedIndex 当前菜单项的索引
   */
  onSelect?: (selectedIndex: string) => void,
  /**
   * 菜单渲染模式，水平或者垂直
   */
  mode?: MenuMode
  /**
   * 默认展开的子菜单项，是一个包含子菜单项索引的数组
   */
  defaultOpenSubMenus?:Array<string>
}

interface IMenuContext {
  /**
   * 选中的菜单项索引
   */
  activeIndex: string
  /**
   * 选中菜单项的回调
   * @param selectedIndex 选中菜单项的索引
   */
  onSelect?: (selectedIndex: string) => void,
  /**
   * 菜单渲染模式
   */
  mode?:MenuMode
  /**
   * 默认展开的子菜单项
   */
  defaultOpenSubMenus?:Array<string>
}
// 创建context上下文，与子组件之间可以共享属性
export const MenuContext = React.createContext<IMenuContext>({
  activeIndex: '0'
})

const Menu: React.FC<IMenuProps> = (props) => {
  const {
    defaultIndex = '0',
    className,
    style,
    onSelect,
    mode = 'horizontal',
    children,
    defaultOpenSubMenus = []
  } = props
  const [activeIndex, setActiveIndex] = useState<string>(defaultIndex)

  const classes = classNames('whmk-menu', {
    'whmk-menu-vertical': mode === 'vertical',
    [`${className}`]: !!className,
  })

  const handleClick = (index: string) => {
    setActiveIndex(index)
    onSelect && onSelect(index)
  }

  const passwordContext:IMenuContext = {
    activeIndex,
    onSelect:handleClick,
    mode,
    defaultOpenSubMenus,
  }

  // 渲染子节点，同时约束子节点必须为MenuItem
  const renderChildren = () => {
    return React.Children.map(children,(child,index)=>{
      const childElement = child as React.FunctionComponentElement<IMenuItemProps>
      const { displayName  } = childElement.type
      if (displayName !== 'MenuItem' && displayName !=='SubMenu' && displayName !=='SubMenu1') {
        console.error('Warning: Menu has a child which is not a MenuItem or SubMenu component')
        return null
      }
      return React.cloneElement(childElement,{
        index:`${index}`
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


// 导出Menu，并且可以通过Menu.Item 、Menu.SubMenu 使用
export type IMenuComponent =  FC<IMenuProps> & {
  Item:FC<IMenuItemProps>,
  SubMenu:FC<ISubMenuProps>
}
const TransMenu = Menu as IMenuComponent
TransMenu.Item = MenuItem
TransMenu.SubMenu = SubMenu
export default TransMenu
