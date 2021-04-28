export interface FileItem {
  row?: File,
  [key:string]:any
}

export type FileList<T> = T[]

export interface IUploadHttpProps<T> {
  action: string,
  onProgress?: (loaded: number, total: number, files: FileList<T>,res:XMLHttpRequest) => void
  onSuccess?: (files: FileList<T>,res:XMLHttpRequest) => void
  onFail?: (files: FileList<T>,res:XMLHttpRequest) => void
  onFinal?: (file: FileList<T>,res:XMLHttpRequest) => void,
  files: FileList<T>,
  timeout?: number,
  onTimeOut?: (files: FileList<T>,res:XMLHttpRequest) => void
  onAbort?: (files: FileList<T>,res:XMLHttpRequest) => void
  responseType?: XMLHttpRequestResponseType
  name?:string,
  headers?:{[key:string]:any},
  withCredentials?:boolean
  data?:{[key:string]:any},
}

class UploadHttp<T = FileItem> {
  public config: IUploadHttpProps<T>;
  public xhr: XMLHttpRequest

  constructor(props: IUploadHttpProps<T>) {
    this.config = props
    this.xhr = new XMLHttpRequest()

    this.uploadFiles()
  }

  private uploadFiles() {
    const {
      action,
      onProgress,
      onSuccess,
      onFail,
      onFinal,
      files,
      onAbort,
      timeout = 10000,
      onTimeOut,
      responseType = 'json',
      withCredentials = false,
      name = 'file',
      headers = {},
      data = {},
    } = this.config
    const xhr = this.xhr, uploader = xhr.upload
    xhr.timeout = timeout;
    xhr.responseType = responseType
    xhr.withCredentials = withCredentials
    xhr.open('POST', action, true)
    xhr.setRequestHeader('Content-Type', 'multipart/form-data')
    Object.keys(headers).forEach((key) =>{
      xhr.setRequestHeader(key,headers[key])
    })
    const formData = new FormData()
    files.forEach(file => {
      // @ts-ignore
      file.row && formData.append(name, file.row)
    })
    Object.keys(data).forEach(key=>{
      formData.append(key,data[key])
    })
    uploader.onloadstart = function (event: ProgressEvent) {
      // console.log('上传开始')
    };
    xhr.onload = function () {
      // console.log('上传成功')
      onSuccess && onSuccess(files, xhr)
    }
    xhr.onerror = function () {
      // console.log('上传失败')
      onFail && onFail(files,xhr)
    }
    xhr.ontimeout = function (event) {
      // console.log('上传超时')
      onTimeOut && onTimeOut(files,xhr)
    };
    uploader.onprogress = function (event: ProgressEvent) {
      // console.log('上传中...')
      onProgress && onProgress(event.loaded, event.total, files,xhr)
    };
    uploader.onabort = function (event) {
      // console.log(`取消上传`)
      onAbort && onAbort(files,xhr)
    }
    xhr.onloadend = function (event) {
      // console.log('上传操作结束')
      onFinal && onFinal(files,xhr)
    };
    xhr.send(formData)
  }

  abort() {
    this.xhr.abort()
  }

  setRequestHeader(name: string, value: string) {
    this.xhr.setRequestHeader(name, value)
  }
}

export default UploadHttp
