import React, {ChangeEvent, useRef, useImperativeHandle} from "react";
import classNames from "classnames";
import UploadHttp, {IUploadHttpProps} from "../../utils/upload";
import Button from "../Button";

export interface IUploadProps extends Omit<IUploadHttpProps, 'files'> {
  beforeUpload?: (files: FileList) => boolean,
  onChange?:(files:FileList) => void
}


const Upload: React.FC<IUploadProps> = React.forwardRef((props, ref) => {
  const {
    action,
    onProgress,
    onSuccess,
    onFail,
    onFinal,
    onAbort,
    timeout,
    onTimeOut,
    responseType,
    beforeUpload,
    onChange,
  } = props


  useImperativeHandle(ref, () => ({
    abort: uploaderRef.current.abort
  }))

  const inputRef = useRef<HTMLInputElement>(null)
  const uploaderRef = useRef<any | null>(null)

  const handleClick = () => {
    inputRef.current && inputRef.current.click()
  }

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    onChange && onChange(files)
    if (!beforeUpload || await beforeUpload(files)) {
      uploadFiles(files)
    }
  }

  const uploadFiles = (files: FileList) => {
    const uploader = new UploadHttp({
      action,
      files,
      onProgress,
      onSuccess,
      onFail,
      onFinal,
      onAbort,
      onTimeOut,
      responseType,
      timeout,
    })
    uploaderRef.current = uploader
    console.log('uploader:', uploader);
  }


  return (
    <div className='whmk-upload-wrapper'>
      <Button
        onClick={handleClick}
        btnType={"primary"}
      >
        上传文件
      </Button>
      <input
        type="file"
        style={{display: 'none'}}
        onChange={handleChange}
        ref={inputRef}
      />
    </div>
  )
})

export default Upload
