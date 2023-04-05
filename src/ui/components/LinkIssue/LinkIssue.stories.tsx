import React from 'react'
import LinkIssue from ".";
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'LinkIssue',
  component: LinkIssue,
} as ComponentMeta<typeof LinkIssue>;

export const Primary: ComponentStory<typeof LinkIssue> = () => {
  const initiateLinearToken = ()  => {
    setTimeout(() => {
      window.postMessage({ pluginMessage: { type: 'get-linear-auth-token-response', data: { linearAuthToken: 'test' } }}, '*')
    }, 10)
  }
  initiateLinearToken()
  return (
    <div style={{ width: '400px', height: '160px', margin: '0 auto', border: '1px solid #000' }}>
      <LinkIssue />
    </div>
  )
}
