export interface FileItem {
  row?: File,
  name?:string,
  headers?:object,
  withCredentials?:boolean
  data?:object,
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
      responseType = 'json'
    } = this.config
    const xhr = this.xhr, uploader = xhr.upload
    xhr.timeout = timeout;
    xhr.responseType = responseType
    xhr.open('POST', action, true)
    xhr.setRequestHeader('Content-Type', 'multipart/form-data')
    const formData = new FormData()
    files.forEach(file => {
      // @ts-ignore
      file.row && formData.append(file.name, file.row)
    })
    uploader.onloadstart = function (event: ProgressEvent) {
      console.log('上传开始')
    };
    uploader.onprogress = function (event: ProgressEvent) {
      console.log('上传中...')
      onProgress && onProgress(event.loaded, event.total, files,xhr)
    };
    uploader.onload = function (event: ProgressEvent) {
      if (xhr.status === 200) {
        console.log('上传成功')
        onSuccess && onSuccess(files,xhr)
      } else {
        console.log('上传失败')
        onFail && onFail(files,xhr)
      }
    };
    uploader.onerror = function (event) {
      console.log('上传失败')
      onFail && onFail(files,xhr)
    };
    uploader.onloadend = function (event) {
      console.log('上传操作结束')
      onFinal && onFinal(files,xhr)
    };
    uploader.ontimeout = function (event) {
      console.log('上传超时')
      onTimeOut && onTimeOut(files,xhr)
    };
    uploader.onabort = function (event) {
      console.log(`取消上传`)
      onAbort && onAbort(files,xhr)
    }
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
