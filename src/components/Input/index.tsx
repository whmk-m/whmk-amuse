import React, {InputHTMLAttributes, ReactElement } from 'react'
import classNames from "classnames";
import Icon from "../Icon";

export type InputSize = 'lg' | 'md' | 'sm'

type Extract<T, P extends keyof any> = T extends P ? never : T

type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

type Omit<T, P extends keyof T> = Pick<T, Extract<keyof T, P>>

// @ts-ignore
export interface IInputProps extends Omit<InputHTMLAttributes<HTMLElement>, 'size' | 'onChange'> {
  /**
   * 控件大小
   */
  size?: InputSize,
  /**
   * 是否禁用状态，默认为 false
   */
  disabled?: boolean,
  /**
   * 可以点击清除图标删除内容
   */
  allowClear?: boolean,
  /**
   * 带有前缀图标的 input
   */
  prefix?: ReactElement,
  /**
   * 带有后缀图标的 input
   */
  suffix?: ReactElement,
  /**
   * 输入框内容
   */
  value?: string
  /**
   * 输入框默认内容
   */
  defaultValue?: string
  /**
   * onChange 输入框内容变化时的回调
   */
  onChange?: (e: React.ChangeEvent) => void
}

const Input: React.FC<IInputProps> = (props) => {
  const {
    size,
    disabled,
    allowClear,
    prefix,
    suffix,
    value,
    defaultValue,
    onChange
  } = props

  const inputClasses = classNames('whmk-input', {
    [`whmk-input-${size}`]: !!size,
    ['whmk-input-disabled']: disabled,
    ['whmk-input-have-clean']: allowClear,
  })

  const containerClasses = classNames('whmk-input-container',{
    [`whmk-input-container-${size}`]: !!size,
  })



  return (
    <div className={containerClasses}>
      {prefix && <span className='whmk-input-prefix'>{prefix}</span>}
      <span className='whmk-input-wrapper'>
        <input type="text" className={inputClasses} onChange={onChange} disabled={disabled}/>
        {allowClear && (
          <span className='whmk-input-clean-icon'>
            <Icon icon='times-circle'/>
          </span>
        )}
      </span>
      {suffix && <span className='whmk-input-suffix'>{suffix}</span>}
    </div>
  )
}

Input.defaultProps = {
  size: 'md',
  disabled: false,
  allowClear: true
}

export default Input
