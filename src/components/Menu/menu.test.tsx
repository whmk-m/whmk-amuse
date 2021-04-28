import React from "react";
import {render, fireEvent, RenderResult, waitFor} from '@testing-library/react'
import Menu, {IMenuProps} from "./index";
import MenuItem from "./MenuItem";
import SubMenu1 from "./SubMenu1";
//  引入图标文件
// 模拟Icon组件为一个span标签
jest.mock('../Icon/index', () => {
  // @ts-ignore
  return ({icon, onClick}) => {
    return <span onClick={onClick}>{icon}</span>
  }
})
const activeProps: IMenuProps = {
  defaultIndex: '2',
  onSelect: jest.fn()
}

const verticalProps: IMenuProps = {
  mode: 'vertical',
  className: 'test-class'
}

const defaultOpenSubMenuProps: IMenuProps = {
  mode: 'vertical',
  defaultOpenSubMenus:['4']
}
// 添加subMenu显示隐藏的css类，便于测试
const createSubMenuStyle = () => {
  const SubMenuCss: string = `
    .whmk-menu-sub-show {
      display: block;
    }
    .whmk-menu-sub-hide {
      display: none;
    }
  `
  const style = document.createElement('style')
  style.type = 'text/css'
  style.innerHTML = SubMenuCss
  return style
}


const MenuWrapper = (props: IMenuProps) => (
  <Menu {...props}>
    <MenuItem>
      0
    </MenuItem>
    <MenuItem className={'custom-item-class'}>
      1
    </MenuItem>
    <MenuItem disabled={true}>
      2
    </MenuItem>
    <MenuItem style={{color: 'red'}}>
      3
    </MenuItem>
    {/*
    <li>hello world</li>
*/}
    <SubMenu1 title={'子菜单'}>
      <MenuItem>
        4-0
      </MenuItem>
    </SubMenu1>
  </Menu>
)
let wrapper: RenderResult, menuEle: HTMLElement, activeEle: HTMLElement, disableEle: HTMLElement
describe('测试Menu 和 MenuItem 组件', () => {
  beforeEach(() => {
    // console.log('每个case执行前调用的钩子')
  })
  it('渲染正确的Menu和MenuItem默认props', function () {
    wrapper = render(MenuWrapper({}))
    menuEle = wrapper.getByTestId('test-menu')
    expect(menuEle).toBeInTheDocument()
    expect(menuEle).toHaveClass('whmk-menu')

    activeEle = wrapper.getByText('0')
    expect(activeEle).toBeInTheDocument()
    expect(activeEle).toHaveClass('whmk-menu-item is-active')

    disableEle = wrapper.getByText('2')
    expect(disableEle).toBeInTheDocument()
    expect(disableEle).toHaveClass('is-disabled')
    expect(disableEle).not.toHaveClass('is-active')
  });

  it('点击MenuItem 应该选中并且调用绑定的回调', function () {
    wrapper = render(MenuWrapper(activeProps))
    menuEle = wrapper.getByTestId('test-menu')

    // 默认选中2
    activeEle = wrapper.getByText(String(activeProps.defaultIndex))
    expect(activeEle).toBeInTheDocument()
    expect(activeEle).toHaveClass('whmk-menu-item is-active')

    // 点击其他item时切换active，并且执行了onSelect回调
    const otherMenuItem = wrapper.getByText('3')
    fireEvent.click(otherMenuItem)
    expect(otherMenuItem).toHaveClass('is-active')
    expect(activeEle).not.toHaveClass('is-active')
    expect(activeProps.onSelect).toHaveBeenCalledWith('3')
  });

  it('渲染垂直模式的Menu', function () {
    wrapper = render(MenuWrapper(verticalProps))
    menuEle = wrapper.getByTestId('test-menu')
    expect(menuEle).toHaveClass('whmk-menu-vertical test-class')

    expect(wrapper.getByText(1)).toHaveClass('whmk-menu-item custom-item-class')
    expect(wrapper.getByText(3)).toHaveAttribute('style', 'color: red;')
  });

  it('渲染水平模式的子菜单', async function () {
    wrapper = render(MenuWrapper({}))
    // 添加css
    document.head.appendChild(createSubMenuStyle())
    // 默认情况下不显示
    const subMenuItemEle = wrapper.queryByText('4-0')
    expect(subMenuItemEle).not.toBeInTheDocument()

    // hover 进来，显示
    const subMenuTitleEle = wrapper.getByText('子菜单')
    expect(subMenuTitleEle.parentNode).toHaveClass('whmk-submenu whmk-submenu-horizontal')
    fireEvent.mouseEnter(subMenuTitleEle)
    // 因为在mouseEnter方法中我们使用了异步，所以testLibrary 提供了waitFor方法在这段异步时间内重复调用断言
    await waitFor(() => {
      expect(wrapper.queryByText('4-0')).toBeInTheDocument()
    })

    // 移出 隐藏
    fireEvent.mouseLeave(subMenuTitleEle)
    setTimeout(()=>{
      expect(wrapper.queryByText('4-0')).not.toBeInTheDocument()
    },200)
  });
  it('渲染垂直模式的子菜单', async function () {
    wrapper = render(MenuWrapper(verticalProps))
    // 添加css
    document.head.appendChild(createSubMenuStyle())
    // 默认情况下不显示
    const subMenuItemEle = wrapper.queryByText('4-0')
    expect(subMenuItemEle).not.toBeInTheDocument()

    // 点击 显示
    const subMenuTitleEle = wrapper.getByText('子菜单')
    expect(subMenuTitleEle.parentNode).toHaveClass('whmk-submenu whmk-submenu-vertical')
    fireEvent.click(subMenuTitleEle)
    await waitFor(() => {
      expect(wrapper.queryByText('4-0')).toBeInTheDocument()
    })
    // 点击子menuItem, 会添加选中类
    fireEvent.click(wrapper.getByText('4-0'))
    expect(wrapper.getByText('4-0')).toHaveClass('is-active')
    expect(subMenuTitleEle.parentNode).toHaveClass('is-active')


    // 再次点击 隐藏
    subMenuTitleEle && fireEvent.click(subMenuTitleEle)
    expect(subMenuItemEle).not.toBeInTheDocument()
  });
  it('渲染垂直模式默认展开子菜单', async function () {
    wrapper = render(MenuWrapper(defaultOpenSubMenuProps))
    // 添加css
    document.head.appendChild(createSubMenuStyle())
    // 默认情况下显示
    const subMenuItemEle = wrapper.getByText('4-0')
    expect(subMenuItemEle).toBeVisible()

    // 点击 隐藏
    const subMenuTitleEle = wrapper.getByText('子菜单')
    fireEvent.click(subMenuTitleEle)
    expect(subMenuItemEle).not.toBeVisible()
  });
})
