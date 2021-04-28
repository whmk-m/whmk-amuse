import React from "react";
import {Story, Meta} from '@storybook/react/types-6-0';
import Alert, { IBaseAlertProps } from "./index";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas) // 一次性导入所有的图标，接下来就可以使用字符串了
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
  title:'DangerDesc Text1',
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
