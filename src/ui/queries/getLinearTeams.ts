import axios from 'axios'
import { LinearTeam } from '../types'

export const query = `
query {
  teams {
    nodes {
        id
        name
    }
  }
}`

export const getLinearTeams = async (token: string): Promise<LinearTeam[]> => {
  try {
    const { data } = await axios.post(
      'https://api.linear.app/graphql',
      {
        query,
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
    return linearData.teams.nodes;
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