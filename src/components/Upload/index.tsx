import React, {ChangeEvent, useRef, useState, useEffect} from "react";
import classNames from "classnames";
import UploadHttp, {FileList, FileItem} from "../../utils/upload";
import Button from "../Button";
import {guid} from "../../utils";
import Icon from "../Icon";

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
  defaultFileList?: IFileItemProps[],
  /**
   * 上传的文件列表，受控属性，当配合onChange 函数使用时，用户可自己处理需要展示的文件列表数据
   */
  fileList?: IFileItemProps[],
  /**
   * 上传成功后，接口返回的数据类型，
   *  "" | "arraybuffer" | "blob" | "document" | "json" | "text";
   */
  responseType?: XMLHttpRequestResponseType,
  /**
   * 接受上传的文件类型, 详见 input accept Attribute
   */
  accept?:string,
  /**
   * 上传所需额外参数
   */
  data?:object,
  /**
   * 设置上传的请求头部，IE10 以上有效
   */
  headers?:object,
  /**
   * 是否支持多选文件，ie10+ 支持。开启后按住 ctrl 可选择多个文件
   */
  multiple?:boolean,
  /**
   * 发到后台的文件参数名
   */
  name?:string,
  /**
   * 上传请求时是否携带 cookie
   */
  withCredentials?:boolean
  /**
   *  TODO:
   *  1.增加自定义header的能力
   *  2.添加 name 属性，代表发到后台的文件参数名称
   *  3.添加data属性，上传所需的额外参数
   *  4.增加是否可携带cookie的配置
   *  5.添加input标书的file约束属性 如：accept、multiple
   *  6.增加自定义触发上传的元素
   *  7.点击上传文件名称，增加 onPreview 事件进行预览或用户自定义的操作
   *
   *  8.支持拖动上传
   *  9.可以拖动排序上传的文件列表
   */
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
    fileList: controlFileList,
    accept,
    data,
    withCredentials,
    headers,
    multiple,
    name
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

  const renderIconStatus = (status: UploadStatus) => {
    switch (status) {
      case 'ready':
        return <Icon theme={'secondary'} icon={'spinner'} size={'sm'}/>
      case 'uploading':
        return <Icon theme={'secondary'} icon={'spinner'} size={'sm'}/>;
      case 'success':
        return <Icon theme={'success'} icon={'check-circle'} size={'sm'} />
      case 'error':
        return <Icon theme={'danger'} icon={'exclamation-circle'} size={'sm'}/>
    }
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
        multiple={multiple}
        accept={accept}
      />
      <ul className="whmk-upload-list">
        {
          fileList.length > 0 && fileList.map((item, index) => (
            <li
              key={item.uid && item.uid + index}
              className={`whmk-upload-list-item whmk-upload-list-item-${item.status}`}
            >
              <span className='whmk-upload-file-name'>{item.name}</span>
              <span
                className={`whmk-upload-icon ${item.status === 'uploading' || item.status === 'ready' ? 'infinite-rotation' : ''}`}>
                {item.status && renderIconStatus(item.status)}
              </span>
              <span className='whmk-upload-delete-icon' onClick={() => handleRemove(item)}>
                <Icon theme={"danger"} icon={'times-circle'} size={'sm'} title={'删除'}/>
              </span>
              {
                (item.status === 'ready' || item.status === 'uploading') && (
                  <div className='whmk-upload-progress'>
                    <div
                      className='whmk-upload-progress-bar'
                      style={{width: `${(item.percent ? (item.percent * 100) : 0).toFixed(1) + '%'}`}}>

                    </div>
                  </div>
                )
              }
            </li>
          ))
        }
      </ul>
    </div>
  )
})

export default Upload
