import React from 'react'
import classNames from "classnames";
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'

export type themeProps = 'primary' | 'danger' | 'success' | 'info' | 'warning' | 'secondary'

export interface IIconProps extends  FontAwesomeIconProps {
  /**
   * 设置icon的颜色
   */
  theme?:themeProps
}

/**
 *
 *    语义化的矢量图标。使用图标组件，目前仅支持`@fortawesome/free-solid-svg-icons`
 *
 *    我们支持 fortawesome 使用图标的任何一种方式，以及`@fortawesome/free-solid-svg-icons`拥有的图标。
 *
 *     [点击查看 fontawesome 更多信息](https://fontawesome.com/icons?d=gallery&p=2&s=solid&m=free)
 * @param props
 * @constructor
 */
const Icon:React.FC<IIconProps> = (props) => {
  const {
    theme,
    ...restProps
  } = props

  const classes = classNames('whmk-icon',{
    [`whmk-icon-${theme}`]:theme
  })

  return (
    <FontAwesomeIcon className={classes} {...restProps}/>
  )
}

export default Icon
