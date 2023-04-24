import axios from 'axios';
import { v4 } from 'uuid';

const uuidv4 = v4;

const createAttachmentMutation = `
attachmentLinkURL( 
  issueId: $issueId,
  title: "Figma",
  url: $linkedFigmaURL
) {
    lastSyncId

}
`
export const createTicketMutation = (includeAttachment: boolean) => `
mutation ($issueId: String!, $title: String!, $description: String!, $estimate: Int, $teamId: String!,$userId: String, $priorityNumber: Int, ${includeAttachment ?  '$linkedFigmaURL: String!,': ''} $stateId: String!, $labelIds: [String!]) {
  issueCreate(
    input: {
      id: $issueId
      title: $title
      description: $description
      estimate: $estimate
      teamId: $teamId
      assigneeId: $userId
      priority: $priorityNumber
      stateId: $stateId
      labelIds: $labelIds
    }
  ) {
    success
      issue {
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
        labels {
            nodes {
                name
                color
            }
        }
        state {
            name
            color
        }
        url
        assignee {
            name
            displayName
            id
            avatarUrl
        }
        attachments {
          nodes {
              id
              url
          }
        }
      }
    }
  ${includeAttachment ? createAttachmentMutation : "" } 
}`

interface CreateTicketInput {
  token: string;
  teamId: string;
  title: string;
  description: string;
  estimate?: number;
  userId?: string;
  priorityNumber?: string;
  stateId?: string;
  labelIds?: string[];
  linkedFigmaURL: string;
}
export const createLinearIssue = async (input: CreateTicketInput) => {
  try {
    const { token, teamId, title, description, estimate, userId, priorityNumber, stateId, labelIds, linkedFigmaURL } = input

    const issueId = uuidv4();
    const includeAttachment = Boolean(linkedFigmaURL);

    const query = createTicketMutation(includeAttachment)
    const { data } = await axios.post(
      'https://api.linear.app/graphql',
      {
        query,
        variables: {
          issueId,
          teamId,
          title,
          description,
          estimate,
          userId,
          priorityNumber,
          stateId,
          labelIds,
          linkedFigmaURL
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
    const { success, issue}  = linearData?.issueCreate
    if (!success) {
      throw new Error("Error creating issue")
    }
    return {
      ...issue,
      attachments: {
        nodes: [
          {
            id: '',
            url: linkedFigmaURL
          }
        ]
      }
    };
  } catch (error: any) {
    console.error("Error doing 'createLinearIssue", error)
    const status = error?.response?.status
    const errorCode = error?.response?.data?.errors[0]?.extensions?.code
    if (status === 400 && errorCode === 'AUTHENTICATION_ERROR') {
      throw new Error("AUTHENTICATION_ERROR")
    }
    throw error;
  }
}