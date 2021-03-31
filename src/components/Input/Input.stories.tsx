import React from "react";
import {Story, Meta} from '@storybook/react/types-6-0';
import Input , { IInputProps } from "./index";

export default {
  title: "whmk-amuse/Input",
  component: Input,
  argTypes: {
    size: {
      control: {
        type: 'inline-radio',
        options: ['lg', 'md', 'sm'],
      },
    },
  },
} as Meta


const Template: Story<IInputProps> = (props) => <Input {...props}/>

export const Default = Template.bind({})
Default.args = {
}
Default.storyName = 'Default 输入框'

