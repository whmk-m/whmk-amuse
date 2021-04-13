export interface IUploadHttpProps {
  action: string,
  onProgress?: (loaded: number, total: number, files: FileList) => void
  onSuccess?: (res: XMLHttpRequest) => void
  onFail?: (err: XMLHttpRequest) => void
  onFinal?: (file: FileList) => void,
  files: FileList,
  timeout?: number,
  onTimeOut?: () => void
  onAbort?: () => void
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
    const fileList = Array.from(files)
    fileList.forEach(file => {
      formData.append(file.name, file)
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
        onSuccess && onSuccess(xhr)
      } else {
        console.log('上传失败')
        onFail && onFail(xhr)
      }
    };
    uploader.onerror = function (event) {
      console.log('上传失败')
      onFail && onFail(xhr)
    };
    uploader.onloadend = function (event) {
      console.log('上传操作结束')
      onFinal && onFinal(files)
    };
    uploader.ontimeout = function (event) {
      console.log('上传超时')
      onTimeOut && onTimeOut()
    };
    uploader.onabort = function (event) {
      console.log(`取消上传`)
      onAbort && onAbort()
    }
    xhr.send(formData)
  }

  abort() {
    this.xhr.abort()
  }

  setRequestHeader(name:string,value:string) {
    this.xhr.setRequestHeader(name,value)
  }
}

export default UploadHttp
