import React from 'react'
import Select, { components } from 'react-select';
import style from './style.module.css'

export type Option = {
  label: string; value: any; icon:  JSX.Element | null;
}
interface Props {
  options: Option[]
  defaultValue?: Option;
  isDisabled: boolean;
  onChange: (option: Option | null) => void
}

const { Option, SingleValue, DropdownIndicator } = components;

const NoDropDownIndicator = (props: any) => null;

const IconValue = (props: any) => (
  <SingleValue {...props}>
    <div className={style.selectedOption}>
      {props.data.icon}
      <span className={style.optionLabel}>{props.data.label}</span>
    </div>
  </SingleValue>
)
const IconOption = (props: any) => {
  return (
  <Option {...props}>
    <div className={style.option}>
      {props.data.icon}
      <span className={style.optionLabel}>{props.data.label}</span>
    </div>
   
  </Option>
)
}
const IconSelect = ({ options, defaultValue, isDisabled, onChange }: Props) => {
  return (
    <Select
      menuPlacement="top"
      className="react-select-container"
      classNamePrefix="react-select"
      defaultValue={defaultValue}
      isDisabled={isDisabled}
      options={options}
      onChange={onChange}
      components={{ Option: IconOption, SingleValue: IconValue, DropdownIndicator: NoDropDownIndicator }}
    />
  )
}
export default IconSelect