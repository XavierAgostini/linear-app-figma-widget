import React from 'react'
import Settings from ".";
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Settings',
  component: Settings,
} as ComponentMeta<typeof Settings>;

export const EmptyState: ComponentStory<typeof Settings> = (args) => (
  <div style={{ width: '400px', margin: '0 auto', border: '1px solid #000' }}>
    <Settings />
  </div>
);

export const FilledState: ComponentStory<typeof Settings> = (args) => {
  const initialize = ()  => {
    setTimeout(() => {
      window.postMessage({ pluginMessage: { type: 'get-linear-token-response', data: { linearToken: 'test' } }}, '*')
      window.postMessage({ pluginMessage: { type: 'get-figma-file-id-response', data: { figmaFileId: '234sdf234243' } }}, '*')
    }, 10)
  }
  initialize()

  return (
    <div style={{ width: '400px', margin: '0 auto', border: '1px solid #000' }}>
      <Settings />
    </div>
  )
}
