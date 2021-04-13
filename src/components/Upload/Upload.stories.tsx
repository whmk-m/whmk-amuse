import React, {useState} from "react";
import {Story, Meta} from '@storybook/react/types-6-0';
import Upload, {IUploadProps} from "./index";

export default {
  title: "whmk-amuse/Upload",
  component: Upload,
  argTypes: {},
} as Meta

const Template: Story<IUploadProps> = (props) => <Upload {...props}/>

export const DefaultUpload = Template.bind({})

DefaultUpload.args = {
  action: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
  beforeUpload: (files: FileList) => {
    console.log('beforeUpload:', files)
    // 大于 60M 的 不能上传
    if (files[0].size / 1024 / 1024 > 60) {
      console.log('beforeUpload: 大于60M的不能上传')
      return false
    }
    return true
  }
}

DefaultUpload.storyName = '上传组件'
