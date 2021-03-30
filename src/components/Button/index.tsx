import React from 'react'
import classnames from "classnames";

export type ButtonSize = 'lg' | 'md' | 'sm'

export type ButtonType = 'default' | 'primary' | 'danger' | 'link' | 'text'

interface IBaseButtonProps {
  /**
   * 自定义类名
   */
  className?: string,
  /** 是否禁用 */
  disabled?: boolean,
  /** 尺寸 */
  size?: ButtonSize,
  /** 类型 */
  btnType?: ButtonType,
  /**  当btnType="link"时需要  */
  href?: string,
  /**
   * React.ReactNode
   */
  children: React.ReactNode,
}

// 将T类型每个属性类型变成可选
type Partial<T> = {
  [P in keyof T]?: T[P]
}

// 原生的button类型， & 交叉类型，表示都有两者类型
type NativeButtonProps = IBaseButtonProps & React.ButtonHTMLAttributes<HTMLElement>

// 原生的a类型
type AnchorButtonProps = IBaseButtonProps & React.AnchorHTMLAttributes<HTMLElement>

// 结合成最终的button类型
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>

/**
 * #### 按钮用于开始一个即时操作。
 * #### 使用方式：
 * ```js
 *  import { Button } from 'whmk-amuse'
 * ```
 * @param props
 * @constructor
 */
const Button: React.FC<ButtonProps> = (props) => {
  const {
    className,
    disabled = false,
    size,
    btnType,
    href,
    children,
    ...rest // 其他button或者a标签上原生支持的属性
  } = props
  const classNames = classnames('btn', {
    [`btn-${btnType}`]: !!btnType,
    [`btn-${size}`]: !!size,
    'disabled': !!disabled,
    [`${className}`]: !!className
  })
  if (btnType === 'link') {
    return (
      <a
        className={classNames}
        href={href}
        {...rest}
      >
        <span>
           {children}
        </span>
      </a>
    )
  }
  return (
    <button
      disabled={disabled}
      className={classNames}
      {...rest}
    >
     <span>
           {children}
        </span>
    </button>
  )
}

export default Button
