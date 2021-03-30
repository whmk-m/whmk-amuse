import React from "react";
import {Story, Meta} from '@storybook/react/types-6-0';
import Alert, { IBaseAlertProps } from "./index";

export default {
  title: "whmk-amuse/Alert",
  component: Alert,
  argTypes: {
    type: {
      control: {
        type: 'inline-radio',
        options: ['success', 'danger', 'warning','info'],
      },
    },
  },
} as Meta


const Template: Story<IBaseAlertProps> = (props) => <Alert {...props}/>

export const Info = Template.bind({})
Info.args = {
  title:'Info Text'
}
Info.storyName = 'Info 警告提示'

export const Success = Template.bind({})
Success.args = {
  title:'Success Text',
  type:"success"
}
Success.storyName = 'Success 警告提示'

export const Danger = Template.bind({})
Danger.args = {
  title:'Danger Text',
  type:"danger"
}
Danger.storyName = 'Danger 警告提示'

export const DangerDesc = Template.bind({})
DangerDesc.args = {
  title:'DangerDesc Text',
  type:"danger",
  description: 'DangerDesc Description DangerDesc Description DangerDesc Description DangerDesc Description'
}
DangerDesc.storyName = 'DangerDesc 警告提示'


export const Warning = Template.bind({})
Warning.args = {
  title:'Warning Text',
  type:"warning"
}
Warning.storyName = 'Warning 警告提示'

export const CloseCallBackInfo = Template.bind({})
CloseCallBackInfo.args = {
  title:'CloseCallBackInfo Text',
  type:"info",
  closable:true,
  /*onClose(e){
    alert('关闭')
  }*/
}
CloseCallBackInfo.storyName = 'CloseCallBackInfo 警告提示'
