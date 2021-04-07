import React, {useCallback, useEffect, useMemo, useState} from 'react'
import classNames from "classnames";
import Input from "../Input";
import {debounce} from './../../utils'
import {useDebounce} from './../../hooks'
import Transition from "../Transition";

export interface IOption {
  value: string
  label: string
}

export interface IAutoCompleteProps {
  /**
   * 数据化配置选项内容，{value:string,label:string}[]
   */
  options?: Array<IOption>,
  /**
   *  是否根据输入项进行筛选。
   *  当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false
   */
  filterOption?: boolean | ((inputValue: string, option: IOption) => boolean),
  /**
   * 指定默认选中的条目
   */
  defaultValue?: string,
  /**
   * 搜索补全项的时候调用
   * @param inputValue 输入框当前输入的值
   */
  onSearch?: (inputValue: string) => void,
  /**
   * 选中 option 或 input 的value 变化时，调用此函数
   * @param inputValue 输入框当前的值
   */
  onChange?: (inputValue: string) => void,
  /**
   * option被选中时调用
   * @param value 选中项的值
   * @param option 选中项
   */
  onSelect?: (value: string, option: IOption) => void,
  /**
   * 指定当前选中的条目，当value和defaultValue同时出现时，以value为准
   */
  value?: string,
  /**
   * 是否禁用
   */
  disabled?: boolean,
  /**
   * renderOption 是一个函数，用于自定义渲染每个条目, 接受两个参数, 并返回一个 ReactElement
   * @param option 当前循环项 option
   * @param index 当前项的索引
   */
  renderOption?: (option: IOption, index: number) => React.ReactElement,
  /**
   * 延迟 xxx ms执行onSearch函数，默认不延迟
   */
  wait?: number
}

const AutoComplete: React.FC<IAutoCompleteProps> = (props) => {
  const {
    value,
    defaultValue,
    onChange,
    onSelect,
    onSearch,
    options,
    filterOption,
    disabled,
    renderOption,
    wait,
  } = props

  const filterDataSource = (dataArray: Array<IOption>) => {
    if (dataArray.length === 0) return []
    return dataArray.filter(item => {
      if (typeof filterOption === "boolean") {
        return filterOption
      }
      if (typeof filterOption === 'function') {
        return filterOption(item.value, item)
      }
      return true
    })
  }

  const initInputValue = useCallback(() => {
    if (typeof value !== 'undefined') {
      return value
    }
    if (typeof defaultValue !== 'undefined') {
      return defaultValue
    }
    return ''
  }, [])

  const initDataSource = useCallback(() => {
    if (!Array.isArray(options)) {
      return []
    }
    return filterDataSource(options)
  }, [options])

  const findSelectedOption = (value:string) => {
    const selectedItem = options?.find(item => item.value === value)
    selectedItem && setSelectedOption(selectedItem)
  }

  const [inputValue, setInputValue] = useState<string>(initInputValue)
  const [dataSource, setDataSource] = useState<Array<IOption>>(initDataSource)
  const [selectedOption, setSelectedOption] = useState<IOption | null>(null)
  const [listVisible,setListVisible] = useState<boolean>(false)

  // 防抖函数
  const debounceHandleSearch = useMemo(() => {
    console.log('debounceHandleSearch:');
    return debounce(onSearch, wait)
  }, [])
  useEffect(() => {
    setDataSource(initDataSource())
    findSelectedOption(inputValue)
  }, [options])

  useEffect(() => {
    if (typeof value !== 'undefined') {
      setInputValue(value)
      findSelectedOption(value)
    }
  }, [value])

  const handleSelect = (value: string, option: IOption) => {
    setSelectedOption({...option})
    onChange ? onChange(value) : setInputValue(value)
    onSelect && onSelect(value, option)
    setListVisible(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onChange ? onChange(value) : setInputValue(value)
    wait === 0 ? onSearch && onSearch(value) : debounceHandleSearch && debounceHandleSearch(value)
  }

  /**
   * 自定义渲染条目
   */
  const customRenderOption = () => {
    if (typeof renderOption !== 'function') return null
    return (
      <div className="whmk-autocomplete-custom-list">
        {
          dataSource.map((option, index) => renderOption(option, index))
        }
      </div>
    )
  }

  return (
    <div className='whmk-autocomplete-wrapper'>
      <div className='whmk-autocomplete-input-area'>
        <Input value={inputValue} onChange={handleChange} onFocus={()=>setListVisible(true)} disabled={disabled}/>
      </div>
      <Transition
        animation='zoom-in-top'
        in={dataSource.length > 0 && listVisible}
        timeout={200}
        unmountOnExit={true}
      >
        {
          typeof renderOption === 'function' ? customRenderOption() : (
            <ul className='whmk-autocomplete-list'>
              {
                dataSource.map((option, index) => (
                  <li
                    className={`whmk-autocomplete-option ${selectedOption?.value === option.value ? 'whmk-autocomplete-selected-option' : ''}`}
                    key={index}
                    onClick={() => handleSelect(option.value, option)}>
                    {option.label}
                  </li>
                ))
              }
            </ul>
          )
        }
      </Transition>
    </div>
  )
}

AutoComplete.defaultProps = {
  disabled: false,
  filterOption: true,
  wait: 0
}

export default AutoComplete
