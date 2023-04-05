import React from 'react'
import Select, { components } from 'react-select';
import style from './style.module.css'

type Option = {
  label: string; value: string; icon: React.ReactNode | null;
}
interface Props {
  options: Option[]
  isDisabled: boolean;
  defaultValue: Option | Option[];
  onChange: (option: Option | null) => void
}

const { Option, MultiValue, DropdownIndicator } = components;

const NoDropDownIndicator = (props: any) => null;

const IconValue = (props: any) => {
  return (
  <MultiValue {...props}>
    <div className={style.selectedOption}>
      {props.data.icon}
      <span>{props.data.label}</span>
    </div>
  </MultiValue>
)}
const IconOption = (props: any) => {
  return (
  <Option {...props}>
    <div className={style.option}>
      <span>{props.data.icon}</span>
      <span>{props.data.label}</span>
    </div>
   
  </Option>
)
}
const IconMultiSelect = ({ options, defaultValue,isDisabled,  onChange }: Props) => {
  return (
    <Select
      menuPlacement="top"
      className="react-multi-select-container"
      classNamePrefix="react-multi-select"
      placeholder="+  Add label"
      defaultValue={defaultValue}
      isMulti={true}
      options={options}
      isDisabled={isDisabled}
      // @ts-ignore
      onChange={onChange}
      components={{ Option: IconOption, MultiValue: IconValue, DropdownIndicator: NoDropDownIndicator }}
    />
  )
}
export default IconMultiSelect