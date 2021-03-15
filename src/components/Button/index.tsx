import React from 'react'
import classnames from "classnames";

export enum ButtonSize {
  large = 'lg',
  middle = 'md',
  small = 'sm'
}


export enum ButtonType {
  default = 'default',
  primary = 'primary',
  danger = 'danger',
  link = 'link',
  text = 'text'
}


interface IBaseButtonProps {
  className?: string,
  disabled?: boolean,
  size?: ButtonSize,
  btnType?: ButtonType,
  href?: string,
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

const Button: React.FC<ButtonProps> = (props) => {
  const {
    className,
    disabled,
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
  if (btnType === ButtonType.link) {
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
