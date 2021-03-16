import React, {useState} from 'react'
import classnames from "classnames";

export type AlertType = 'success' | 'danger' | 'warning' | 'info'


interface IBaseAlertProps {
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
    <>
      {
        visible && (
          <div className={classNames}>
            <div className="main">
              <div className='title'>{title}</div>
              {description && <div className='description'>{description}</div>}
            </div>
            {
              closable && (
                <div className='close-icon' onClick={() => {
                  setVisible(false)
                  onClose && onClose()
                }}>X</div>
              )
            }
          </div>
        )
      }
    </>
  )
}

Alert.defaultProps = {
  type:'info',
  closable:false,
  onClose:()=>{}
}

export default Alert
