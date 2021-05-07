import React from "react";
import {Story, Meta} from '@storybook/react/types-6-0';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas, faCoffee } from '@fortawesome/free-solid-svg-icons' // 一次性导入Icon
import Icon, {IIconProps} from "./index";
library.add(fas)
export default {
  title: "whmk-amuse/Icon",
  component: Icon,
  argTypes: {
    theme: {
      control: {
        type: 'inline-radio',
        options: ['primary','danger' ,'success' ,'info','warning' ,'secondary'],
      },
    },
    size: {
      control: {
        type: 'inline-radio',
        options: ['lg', 'md', 'sm'],
      },
    },
  },
} as Meta

const Template: Story<IIconProps> = (props) => <Icon {...props}/>


export const StringIcon = Template.bind({})
StringIcon.args = {
  icon:'ambulance'
}
StringIcon.storyName = 'String Icon'

export const ArrayIcon = Template.bind({})
ArrayIcon.args = {
  icon:['fas','angry']
}
ArrayIcon.storyName = 'Array Icon'


export const VariableIcon = Template.bind({})
VariableIcon.args = {
  icon:faCoffee,
  title:'咖啡ICON'
}
VariableIcon.storyName = 'Variable Icon'
