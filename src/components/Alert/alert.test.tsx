import React from 'react'
import {fireEvent, render} from '@testing-library/react'
import Alert, { IBaseAlertProps } from "./index";

const defaultProps: IBaseAlertProps = {
  title:'标题',
}

const differentProps:IBaseAlertProps = {
  title:'标题',
  type:'danger',
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

describe('Test Button Component',()=>{
  it('测试默认Alert属性', function () {
    const wrapper = render(<Alert {...defaultProps}/>)
    const element = wrapper.getByText('标题')
    const alertElement = document.querySelector('.whmk-alert')
    expect(element).toBeInTheDocument()
    expect(alertElement).toHaveClass('whmk-alert-info')
  });
  it('测试Alert不同的type类型', function () {
    const wrapper = render(<Alert {...differentProps}/>)
    const alertElement = document.querySelector('.whmk-alert')
    expect(alertElement).toHaveClass('whmk-alert-danger')
  });
  it('测试closeable属性及事件', function () {
    const wrapper = render(<Alert {...closeProps}/>)
    const closeEle = wrapper.getByText('关闭')
    const alertElement = document.querySelector('.whmk-alert')
    expect(closeEle).toBeInTheDocument()

    fireEvent.click(closeEle)
    expect(closeProps.onClose).toHaveBeenCalled()
    expect(alertElement).not.toBeInTheDocument()
  });
  it('测试description', function () {
    const wrapper = render(<Alert {...descProps}/>)
    const closeEle = wrapper.queryByText('关闭')
    const descEle = wrapper.getByText(/描述/i)
    expect(closeEle).not.toBeInTheDocument()
    expect(descEle).toBeInTheDocument()
  });
})