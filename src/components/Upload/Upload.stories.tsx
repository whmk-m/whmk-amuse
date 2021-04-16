import React, {useState} from "react";
import {Story, Meta} from '@storybook/react/types-6-0';
import Upload, {IUploadProps, IFileItemProps} from "./index";
import {FileList} from "../../utils/upload";
import Button from "../Button";
import Alert from "../Alert";

export default {
  title: "whmk-amuse/Upload",
  component: Upload,
  argTypes: {},
} as Meta

const Template: Story<IUploadProps> = (props) => <Upload {...props}/>

export const DefaultUpload = Template.bind({})

DefaultUpload.args = {
  onChange: undefined,
  beforeRemove: undefined,
  beforeUpload: undefined,
  onAbort: undefined,
  onTimeOut: undefined,
  action: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed'
}

DefaultUpload.storyName = '最基础的上传组件 可配置基础属性'

export const DefaultUpload2 = () => {
  return (
    <Upload
      action={'https://www.mocky.io/v2/5185415ba171ea3a00704eed'}
    />
  )
}
DefaultUpload2.storyName = '最基础的上传组件2 不能配置基础属性'

export const BeforeDealUpload = () => {

  const handleBeforeUpload = (files: FileList<IFileItemProps>) => {
    console.log('beforeUpload:', files)
    // 大于 5M 的 不能上传
    if (files[0].size && files[0].size / 1024 / 1024 > 5) {
      alert('beforeUpload: 大于5M的不能上传')
      return false
    }
    return true
  }

  const handleBeforeRemove = (file: IFileItemProps) => {
    // 大于 1M 的 不能删除
    if (file.size && file.size / 1024 / 1024 > 1) {
      alert('beforeRemove: 大于1M的不能删除')
      return false
    }
    return true
  }

  return (
    <Upload
      action={'https://www.mocky.io/v2/5185415ba171ea3a00704eed'}
      beforeUpload={handleBeforeUpload}
      beforeRemove={handleBeforeRemove}
    />
  )
}

BeforeDealUpload.storyName = '上传前、删除前的处理'


export const LoadingUpload = () => {

  const handleChange = (files: FileList<IFileItemProps>) => {
    if (files.length === 0) return
    const file = files[0]
    if (file.status === 'uploading') {
      console.log('开始 loading....')
      return
    }
    if (file.status === 'error' || file.status === 'success') {
      console.log('结束 loading....')
      return
    }
  }

  return (
    <Upload
      action={'https://www.mocky.io/v2/5185415ba171ea3a00704eed'}
      onChange={handleChange}
    />
  )
}
LoadingUpload.storyName = '根据文件上传状态 展示loading'

export const ControlFileList = () => {
  const [fileList, setFileList] = useState<IFileItemProps[]>([{
    uid: "-1",
    name: "fiol1e.png",
    status: "success",
  }, {
    name: "hello.png",
  }, {
    name: "world.png",
  }])

  const handleChange = (files: FileList<IFileItemProps>) => {
    console.log('ControlFileList  log开始============================================')
    console.log(files)
    console.log('ControlFileList  log结束============================================')
    setFileList(files.slice(0, 2))
  }

  return (
    <div style={{width: '300px'}}>
      <Upload
        fileList={fileList}
        action={'https://www.mocky.io/v2/5185415ba171ea3a00704eed'}
        onChange={handleChange}
      />
    </div>
  )
}
ControlFileList.storyName = '受控的fileList'


export const ManualUpload = () => {
  // 设置 manualUpload:true 手动上传
  const [fileList, setFileList] = useState<IFileItemProps[]>([])

  const handleChange = (files: FileList<IFileItemProps>) => {
    setFileList(files)
  }

  const handleUpload = () => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', 'https://www.mocky.io/v2/5185415ba171ea3a00704eed')
    xhr.setRequestHeader('Content-Type', 'multipart/form-data')
    xhr.responseType = 'json'
    xhr.onload = () => {
      console.log('上传成功')
      const files:IFileItemProps[] = fileList.map(item=>({
        ...item,
        status:'success',
      }))
      setFileList(files)
    }
    xhr.onerror = () => {
      console.log('上传失败')
      const files:IFileItemProps[] = fileList.map(item=>({
        ...item,
        status:'error',
      }))
      setFileList(files)
    }
    xhr.upload.onprogress = (event) => {
      console.log('上传中')
      const files:IFileItemProps[] = fileList.map(item=>({
        ...item,
        status:'uploading',
        percent:Number((event.loaded / event.total).toFixed(2))
      }))
      setFileList(files)
    }
    const formData = new FormData()
    fileList.forEach(item => {
      item.row && formData.append('file', item.row)
    })
    xhr.send(formData)
  }

  return (
    <div style={{width: '300px'}}>
      <Upload
        fileList={fileList}
        onChange={handleChange}
        manualUpload={true}
      />
      <Button onClick={() => handleUpload()} style={{marginTop:'30px'}}>点击上传</Button>
    </div>
  )
}
ManualUpload.storyName = '手动上传'



export const PreviewFileUpload = () => {

  const handlePreview = (file:IFileItemProps) => {
    alert('预览：' + file.name)
  }

  return (
    <Upload
      action='https://www.mocky.io/v2/5185415ba171ea3a00704eed'
      onPreview={handlePreview}
    />
  )
}

PreviewFileUpload.storyName = '点击文件预览'
