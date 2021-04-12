import React from "react";
import classNames from "classnames";
import UploadHttp, {IUploadHttpProps} from "../../utils/upload";
import Button from "../Button";

export interface IUploadProps extends IUploadHttpProps {
  beforeUpload?: (files: FileList) => void
}

const Upload: React.FC<IUploadProps> = (props) => {
  const {
    action,
    onProgress,
    onSuccess,
    onFail,
    onFinal,
    files,
    onAbort,
    timeout,
    onTimeOut,
    responseType,
    beforeUpload
  } = props

  return (
    <div className='whmk-upload-wrapper'>
      <Button>上传文件</Button>
      <input type="file" style={{display: 'none'}}/>
    </div>
  )
}

export default Upload
