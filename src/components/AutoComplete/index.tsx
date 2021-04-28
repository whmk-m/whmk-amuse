import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import classNames from "classnames";
import Input from "../Input";
import {debounce} from './../../utils'
import {useClickOutside} from './../../hooks'
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

/**
 * ## AutoComplete自动完成
 *输入框自动完成功能。
 *何时使用#
 *需要一个输入框而不是选择器。
 *需要输入建议/辅助提示。
 *和 Select 的区别是：
 *AutoComplete 是一个带提示的文本输入框，用户可以自由输入，关键词是辅助输入。
 *Select 是在限定的可选项中进行选择，关键词是选择。
 * @param props
 * @constructor
 */
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

  /**
   * 根据filterOption条件过滤传入的数组
   * @param dataArray 返回过滤后的新数组
   */
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

  /**
   * 初始化传入value和defaultValue
   */
  const initInputValue = useCallback(() => {
    if (typeof value !== 'undefined') {
      return value
    }
    if (typeof defaultValue !== 'undefined') {
      return defaultValue
    }
    return ''
  }, [])

  /**
   * 初始化传入的options数据源，并且根据filterOption条件进行过滤
   */
  const initDataSource = useCallback(() => {
    if (!Array.isArray(options)) {
      return []
    }
    return filterDataSource(options)
  }, [options])

  /**
   * 在数组中根据提供的value找到其完整的项
   * @param arr 数组
   * @param value 值
   */
  const findSelectedOption = (arr: Array<IOption>, value: string) => {
    const selectedItem = arr?.find(item => item.value === value)
    selectedItem && setSelectedOption(selectedItem)
  }

  const [inputValue, setInputValue] = useState<string>(initInputValue)
  const [dataSource, setDataSource] = useState<Array<IOption>>(initDataSource)
  const [selectedOption, setSelectedOption] = useState<IOption | null>(null)
  const [listVisible, setListVisible] = useState<boolean>(false)
  const autocompleteWrapper = useRef(null)
  // 点击组件外部区域关闭list
  const isContains = useClickOutside(autocompleteWrapper)

  // 使用键盘上下方向键选择是时，进行高亮的option的索引
  const [hightLightIndex, setHightLightIndex] = useState<number>(-1)

  // 防抖函数
  const debounceHandleSearch = useMemo(() => {
    // console.log('debounceHandleSearch:');
    return debounce(onSearch, wait)
  }, [])

  // 监听是否点击了组件外部区域去关闭list
  useEffect(() => {
    if (!isContains) {
      setHightLightIndex(-1)
      setListVisible(false)
    }
  }, [isContains])

  // 监听options prop发生改变时更新数组源
  useEffect(() => {
    const list = initDataSource()
    setDataSource(list)
    findSelectedOption(list, inputValue)
  }, [options])

  // 监听value prop发生改变时更新inputValue
  useEffect(() => {
    if (typeof value !== 'undefined') {
      setInputValue(value)
      findSelectedOption(dataSource, value)
    }
  }, [value])

  // 选中某一选项，并且调用回调
  const handleSelect = (value: string, option: IOption) => {
    setHightLightIndex(-1)
    setSelectedOption({...option})
    onChange ? onChange(value) : setInputValue(value)
    onSelect && onSelect(value, option)
    setListVisible(false)
  }

  // 选中 option 或 input 的value 变化时，调用此函数，如果提供了wait的值，将使用防抖函数封装一层
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onChange ? onChange(value) : setInputValue(value)
    wait === 0 ? onSearch && onSearch(value) : debounceHandleSearch && debounceHandleSearch(value)
  }

  // 计算当前应该高亮的选项的index
  const calcHighLightIndex = (index: number) => {
    let lightIndex = index
    if (index < 0) {
      lightIndex = 0
    }
    if (index >= dataSource.length) {
      lightIndex = dataSource.length - 1
    }
    setHightLightIndex(lightIndex)
  }

  // 为autoComplete input 输入框添加键盘事件，分别为 上下方向键、enter确认键、esc取消键，各自执行不同的操作
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // console.log(e.code)
    switch (e.code) {
      case 'ArrowUp' :
        e.preventDefault()
        e.stopPropagation()
        calcHighLightIndex(hightLightIndex - 1)
        break;
      case 'ArrowDown' :
        e.preventDefault()
        e.stopPropagation()
        calcHighLightIndex(hightLightIndex + 1)
        break;
      case 'Enter' :
        if (dataSource.length === 0) return
        const option = dataSource[hightLightIndex]
        handleSelect(option.value, option)
        break;
      case 'Escape' :
        setInputValue('')
        setHightLightIndex(-1)
        setListVisible(false)
        wait === 0 ? setDataSource([]) : setTimeout(() => setDataSource([]), wait)
        break;
      default:
        break
    }
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
    <div className='whmk-autocomplete-wrapper' ref={autocompleteWrapper}>
      <div className='whmk-autocomplete-input-area'>
        <Input
          value={inputValue}
          onChange={handleChange}
          onClick={() => setListVisible(true)}
          disabled={disabled}
          onKeyDown={handleKeyDown}
        />
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
                dataSource.map((option, index) => {
                  const optionClasses = classNames('whmk-autocomplete-option', {
                    'whmk-autocomplete-hover-option': hightLightIndex === index,
                    'whmk-autocomplete-selected-option': selectedOption?.value === option.value
                  })
                  return (
                    <li
                      onMouseEnter={() => setHightLightIndex(listVisible ? index : -1)}
                      className={optionClasses}
                      key={index}
                      onClick={() => handleSelect(option.value, option)}>
                      {option.label}
                    </li>
                  )
                })
              }
            </ul>
          )
        }
      </Transition>
      <Transition
        animation='zoom-in-top'
        in={dataSource.length === 0 && !!inputValue && listVisible}
        timeout={200}
        unmountOnExit={true}
      >
        <div className={'whmk-autocomplete-no-data'}>暂无匹配数据</div>
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
