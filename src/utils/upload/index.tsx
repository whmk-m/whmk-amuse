export interface FileItem {
  row?: File,
  [key:string]:any
}

export type FileList = FileItem[]

export interface IUploadHttpProps {
  action: string,
  onProgress?: (loaded: number, total: number, files: FileList) => void
  onSuccess?: (files: FileList) => void
  onFail?: (files: FileList) => void
  onFinal?: (file: FileList) => void,
  files: FileList,
  timeout?: number,
  onTimeOut?: (files: FileList) => void
  onAbort?: (files: FileList) => void
  responseType?: XMLHttpRequestResponseType
}

class UploadHttp {
  public config: IUploadHttpProps;
  public xhr: XMLHttpRequest

  constructor(props: IUploadHttpProps) {
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
      file.row && formData.append(file.name, file.row)
    })
    uploader.onloadstart = function (event: ProgressEvent) {
      console.log('上传开始')
    };
    uploader.onprogress = function (event: ProgressEvent) {
      console.log('上传中...')
      onProgress && onProgress(event.loaded, event.total, files)
    };
    uploader.onload = function (event: ProgressEvent) {
      if (xhr.status === 200) {
        console.log('上传成功')
        onSuccess && onSuccess(files)
      } else {
        console.log('上传失败')
        onFail && onFail(files)
      }
    };
    uploader.onerror = function (event) {
      console.log('上传失败')
      onFail && onFail(files)
    };
    uploader.onloadend = function (event) {
      console.log('上传操作结束')
      onFinal && onFinal(files)
    };
    uploader.ontimeout = function (event) {
      console.log('上传超时')
      onTimeOut && onTimeOut(files)
    };
    uploader.onabort = function (event) {
      console.log(`取消上传`)
      onAbort && onAbort(files)
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
