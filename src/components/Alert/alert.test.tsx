import React from 'react'
import {fireEvent, render} from '@testing-library/react'
import Alert, { IBaseAlertProps } from "./index";
// 模拟Icon组件为一个span标签
jest.mock('../Icon/index', () => {
  // @ts-ignore
  return ({icon, onClick}) => {
    return <span onClick={onClick}>{icon}</span>
  }
})
const defaultProps: IBaseAlertProps = {
  title:'标题',
}

const closeProps:IBaseAlertProps = {
  title:'标题',
  closable:true,
  onClose:jest.fn()
}

const descProps:IBaseAlertProps = {
  title:'这是标题',
  description:'这是描述'
}

const differentProps:IBaseAlertProps = {
  title:'标题',
  type:'danger',
}

describe('Test Button Component',()=>{
  it('测试默认Alert属性', function () {
    const wrapper = render(<Alert {...defaultProps}/>)
    const element = wrapper.getByText('标题')
    const alertElement = document.querySelector('.whmk-alert')
    expect(element).toBeInTheDocument()
    expect(alertElement).toHaveClass('whmk-alert-info')
  });
  it('测试Alert不同的type类型', function () {
    render(<Alert {...differentProps}/>)
    const alertElement = document.querySelector('.whmk-alert')
    expect(alertElement).toHaveClass('whmk-alert-danger')
  });
  it('测试closeable属性及事件', function () {
    const wrapper = render(<Alert {...closeProps}/>)
    const closeEle = wrapper.getByText('times')
    const alertElement = document.querySelector('.whmk-alert')
    expect(closeEle).toBeInTheDocument()
    fireEvent.click(closeEle)
    expect(closeProps.onClose).toHaveBeenCalled()
    // 异步验证
    setTimeout(()=>{
      expect(alertElement).not.toBeInTheDocument()
    },20)
  });
  it('测试description', function () {
    const wrapper = render(<Alert {...descProps}/>)
    const closeEle = wrapper.queryByText('关闭')
    const descEle = wrapper.getByText(/描述/i)
    expect(closeEle).not.toBeInTheDocument()
    expect(descEle).toBeInTheDocument()
  });
})
