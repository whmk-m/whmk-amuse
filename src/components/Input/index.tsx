import React, {HTMLAttributes, InputHTMLAttributes, ReactElement, ReactNode} from 'react'
import classNames from "classnames";

export type InputSize = 'lg' | 'md' | 'sm'

type Extract<T,P extends keyof any> = T extends P ? never : T

type Pick<T,K extends keyof T> = {
  [P in K]: T[P]
}

type Omit<T,P extends keyof T> = Pick<T, Extract<keyof T, P>>

// @ts-ignore
export interface IInputProps extends Omit<InputHTMLAttributes<HTMLElement>, 'size' | 'onChange'>{
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
  onChange?: (e: MouseEvent) => void
}

const Input:React.FC<IInputProps> = (props)=>{
  const {

  } = props


  return (
    <div>

    </div>
  )
}

export default Input
