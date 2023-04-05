import axios from 'axios'
import { LinearTeamMetadata } from '../types';
export const query = `
query ($teamId: String!) {
  team (id: $teamId) {
      id
      name
      members {
          nodes {
              id
              name
              displayName
          }
      }
      defaultIssueState {
        id
      }
      states {
          nodes {
              name
              id
              color
              type
              description
              position
          }
      }
      labels {
          nodes {
              color
              id
              name
          }
      }
  }
}`

export const getLinearTeamMetadata= async (token: string, teamId: string): Promise<LinearTeamMetadata> => {
  try {
    const { data } = await axios.post(
      'https://api.linear.app/graphql',
      {
        query,
        variables: {
          teamId
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    )
    const { data: linearData, errors } = data;
    if (errors) {
      let errorMsg = errors[0]?.extensions?.userPresentableMessage
      throw new Error(errorMsg)
    }
    return linearData.team;
  } catch (error: any) {
    console.error("Error doing 'getLinearTeams", error)
    const status = error?.response?.status
    const errorCode = error?.response?.data?.errors[0]?.extensions?.code
    if (status === 400 && errorCode === 'AUTHENTICATION_ERROR') {
      throw new Error("AUTHENTICATION_ERROR")
    }
    throw error;
  }
}



