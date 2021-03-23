import React, {ReactNode, useContext} from 'react'
import classNames from "classnames";
import { MenuContext } from './index'
import { IMenuItemProps } from './MenuItem'

export interface ISubMenuProps {
  index?:number,
  title: string | ReactNode,
  disabled?:boolean
  className?:string,
  style?:React.CSSProperties,
}

const SubMenu1:React.FC<ISubMenuProps> = (props)=>{
  const {
    index,
    title,
    disabled = false,
    className,
    style,
    children
  } = props

  const context = useContext(MenuContext)

  const classes = classNames('whmk-submenu', {
    'whmk-submenu-vertical': context.mode === 'vertical',
    'whmk-submenu-horizontal': context.mode === 'horizontal',
    'is-disabled': disabled,
    'is-active': context.activeIndex === index,
    [`${className}`]: !!className,
  })

  const menuClasses = classNames('whmk-menu-sub',{
    'whmk-sub-vertical': context.mode === 'vertical',
    'whmk-sub-horizontal': context.mode === 'horizontal',
  })

  const renderChildren = () => {
    return React.Children.map(children,(child,childIndex)=>{
      const childElement =  child as React.FunctionComponentElement<IMenuItemProps>
      const { displayName } = childElement.type
      if (displayName !== 'MenuItem') {
        console.error('Warning: Menu has a child which is not a MenuItem component')
        return null
      }
      return React.cloneElement(childElement,{
        index:`${index}-${childIndex}`
      })
    })
  }

  return (
    <li className={classes} style={style}>
      <div className='whmk-submenu-title' onClick={()=>{
        !disabled &&
        typeof index !== 'undefined' &&
        context.onSelect &&
        context.onSelect(index)
      }}>{title}</div>
      <ul className={menuClasses}>
        { renderChildren() }
      </ul>
    </li>
  )
}

SubMenu1.displayName = 'SubMenu';

export default SubMenu1
