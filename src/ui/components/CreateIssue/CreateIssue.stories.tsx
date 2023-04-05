import React from 'react'
import CreateIssue from ".";
import { mockGraphqlResponse } from "../../../../.storybook/mockData"
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'CreateIssue',
  component: CreateIssue,
} as ComponentMeta<typeof CreateIssue>;

export const Primary: ComponentStory<typeof CreateIssue> = () => {
  const initiateLinearToken = ()  => {
    setTimeout(() => {
      window.postMessage({ pluginMessage: { type: 'get-linear-auth-token-response', data: { linearAuthToken: 'test' } }}, '*')
    }, 10)
  }
  initiateLinearToken()
  return (
    <div style={{ width: '440px', height: '480px', overflow: 'scroll', margin: '0 auto', border: '1px solid #000' }}>
      <CreateIssue />
    </div>
  ) 
}

Primary.args = {
}
Primary.parameters = {
  mockData: [
      {
          url: 'https://api.linear.app/graphql',
          method: 'POST',
          status: 200,
          response: mockGraphqlResponse,
          delay: 200
      },
  ],
}