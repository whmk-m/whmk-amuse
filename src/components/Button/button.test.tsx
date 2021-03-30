import React from 'react'
import {fireEvent, render} from '@testing-library/react'
import Button, {ButtonProps} from "./index";

/*test('our first react test case',()=>{
  // 先模拟渲染这个组件
  const wrapper = render(<Button>Nice</Button>)
  // 找到包含Nice文本的节点，如果没有返回Null
  const element = wrapper.queryByText('Nice')
  // 判断这个文本是否在文档中
  expect(element).toBeInTheDocument()
})*/

const defaultProps:ButtonProps = {
  onClick:jest.fn()
}

const differentProps:ButtonProps = {
  btnType: 'danger',
  size: 'lg'
}

const hrefProps:ButtonProps = {
  btnType: 'link',
  href:'http://www.baidu.com',
  target:'_black'
}

const disabledProps:ButtonProps = {
  disabled:true,
  onClick:jest.fn()
}

describe('Test Button Component',()=>{
  it('should render the correct default button', function () {
    // 先模拟渲染这个组件
    const wrapper = render(<Button {...defaultProps}>Nice</Button>)
    // 找到包含Nice文本的节点，如果没有返回Null
    const element = wrapper.queryByText('Nice')
    // 判断这个文本是否在文档中
    expect(element).toBeInTheDocument()
    expect(element?.tagName).toEqual('SPAN')

    // 模拟点击事件
    element?.parentNode && fireEvent.click(element?.parentNode)
    // 判断是否有被点击
    expect(defaultProps.onClick).toHaveBeenCalled()
  });
  it('should render the correct component based on different props', function () {
    const wrapper = render(<Button {...differentProps}>Nice</Button>)
    const element = wrapper.getByText('Nice').parentNode
    expect(element).toHaveClass('btn btn-danger btn-lg')
  });
  it('should render a link when btnType equals link and href is provided', function () {
    const wrapper = render(<Button {...hrefProps}>Nice</Button>)
    const element = wrapper.getByText('Nice').parentNode as HTMLElement
    expect(element?.tagName).toEqual('A')
    expect(element).toHaveClass('btn btn-link')
  });
  it('should render disabled button when disabled prop set true', function () {
    const wrapper = render(<Button {...disabledProps}>Nice</Button>)
    const element = wrapper.getByText('Nice').parentNode as HTMLButtonElement
    expect(element.disabled).toBeTruthy()
    fireEvent.click(element)
    expect(disabledProps.onClick).not.toHaveBeenCalled()
  });
})
