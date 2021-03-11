import React from 'react'
import classnames from "classnames";

export enum ButtonSize {
  large = 'lg',
  middle = 'md',
  small = 'sm'
}


export enum ButtonTypeEnum {
  default = 'default',
  primary = 'primary',
  danger = 'danger',
  link = 'link'
}

export type ButtonType = ButtonTypeEnum.default | ButtonTypeEnum.primary | ButtonTypeEnum.danger | ButtonTypeEnum.link

interface IBaseButtonProps {
  className?: string,
  disabled?: boolean,
  size?: ButtonSize,
  type?: ButtonType,
  href?: string,
  children: React.ReactNode,
  [propName: string]: any
}

const Button: React.FC<IBaseButtonProps> = (props) => {
  const {
    className,
    disabled,
    size,
    type,
    href,
    children,
    ...rest // 其他button或者a标签上原生支持的属性
  } = props
  const classNames = classnames('btn', {
    [`btn-${type}`]: !!type,
    [`btn-${size}`]: !!size,
    'disabled':!!disabled,
    [`${className}`]:!!className
  })
  if (type === ButtonTypeEnum.link) {
    return (
      <a
        className={classNames}
        href={href}
        {...rest}
      >
        {children}
      </a>
    )
  }
  return (
    <button
      disabled={disabled}
      className={classNames}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
