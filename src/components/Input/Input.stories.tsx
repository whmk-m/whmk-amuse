import React, {useState} from "react";
import {Story, Meta} from '@storybook/react/types-6-0';
import Input, {IInputProps} from "./index";

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
  onChange: undefined,
  onClean: undefined
}
Default.storyName = 'Default 输入框'

export const PrefixSuffixInput = Template.bind({})
PrefixSuffixInput.args = {
  prefix: (<>http:/1/</>),
  suffix: (<span style={{width: '100px'}}>.com</span>),
  onChange: undefined,
  onClean: undefined
}
PrefixSuffixInput.storyName = 'Prefix Suffix Input'

export const DefaultValueInput = () => {
  return (
    <Input defaultValue={'123'}/>
  )
}
DefaultValueInput.storyName = 'defaultValue Input'

export const ValueInput = () => {
  return (
    <Input value={'写死的value'}/>
  )
}
ValueInput.storyName = 'value Input'

export const ControlInput = () => {
  const [value, setValue] = useState('')
  return (
    <Input
      value={value}
      onChange={(e) => {
        setValue(e.target.value)
      }}
      onClean={() => setValue('')}
    />
  )
}
ControlInput.storyName = 'Control Input'
