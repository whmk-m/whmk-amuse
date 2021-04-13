import React, {useState} from "react";
import {Story, Meta} from '@storybook/react/types-6-0';
import Upload , {IUploadProps} from "./index";

export default {
  title: "whmk-amuse/Upload",
  component: Upload,
  argTypes: {},
} as Meta

const Template: Story<IUploadProps> = (props) => <Upload {...props}/>

export const DefaultUpload = Template.bind({})

DefaultUpload.args = {
  action:'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
  beforeUpload:undefined
}

DefaultUpload.storyName = '上传组件'
