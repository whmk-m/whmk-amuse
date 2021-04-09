import React from 'react'
import {fireEvent, render} from '@testing-library/react'
import AutoComplete from "./index";
import {config} from 'react-transition-group'
import {
  DefaultAutoComplete,
  FilterOptionAutoComplete,
  RenderOptionAutoComplete,
} from './AutoComplete.stories'
// 关闭动画
config.disabled = true

describe('测试 AutoComplete 组件', () => {
  it('测试默认AutoComplete', async function () {
    const wrapper = render(<AutoComplete/>)
    const inputEle = wrapper.container.getElementsByTagName('input')[0]
    // 模拟change事件
    fireEvent.change(inputEle, {target: {value: 'hello'}})
    // value 值是否改变
    expect(inputEle.value).toEqual('hello')

    // 暂无数据出现
    const noDataWrapper = wrapper.container.querySelector('.whmk-autocomplete-no-data')
    setTimeout(() => {
      expect(noDataWrapper).toBeInTheDocument()
    }, 200)

    // 模拟change事件
    fireEvent.change(inputEle, {target: {value: ''}})
    // value 值是否改变
    expect(inputEle.value).toEqual('')
    // 暂无数据消失
    expect(noDataWrapper).not.toBeInTheDocument()
  });
  it('测试AutoComplete 基本属性', async function () {
    const wrapper = render(<DefaultAutoComplete/>)
    const inputEle = wrapper.container.getElementsByTagName('input')[0]
    // 模拟change事件
    fireEvent.change(inputEle, {target: {value: 'hello'}})
    // value 值改变
    expect(inputEle.value).toEqual('hello')

    // option 选项出现
    const oneliEle = wrapper.queryByText('hello')
    setTimeout(() => {
      expect(oneliEle).toBeInTheDocument()
      expect(oneliEle).toHaveClass('whmk-autocomplete-selected-option')
      oneliEle && fireEvent.click(oneliEle)
      expect(oneliEle).not.toBeInTheDocument()
    }, 200)

    // 点击input
    fireEvent.click(inputEle)
    setTimeout(() => {
      const listWapper = wrapper.container.querySelector('.whmk-autocomplete-list')
      expect(listWapper).toBeInTheDocument()
    }, 200)

  });
  it('测试AutoComplete filterOption属性', function () {
    const wrapper = render(<FilterOptionAutoComplete/>)
    const inputEle = wrapper.container.getElementsByTagName('input')[0]
    // 模拟change事件 输入 hello
    fireEvent.change(inputEle, {target: {value: 'hello'}})
    // option 选项出现
    const helloEle = wrapper.queryByText('hello')
    setTimeout(() => {
      expect(helloEle).toBeInTheDocument()
    }, 200)

    // 模拟change事件 输入 Wang
    fireEvent.change(inputEle, {target: {value: 'Wang'}})
    // option 选项不出现， 因为被filterOption过滤掉了
    const WangEle = wrapper.queryByText('Wang')
    setTimeout(() => {
      expect(WangEle).not.toBeInTheDocument()
    }, 200)
  });
  it('测试AutoComplete renderOption属性', function () {
    const wrapper = render(<RenderOptionAutoComplete/>)
    const inputEle = wrapper.container.getElementsByTagName('input')[0]
    // 点击input 出现list、自定义选项出现
    fireEvent.click(inputEle)
    setTimeout(() => {
      const listWapper = wrapper.container.querySelector('.whmk-autocomplete-custom-list')
      const oneLiEle = wrapper.container.querySelector('.custom-option-0')
      expect(listWapper).toBeInTheDocument()
      expect(oneLiEle).toBeInTheDocument()
    }, 200)
  });
  it('测试AutoComplete clickOutside属性', function () {
    const wrapper = render(<RenderOptionAutoComplete/>)
    const inputEle = wrapper.container.getElementsByTagName('input')[0]
    // 点击input 出现list、自定义选项出现
    fireEvent.click(inputEle)
    setTimeout(() => {
      const listWapper = wrapper.container.querySelector('.whmk-autocomplete-custom-list')
      expect(listWapper).toBeInTheDocument()

      // 点击 组件外的区域，隐藏list wrapper
      fireEvent.click(document.body)
      expect(listWapper).not.toBeInTheDocument()
    }, 200)
  });
  it('测试AutoComplete 键盘事件属性', function () {
    const wrapper = render(<FilterOptionAutoComplete/>)
    const inputEle = wrapper.container.getElementsByTagName('input')[0]
    // 点击input，打开 list wrapper
    fireEvent.click(inputEle)
    const liEles = wrapper.container.querySelectorAll('.whmk-autocomplete-option')
    const firstLi = liEles[0]
    const secondLi = liEles[1]
    // 模拟键盘事件
    // 默认打开时，向下是第一个高亮，
    fireEvent.keyDown(inputEle, {code: 'ArrowDown'})
    expect(firstLi).toHaveClass('whmk-autocomplete-hover-option')
    expect(secondLi).not.toHaveClass('whmk-autocomplete-hover-option')

    // 在第一个option 再继续往上，还是保持在第一个
    fireEvent.keyDown(inputEle, {code: 'ArrowUp'})
    expect(firstLi).toHaveClass('whmk-autocomplete-hover-option')
    expect(secondLi).not.toHaveClass('whmk-autocomplete-hover-option')

    // enter 确认时，关闭list wrapper，inputValue 为选择的项
    fireEvent.keyDown(inputEle, {code: 'Enter'})
    expect(firstLi).not.toBeInTheDocument()
    expect(inputEle.value).toEqual('Zhang San')

    // 再次点击input，打开list
    fireEvent.click(inputEle)
    // Esc 关闭list，inputValue 清空
    fireEvent.keyDown(inputEle, {code: 'Escape'})
    expect(firstLi).not.toBeInTheDocument()
    expect(inputEle.value).toEqual('')
  });
})
