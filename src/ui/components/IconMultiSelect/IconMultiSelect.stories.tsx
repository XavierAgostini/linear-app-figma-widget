import React from 'react'
import IconMultiSelect from ".";
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'IconMultiSelect',
  component: IconMultiSelect,
} as ComponentMeta<typeof IconMultiSelect>;

export const Primary: ComponentStory<typeof IconMultiSelect> = (args) => (
  <div style={{ width: '400px', margin: '0 auto', border: '1px solid #000' }}>
    <IconMultiSelect {...args} />
  </div>
);
Primary.args = {
  options: [{
    label: 'Label 1',
    value: 'value-1',
    icon: <div style={{ width: '20px', height: '20px', background: 'red' }} />
  }, {
    label: 'Label 2',
    value: 'value-2',
    icon: <div style={{ width: '20px', height: '20px', background: 'blue' }} />
  }, {
    label: 'Label 3',
    value: 'value-3',
    icon: <div style={{ width: '20px', height: '20px', background: 'green' }} />
  }],
  onChange: () => {},
  defaultValue: undefined
}