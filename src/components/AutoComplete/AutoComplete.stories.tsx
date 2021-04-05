import React, {useState} from "react";
import {Story, Meta} from '@storybook/react/types-6-0';
import AutoComplete, {IAutoCompleteProps,IOption} from "./index";
import Input from "../Input";


export default {
  title: "whmk-amuse/AutoComplete",
  component: AutoComplete,
  argTypes: {},
} as Meta

const mockOption = (str: string, repeat: number = 1) => ({
  value: str.repeat(repeat),
  label: str.repeat(repeat)
});

const Template: Story<IAutoCompleteProps> = (props,Input) => <AutoComplete {...props}/>

export const DefaultAutoComplete = () => {
  const [value,setValue] = useState('')
  const [options,setOptions] = useState<Array<IOption>>([])

  const handleChange = (searchText:string) => {
    setValue(searchText)
  }

  const handleSearch = (searchText:string) => {
    setOptions(
      !searchText ? [] : [mockOption(searchText), mockOption(searchText, 2), mockOption(searchText, 3)],
    );
  }

  const handleSelect = (searchText:string,option:IOption) => {
    console.log('onSelect',searchText,option)
  }

  return (
    <AutoComplete
      options={options}
      onChange={handleChange}
      onSearch={handleSearch}
      value={value}
      onSelect={handleSelect}
    />
  )
}
DefaultAutoComplete.storyName = '默认的 AutoComplete'

