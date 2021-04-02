import React from 'react'
import {fireEvent, render} from '@testing-library/react'
import Input, {IInputProps} from "./index";
//  引入图标文件
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas) // 一次性导入所有的图标，接下来就可以使用字符串了


const defaultProps: IInputProps = {
  placeholder: 'test-input'
}

const differentProps: IInputProps = {
  placeholder: 'test-input',
  allowClear: true,
  size: "lg",
}

const prefixSuffixProps:IInputProps = {
  prefix: (<>http:/1/</>),
  suffix: (<span style={{width: '100px'}}>.com</span>),
}

describe('Test Input Component', () => {
  it('渲染默认的Input', function () {
    // 先模拟渲染这个组件
    const wrapper = render(<Input {...defaultProps}/>)
    // 找到input节点
    const inputEle = wrapper.getByPlaceholderText('test-input') as HTMLInputElement
    // 判断这个文本是否在文档中
    expect(inputEle).toBeInTheDocument()
    expect(inputEle).toHaveClass('whmk-input whmk-input-md')

    // 模拟change事件
    fireEvent.change(inputEle, {target: {value: '123'}})
    // value 值是否改变
    expect(inputEle.value).toEqual('123')
  });
  it('渲染不同大小的、有清除icon的Input', function () {
    // 先模拟渲染这个组件
    const wrapper = render(<Input {...differentProps}/>)
    // 找到input节点
    const inputEle = wrapper.getByPlaceholderText('test-input') as HTMLInputElement
    expect(inputEle).toHaveClass('whmk-input whmk-input-lg')

    // 模拟change事件
    fireEvent.change(inputEle, {target: {value: '123'}})
    // value 值是否改变
    expect(inputEle.value).toEqual('123')

    // 清除icon是否存在
    const cleanEle = wrapper.container.getElementsByClassName('whmk-input-clean-icon')[0]
    expect(cleanEle).toBeInTheDocument()
    // 点击清除，判断输入框的值是否为空
    fireEvent.click(cleanEle)
    expect(inputEle.value).toEqual('')
  });
  it('渲染禁用的Input', function () {
    // 先模拟渲染这个组件
    const wrapper = render(<Input {...defaultProps} disabled={true}/>)
    // 找到input节点
    const inputEle = wrapper.getByPlaceholderText('test-input') as HTMLInputElement
    expect(inputEle).toHaveClass('whmk-input-disabled')
  });
  it('渲染prefix、suffix的Input', function () {
    // 先模拟渲染这个组件
    const wrapper = render(<Input {...prefixSuffixProps}/>)
    expect(wrapper.queryByText('http:/1/')).toBeInTheDocument()
    expect(wrapper.queryByText('.com')).toBeInTheDocument()
  });
  it('渲染defaultValue的Input', function () {
    // 先模拟渲染这个组件
    const wrapper = render(<Input {...defaultProps} defaultValue={'123'}/>)
    const inputEle = wrapper.getByPlaceholderText('test-input') as HTMLInputElement
    expect(inputEle.value).toEqual('123')
  });
})
