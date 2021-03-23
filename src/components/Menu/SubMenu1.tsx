import React, {ReactNode, useContext, useRef, useState} from 'react'
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
  const [menuVisible,setMenuVisible] = useState(false)
  const childIndexs = useRef<any[]>([])
  const context = useContext(MenuContext)

  const classes = classNames('whmk-submenu', {
    'whmk-submenu-vertical': context.mode === 'vertical',
    'whmk-submenu-horizontal': context.mode === 'horizontal',
    'is-disabled': disabled,
    'is-active': childIndexs.current.includes(context.activeIndex), // 只要子项有一个命中则为true
    [`${className}`]: !!className,
  })

  const menuClasses = classNames('whmk-menu-sub',{
    'whmk-sub-vertical': context.mode === 'vertical',
    'whmk-sub-horizontal': context.mode === 'horizontal',
    'whmk-menu-sub-show': menuVisible,
    'whmk-menu-sub-hide': !menuVisible
  })

  const toggleVisible = (e:React.MouseEvent, isShow:boolean) => {
    e.preventDefault()
    setMenuVisible(isShow)
  }

  const handleClick = (e:React.MouseEvent) => {
    toggleVisible(e,!menuVisible)
  }

  let enterTimer:any = null, leaveTimer:any = null
  const hoverEvents = context.mode==='horizontal' ? {
    onMouseEnter(e:React.MouseEvent){
      enterTimer && clearTimeout(enterTimer)
      enterTimer = setTimeout(()=>{
        toggleVisible(e,true)
      },200)
    },
    onMouseLeave(e:React.MouseEvent){
      leaveTimer && clearTimeout(leaveTimer)
      leaveTimer = setTimeout(()=>{
        toggleVisible(e,false)
      },200)
    }
  } : {}

  const renderChildren = () => {
    const indexArr:Array<string|number> = []
    const result = React.Children.map(children,(child,childIndex)=>{
      const childElement =  child as React.FunctionComponentElement<IMenuItemProps>
      const { displayName } = childElement.type
      if (displayName !== 'MenuItem') {
        console.error('Warning: Menu has a child which is not a MenuItem component')
        return null
      }
      const keyIndex = `${index}-${childIndex}`
      indexArr.push(keyIndex)
      return React.cloneElement(childElement,{
        index:keyIndex
      })
    })
    childIndexs.current = indexArr
    return result
  }

  return (
    <li
      className={classes}
      style={style}
      {...hoverEvents}
    >
      <div className='whmk-submenu-title' onClick={(e)=>{
        if (!disabled && context.mode === 'vertical') {
          handleClick(e)
        }
      }}>{title}</div>
      <ul className={menuClasses}>
        { renderChildren() }
      </ul>
    </li>
  )
}

SubMenu1.displayName = 'SubMenu';

export default SubMenu1
