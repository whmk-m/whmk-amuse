import React, {ChangeEvent, useRef, useImperativeHandle, useState, useEffect} from "react";
import classNames from "classnames";
import UploadHttp, {FileList, FileItem} from "../../utils/upload";
import Button from "../Button";
import {guid} from "../../utils";

export interface IUploadProps {
  /**
   * 上传地址
   */
  action: string,
  /**
   * 设置上传超时限制，默认 10s
   */
  timeout?: number,
  /**
   * 监听超时回调
   * @param files 本次上传的文件，是一个数组
   */
  onTimeOut?: (files: FileList<IFileItemProps>) => void
  /**
   * 监听取消上传回调
   * @param files 本次上传的文件，是一个数组
   */
  onAbort?: (files: FileList<IFileItemProps>) => void
  /**
   * 上传前的处理，当返回true时，则继续上传，否则不会上传
   * @param files 本次上传的文件，是一个数组
   * @return boolean
   */
  beforeUpload?: (files: FileList<IFileItemProps>) => boolean | Promise<boolean>,
  /**
   * 文件选择时、或者文件上传状态更新时
   * @param files 本次上传的文件，是一个数组
   */
  onChange?: (files: FileList<IFileItemProps>) => void,
  /**
   * 删除文件前的处理，当返回true时，则继续删除，否则不会删除
   * @param files 本次上传的文件，是一个数组
   * @return boolean  | Promise<boolean>
   */
  beforeRemove?: (file: IFileItemProps) => boolean | Promise<boolean>,
  /**
   * 默认已上传的文件列表
   */
  defaultFileList?: IFileItemProps[]
  /**
   * 上传的文件列表，受控属性，当配合onChange 函数使用时，用户可自己处理需要展示的文件列表数据
   */
  fileList?: IFileItemProps[]
  /**
   * 上传成功后，接口返回的数据类型，
   *  "" | "arraybuffer" | "blob" | "document" | "json" | "text";
   */
  responseType?: XMLHttpRequestResponseType
}

// 文件上传的状态
export type UploadStatus = 'ready' | 'uploading' | 'success' | 'error'

// 每个文件对象包括的属性
export interface IFileItemProps extends FileItem {
  uid?: string,
  status?: UploadStatus,
  size?: number,
  name: string,
  percent?: number,
  response?: XMLHttpRequest | null

  [key: string]: any
}

/**
 * ## 上传组件
 */
const Upload: React.FC<IUploadProps> = React.forwardRef((props, ref) => {
  const {
    action,
    onAbort,
    timeout,
    onTimeOut,
    responseType,
    beforeUpload,
    beforeRemove,
    onChange,
    defaultFileList,
    fileList: controlFileList
  } = props

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
  const uploaderRef = useRef<any | null>([])
  const [fileList, setFileList] = useState<Array<IFileItemProps>>(initFileList)

  // 监听用户自己控制的列表 controlFileList 改变时，更新组件内列表数据
  useEffect(() => {
    if (Array.isArray(controlFileList)) {
      let _files = controlFileList.map(item => ({
        ...item,
        uid: typeof item.uid !== 'undefined' ? item.uid : guid(),
        status: item.status || 'success',
      }))
      setFileList(_files)
    }
  }, [controlFileList])

  const handleClick = () => {
    inputRef.current && inputRef.current.click()
  }

  // 根据文件上传时的不同状态，更新列表展示
  const updateFileList = (files: FileList<IFileItemProps>, updateAttrObj: Partial<IFileItemProps>, callback?: (...args: any[]) => any) => {
    setFileList(prevList => {
      const _files = prevList.slice()
      files.forEach(item => {
        const index = _files.findIndex(file => file.uid === item.uid)
        if (index !== -1) {
          _files[index] = {
            ..._files[index],
            ...updateAttrObj
          }
        }
      })
      callback && callback(_files)
      // 没有onChange函数，则组件自身去更新数据，否则交给用户自己去更新列表
      onChange && onChange(_files)
      return _files
    })
  }

  // 当选择文件时触发
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
      onChange ? onChange(_files.concat(fileList)) : setFileList(_files.concat(fileList))
      _files.forEach(item => {
        uploadFiles([item])
      })
    }
  }

  // 监听上传进度
  const handleOnProgress = (loaded: number, total: number, files: FileList<IFileItemProps>, res: XMLHttpRequest) => {
    updateFileList(files, {
      status: 'uploading',
      percent: loaded / total,
      response: res
    })
  }

  // 上传成功
  const handleOnSuccess = (files: FileList<IFileItemProps>, res: XMLHttpRequest) => {
    updateFileList(files, {
      status: 'success',
      percent: 100,
      response: res
    })
  }

  // 上传失败
  const handleOnFail = (files: FileList<IFileItemProps>, res: XMLHttpRequest) => {
    updateFileList(files, {
      status: 'error',
      response: res
    })
  }

  // 取消上传
  const handleOnAbort = (files: FileList<IFileItemProps>, res: XMLHttpRequest) => {
    updateFileList(files, {
      status: 'error',
      response: res
    }, onAbort)
  }

  // 上传超时
  const handleOnTimeOut = (files: FileList<IFileItemProps>, res: XMLHttpRequest) => {
    updateFileList(files, {
      status: 'error',
      response: res
    }, onTimeOut)
  }

  // 删除上传的文件
  const handleRemove = async (file: IFileItemProps) => {
    if (!beforeRemove || await beforeRemove(file)) {
      const _files = fileList.filter(item => item.uid !== file.uid);
      onChange ? onChange(_files) : setFileList(_files)
    }
  }

  // 上传文件
  const uploadFiles = (files: FileList<IFileItemProps>) => {
    const uploader = new UploadHttp<IFileItemProps>({
      action,
      files,
      onProgress: handleOnProgress,
      onSuccess: handleOnSuccess,
      onFail: handleOnFail,
      onAbort: handleOnAbort,
      onTimeOut: handleOnTimeOut,
      responseType,
      timeout,
    })
    uploaderRef.current.push(uploader)
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
              <div className='whmk-upload-progress'>{(item.percent ? (item.percent * 100) : 0).toFixed(1) + '%'}</div>
              <span onClick={() => handleRemove(item)}>删除</span>
            </li>
          ))
        }
      </ul>
    </div>
  )
})

export default Upload
