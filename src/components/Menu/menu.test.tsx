import React from "react";
import {render, fireEvent, RenderResult} from '@testing-library/react'
import Menu, {IMenuProps} from "./index";
import MenuItem from "./MenuItem";


const activeProps: IMenuProps = {
  defaultIndex: '2',
  onSelect: jest.fn()
}

const verticalProps: IMenuProps = {
  mode: 'vertical',
  className: 'test-class'
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
    <li>hello world</li>
  </Menu>
)
let wrapper: RenderResult, menuEle: HTMLElement, activeEle: HTMLElement, disableEle: HTMLElement
describe('测试Menu 和 MenuItem 组件 ', () => {
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
})
