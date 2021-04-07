import React, {useState} from "react";
import {Story, Meta} from '@storybook/react/types-6-0';
import AutoComplete, {IAutoCompleteProps, IOption} from "./index";
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

const Template: Story<IAutoCompleteProps> = (props, Input) => <AutoComplete {...props}/>

export const DefaultAutoComplete = () => {
  const [value, setValue] = useState('')
  const [options, setOptions] = useState<Array<IOption>>([])

  const handleChange = (searchText: string) => {
    console.log('onChange', searchText)
    setValue(searchText)
  }

  const handleSearch = (searchText: string) => {
    console.log('onSearch', searchText)
    setOptions(
      !searchText ? [] : [mockOption(searchText), mockOption(searchText, 2), mockOption(searchText, 3)],
    );
  }

  const handleSelect = (searchText: string, option: IOption) => {
    console.log('onSelect', searchText, option)
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


export const FilterOptionAutoComplete = () => {
  const [value, setValue] = useState('')
  const [options, setOptions] = useState<Array<IOption>>([
    mockOption('Zhang San'),
    mockOption('Li Si'),
    mockOption('Wang Wu'),
    mockOption('Zhao Si'),
    mockOption('Wang Xi Zhi'),
  ])

  const handleChange = (searchText: string) => {
    console.log('onChange', searchText)
    setValue(searchText)
  }

  const handleSearch = (searchText: string) => {
    console.log('onSearch', searchText)
    setOptions(
      !searchText ? [] : [mockOption(searchText), mockOption(searchText, 2), mockOption(searchText, 3)],
    );
  }

  const handleSelect = (searchText: string, option: IOption) => {
    console.log('onSelect', searchText, option)
  }

  const filterOption = function (value: string, option: IOption): boolean {
    return !value.startsWith('Wang')
  }

  return (
    <AutoComplete
      options={options}
      onChange={handleChange}
      onSearch={handleSearch}
      value={value}
      onSelect={handleSelect}
      filterOption={filterOption}
    />
  )
}
FilterOptionAutoComplete.storyName = 'filterOption AutoComplete'


export const RenderOptionAutoComplete = () => {
  const [value, setValue] = useState('')
  const [options, setOptions] = useState<Array<IOption>>([
    mockOption('Zhang San'),
    mockOption('Li Si'),
    mockOption('Wang Wu'),
    mockOption('Zhao Si'),
    mockOption('Wang Xi Zhi'),
  ])

  const handleChange = (searchText: string) => {
    console.log('onChange', searchText)
    setValue(searchText)
  }

  const handleSearch = (searchText: string) => {
    console.log('onSearch', searchText)
    setOptions(
      !searchText ? [] : [mockOption(searchText), mockOption(searchText, 2), mockOption(searchText, 3)],
    );
  }

  const handleSelect = (searchText: string, option: IOption) => {
    console.log('onSelect', searchText, option)
    setValue(searchText)
  }

  const renderOption = (option: IOption, index: number): React.ReactElement => {
    return (
      <h4
        className={`custom-option-${index}`}
        onClick={() => handleSelect(option.value, option)}
      >
        {option.label}
      </h4>
    )
  }

  return (
    <AutoComplete
      options={options}
      onChange={handleChange}
      onSearch={handleSearch}
      value={value}
      renderOption={renderOption}
    />
  )
}
RenderOptionAutoComplete.storyName = 'renderOption AutoComplete'


export const DebounceAutoComplete = () => {
  const [value, setValue] = useState('')
  const [options, setOptions] = useState<Array<IOption>>([])

  const handleChange = (searchText: string) => {
    console.log('onChange', searchText)
    setValue(searchText)
  }

  const handleSearch = (searchText: string) => {
    console.log('onSearch', searchText)
    setOptions(
      !searchText ? [] : [mockOption(searchText), mockOption(searchText, 2), mockOption(searchText, 3)],
    );
  }

  return (
    <AutoComplete
      options={options}
      onChange={handleChange}
      onSearch={handleSearch}
      value={value}
      wait={500}
    />
  )
}
DebounceAutoComplete.storyName = 'Debounce AutoComplete'
