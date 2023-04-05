import React from 'react'
import IconSelect from ".";
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'IconSelect',
  component: IconSelect,
} as ComponentMeta<typeof IconSelect>;

export const Primary: ComponentStory<typeof IconSelect> = (args) => (
  <div style={{ width: '400px', margin: '0 auto', border: '1px solid #000' }}>
    <IconSelect {...args} />
  </div>
);

Primary.args = {
  options: [{
    label: 'Option 1',
    value: 'value-1',
    icon: <div style={{ width: '20px', height: '20px', background: 'red' }} />
  }, {
    label: 'Option 2',
    value: 'value-2',
    icon: <div style={{ width: '20px', height: '20px', background: 'blue' }} />
  }, {
    label: 'Option 3',
    value: 'value-3',
    icon: <div style={{ width: '20px', height: '20px', background: 'green' }} />
  }],
}