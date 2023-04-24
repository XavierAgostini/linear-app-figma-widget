export interface LinearTeam {
  id: string;
  name: string;
}

export type WorkflowStates = 'backlog' | 'unstarted' | 'started' | 'completed' | 'canceled'

export interface LinearTeamMetadata {
  id: string;
  name: string;
  members: {
    nodes: {
      id: string;
      name: string;
      displayName: string;
      avatarUrl?: string;
    }[]
  }
  issueEstimationAllowZero: boolean
  issueEstimationExtended: boolean
  defaultIssueEstimate: number
  issueEstimationType: 'notUsed' | 'exponential' | 'linear' | 'fibonacci' | 'tShirt';
  defaultIssueState: {
    id: string;
  }
  states: {
    nodes: {
      name: string;
      id: string;
      color: string;
      type: WorkflowStates;
      position: number;
    }[]
  }
  labels: {
    nodes: {
      color: string;
      id: string;
      name: string;
    }[]
  }
}

export interface LinearIssue {
  id: string;
  identifier: string;
  updatedAt: string;
  title: string;
  description: string;
  descriptionData: string;
  priority: number;
  priorityLabel: string;
  estimate: number | null;
  team: {
    issueEstimationAllowZero: boolean;
    issueEstimationExtended: boolean;
    defaultIssueEstimate: number;
    issueEstimationType: 'notUsed' | 'exponential' | 'linear' | 'fibonacci' | 'tShirt';
  }
  labels: {
    nodes: {
      name: string;
      color: string;
    }[]
  }
  attachments: {
    nodes: {
      id: string;
      url: string;
    }[]
  }
  state: {
    id: string;
    name: string;
    color: string;
    type: string;
    position: number;
  }
  url: string;
  assignee: {
    name: string;
    displayName: string;
    id: string;
    avatarUrl: string;
  } | null
}