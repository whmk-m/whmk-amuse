import React, {useState} from "react";
import classNames from "classnames";
import {FileList} from "../../utils/upload";
import Icon from "../Icon";

export interface IDraggerProps {
  onFiles: (files: FileList<any>) => void
}

const Dragger: React.FC<IDraggerProps> = (props) => {
  const {
    onFiles,
    children
  } = props

  // 表示是否正在拖拽区域的上方
  const [isDragover, setDragover] = useState(false)

  const classes = classNames('whmk-upload-dragger-wrapper', {
    'is-dragover': isDragover
  })

  const handleDrag = (e: React.DragEvent<HTMLElement>, isOver: boolean) => {
    e.preventDefault()
    e.stopPropagation()
    setDragover(isOver)
  }

  const handleDrop = (e: React.DragEvent<HTMLElement>) => {
    handleDrag(e, false)
    const files = Array.from(e.dataTransfer.files || [])
    if (!files) return
    onFiles && onFiles(files)
  }

  return (
    <div
      className={classes}
      onDragEnter={(e) => handleDrag(e, true)}
      onDragOver={(e) => handleDrag(e, true)}
      onDragLeave={(e) => handleDrag(e, false)}
      onDrop={(e) => handleDrop(e)}
    >
      {
        children ? children : (
           <>
             <Icon icon='upload' size={"lg"} theme='primary'/>
             <span className='text'>拖动文件到此处上传</span>
           </>
        )
      }
    </div>
  )
}

export default Dragger
