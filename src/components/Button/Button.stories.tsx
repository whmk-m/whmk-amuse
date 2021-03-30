import React from "react";
import {Story, Meta} from '@storybook/react/types-6-0';
import Button, {ButtonProps} from "./index";


export default {
  title: "whmk-amuse/按钮",
  component: Button,
  argTypes: {
    size: {
      defaultValue: 'md',
      control: {
        type: 'inline-radio',
        options: ['lg', 'md', 'sm'],
      },
    },
    btnType: {
      defaultValue: 'default',
      control: {
        type: 'inline-radio',
        options: ['default', 'primary', 'danger', 'text', 'link'],
      },
    },
    onClick: {
      action: 'clicked'
    }
  },
} as Meta


const Template: Story<ButtonProps> = (props) => <Button {...props}/>

export const Default = Template.bind({})

Default.args = {
  children: 'default',
  /*onClick(e) {
    alert('点击')
  },*/
}

Default.storyName = 'Default 默认配置'

export const Link = Template.bind({})
Link.args = {
  children: '百度一下',
  btnType: "link",
  href: "http://www.baidu.com",
  target: "_blank",
  size: 'md',
  /*onClick(e) {
    e.preventDefault()
    alert('点击')
  },*/
}
Link.storyName = 'Link 链接组件'
