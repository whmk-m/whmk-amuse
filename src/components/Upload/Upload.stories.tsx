import React, {useState} from "react";
import {Story, Meta} from '@storybook/react/types-6-0';
import Upload, {IUploadProps, IFileItemProps} from "./index";
import {FileList} from "../../utils/upload";

export default {
  title: "whmk-amuse/Upload",
  component: Upload,
  argTypes: {},
} as Meta

const Template: Story<IUploadProps> = (props) => <Upload {...props}/>

export const DefaultUpload = Template.bind({})

DefaultUpload.args = {
  onChange:undefined,
  beforeRemove:undefined,
  beforeUpload:undefined,
  onAbort:undefined,
  onTimeOut:undefined,
  action:'https://www.mocky.io/v2/5185415ba171ea3a00704eed'
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


export const ControlFileList = () => {
  const [fileList, setFileList] = useState<IFileItemProps[]>([{
    uid: "-1",
    name: "fiol1e.png",
    status: "success",
  },{
    name: "hello.png",
  },{
    name: "world.png",
  }])

  const handleChange = (files: FileList<IFileItemProps>) => {
    console.log('ControlFileList  log开始============================================')
    console.log(files)
    console.log('ControlFileList  log结束============================================')
    setFileList(files.slice(0, 2))
  }

  return (
   <div style={{width:'300px'}}>
     <Upload
       fileList={fileList}
       action={'https://www.mocky.io/v2/5185415ba171ea3a00704eed'}
       onChange={handleChange}
     />
   </div>
  )
}
ControlFileList.storyName = '受控的fileList'
