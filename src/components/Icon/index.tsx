import React from 'react'
import classNames from "classnames";
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome'

export type themeProps = 'primary' | 'danger' | 'success' | 'info' | 'warning' | 'secondary'

interface IIconProps extends  FontAwesomeIconProps {
  theme?:themeProps
}

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
