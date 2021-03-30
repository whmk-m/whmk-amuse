import React, {useState} from 'react'
import classnames from "classnames";
import Icon from "../Icon";
import Transition from "../Transition";

export type AlertType = 'success' | 'danger' | 'warning' | 'info'


export interface IBaseAlertProps {
  /**
   * 提示类型
   */
  type?: AlertType,
  /**
   * 提示标题
   */
  title: string
  /**
   * 提示描述
   */
  description?: string,
  /**
   * 关闭提示时的回调
   * @param e
   */
  onClose?: (e:React.MouseEvent) => void,
  /**
   * 是否需要关闭，为true时展示关闭图标
   */
  closable?: boolean,
}

/**
 * ####  警告提示，展现需要关注的信息。
 * ### 何时使用
 * 1. 当某个页面需要向用户显示警告的信息时。
 * 2. 非浮层的静态展现形式，始终展现，不会自动消失，用户可以点击关闭。
 *
 * #### 使用方式
 * ```js
 * import { Alert } from 'whmk-amuse'
 * ```
 * @param props
 * @constructor
 */
const Alert: React.FC<IBaseAlertProps> = (props) => {
  const {
    type,
    title,
    description,
    onClose,
    closable,
  } = props
  const classNames = classnames('whmk-alert', {
    [`whmk-alert-${type}`]: !!type,
  })

  const [visible, setVisible] = useState<boolean>(true)

  return (
    <Transition
      in={visible}
      timeout={300}
      animation='zoom-in-top'
    >
      <div className={classNames}>
        <div className="main">
          <div className='title'>{title}</div>
          {description && <div className='description'>{description}</div>}
        </div>
        {
          closable && (
            <div
              className='close-icon'
              onClick={(e) => {
                setVisible(false)
                onClose && onClose(e)
              }}>
              <Icon icon='times'/>
            </div>
          )
        }
      </div>
    </Transition>
  )
}

Alert.defaultProps = {
  type: 'info',
  closable: false,
}

export default Alert
