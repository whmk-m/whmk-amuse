import React, {useState} from 'react'
import classnames from "classnames";
import Icon from "../Icon";
import Transition from "../Transition";

export type AlertType = 'success' | 'danger' | 'warning' | 'info'


export interface IBaseAlertProps {
  type?: AlertType,
  title: string
  description?: string,
  onClose?: () => void,
  closable?: boolean,
}

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
              onClick={() => {
                setVisible(false)
                onClose && onClose()
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
  type:'info',
  closable:false,
  onClose:()=>{}
}

export default Alert
