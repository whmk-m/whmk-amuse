import React from 'react'
import { render,screen } from '@testing-library/react'
import Button from "./index";

/*test('our first react test case',()=>{
  // 先模拟渲染这个组件
  const wrapper = render(<Button>Nice</Button>)
  // 找到包含Nice文本的节点，如果没有返回Null
  const element = wrapper.queryByText('Nice')
  // 判断这个文本是否在文档中
  expect(element).toBeInTheDocument()
})*/


describe('Test Button Component',()=>{
  it('should render the correct default button', function () {
    // 先模拟渲染这个组件
    const wrapper = render(<Button>Nice</Button>)
    // 找到包含Nice文本的节点，如果没有返回Null
    const element = wrapper.queryByText('Nice')
    // 判断这个文本是否在文档中
    expect(element).toBeInTheDocument()
    expect(element?.tagName).toEqual('SPAN')
  });
  it('should render the correct component based on different props', function () {

  });
  it('should render a link when btnType equals link and href is provided', function () {

  });
  it('should render disabled button when disabled prop set true', function () {

  });
})
