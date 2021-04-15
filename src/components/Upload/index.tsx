import React, {ChangeEvent, useRef, useImperativeHandle, useState, useEffect} from "react";
import classNames from "classnames";
import UploadHttp, {IUploadHttpProps, FileList, FileItem} from "../../utils/upload";
import Button from "../Button";
import { guid } from "../../utils";
import {type} from "os";

export interface IUploadProps extends Omit<IUploadHttpProps, 'files'> {
  beforeUpload?: (files: FileList) => boolean,
  onChange?: (files: FileList) => void,
  beforeRemove?: (file: IFileItemProps) => boolean,
  defaultFileList?:IFileItemProps[]
  fileList?:IFileItemProps[]
}

export type UploadStatus = 'ready' | 'uploading' | 'success' | 'error'

export interface IFileItemProps extends FileItem {
  uid?: string,
  status?: UploadStatus,
  size?: number,
  name: string,
  percent?: number,
  response?: XMLHttpRequest | null
  [key:string]:any
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
    beforeRemove,
    onChange,
    defaultFileList,
    fileList:controlFileList
  } = props

  useImperativeHandle(ref, () => ({
    abort: uploaderRef.current.abort
  }))

  // 初始化fileList
  const initFileList = () => {
    let _files: IFileItemProps[] = []
    if (Array.isArray(controlFileList) && controlFileList.length > 0) {
      _files = controlFileList
    } else if (Array.isArray(defaultFileList) && defaultFileList.length > 0) {
      _files = defaultFileList
    }
    return _files.map((item, index) => ({
      ...item,
      uid: typeof item.uid !== 'undefined' ? item.uid : guid(),
      status: item.status || 'success',
    }))
  }

  const inputRef = useRef<HTMLInputElement>(null)
  const uploaderRef = useRef<any | null>(null)
  const [fileList, setFileList] = useState<Array<IFileItemProps>>(initFileList)

  // 监听 controlFileList 改变时更新列表数据
  useEffect(()=>{
    if (Array.isArray(controlFileList) && controlFileList.length > 0) {
      setFileList(controlFileList.map(item => ({
        ...item,
        uid: typeof item.uid !== 'undefined' ? item.uid : guid(),
        status: item.status || 'success',
      })))
    }
  },[controlFileList])

  const handleClick = () => {
    inputRef.current && inputRef.current.click()
  }

  const updateFileList = (uid: string, updateAttrObj: Partial<IFileItemProps>) => {
    setFileList(prevList => (
      prevList.map(item => {
        if (item.uid === uid) {
          console.log({...item, ...updateAttrObj})
          return {...item, ...updateAttrObj}
        }
        console.log(item)
        return item
      })
    ))
  }

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const _files: IFileItemProps[] = Array.from(files).map((item, index) => ({
      uid: guid(),
      status: 'ready',
      size: item.size,
      name: item.name,
      percent: 0,
      row: item,
      response: null
    }))
    if (!beforeUpload || await beforeUpload(_files)) {
      // 没有onChange函数，则组件自身去更新数据，否则交给用户自己去更新列表
      if (!onChange) {
        setFileList(_files.concat(fileList))
      } else {
        onChange(_files.concat(fileList))
      }
      _files.forEach(item => {
        uploadFiles([item])
      })
    }
  }

  const handleOnProgress = (loaded: number, total: number, files: FileList) => {
    files.forEach(item => {
      updateFileList(item.uid, {
        status: 'uploading',
        percent: loaded / total,
        response: uploaderRef.current.xhr
      })
    })
  }

  const handleOnSuccess = (files: FileList) => {
    files.forEach(item => {
      updateFileList(item.uid, {
        status: 'success',
        response: uploaderRef.current.xhr
      })
    })
  }

  const handleOnFail = (files: FileList) => {
    files.forEach(item => {
      updateFileList(item.uid, {
        status: 'error',
        response: uploaderRef.current.xhr
      })
    })
  }

  const handleOnAbort = (files: FileList) => {

  }

  const handleOnTimeOut = (files: FileList) => {

  }

  const handleOnFinal = (file: FileList) => {

  }

  const handleRemove = async (file: IFileItemProps) => {
    if (!beforeRemove || await beforeRemove(file)) {
      setFileList(fileList.filter(item => item.uid !== file.uid))
    }
  }


  const uploadFiles = (files: FileList) => {
    const uploader = new UploadHttp({
      action,
      files,
      onProgress: handleOnProgress,
      onSuccess: handleOnSuccess,
      onFail: handleOnFail,
      onAbort: handleOnAbort,
      onTimeOut: handleOnTimeOut,
      onFinal: handleOnFinal,
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
        multiple={true}
      />
      <ul className="whmk-upload-list">
        {
          fileList.length > 0 && fileList.map((item, index) => (
            <li key={item.uid && item.uid + index} className='whmk-upload-list-item'>
              <span className='whmk-upload-file-name'>{item.name + '-'}</span>
              <span className='whmk-upload-status'>{item.status}</span>
              <div className='whmk-upload-progress'>{(item.percent ? (item.percent * 100): 0).toFixed(1) + '%'}</div>
              <span onClick={() => handleRemove(item)}>删除</span>
            </li>
          ))
        }
      </ul>
    </div>
  )
})

export default Upload
