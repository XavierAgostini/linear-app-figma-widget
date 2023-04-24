import axios from 'axios'

export const query = `
query ($issueId: String!) {
    issue(id: $issueId) {
    id
    identifier
    title
    description
    descriptionData
    priority
    priorityLabel
    estimate
    team {
      issueEstimationAllowZero
      issueEstimationExtended
      defaultIssueEstimate
      issueEstimationType
    }
    attachments {
      nodes {
          id
          url
      }
    }
    labels {
        nodes {
            name
            color
        }
    }
    state {
        id
        name
        color
        type
        position
    }
    url
    assignee {
        name
        displayName
        id
        avatarUrl
    }
    }
}`


export const getLinearIssue = async (issueId: string, token: string) => {
  try {
    const { data } = await axios.post(
      'https://api.linear.app/graphql',
      {
        query,
        variables: {
          issueId: issueId
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
    const { issue } = linearData
    return issue;
  } catch (error: any) {
    console.error("Error doing 'getLinearIssue", error)
    const status = error?.response?.status
    const errorCode = error?.response?.data?.errors[0]?.extensions?.code
    if (status === 400 && errorCode === 'AUTHENTICATION_ERROR') {
      throw new Error("AUTHENTICATION_ERROR")
    }
    throw error;
  }
}