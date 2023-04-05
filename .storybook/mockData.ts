import * as GetLinearTeams from "../src/ui/queries/getLinearTeams";
import * as GetLinearTeamMetadata from "../src/ui/queries/getLinearTeamMetadata";
import * as GetLinearIssue from "../src/ui/queries/getLinearIssue";
import * as CreateLinearIssue from "../src/ui/queries/createLinearIssue"

const mockTeamsData = {
  data: {
    teams: {
      nodes: [
        {
          id: '1',
          name: 'Team 1',
        }, {
          id: '2',
          name: 'Team 2',
        }, {
          id: '3',
          name: 'Team 3',
        }
      ]
    }
  }
}

const mockTeamData = {
  data: {
    team: {
      id: '1',
      name: 'Team 1',
      members: {
        nodes: [
          {
            id: 'member-1',
            name: 'Bob Dole',
            displayName: 'Bob Dole',
            avatarUrl: 'https://avatars.githubusercontent.com/u/1164541?v=4',
          }, {
            id: 'member-2',
            name: 'John Doe',
            displayName: 'John Doe',
            avatarUrl: null,
          }, {
            id: 'member-3',
            name: 'Jane Doe',
            displayName: 'Jane Doe',
            avatarUrl: 'https://avatars.githubusercontent.com/u/1164541?v=4',
          }
        ]
      },
      states: {
        nodes: [
          {
              "name": "In Progress",
              "id": "bb50c2d4-c4f0-4aab-a38c-35f64de3bf93",
              "color": "#f2c94c",
              "type": "started",
              "description": null,
              "position": 2
          },
          {
              "name": "Canceled",
              "id": "84c1a066-8540-47ef-8a68-b9a3729a6cb2",
              "color": "#95a2b3",
              "type": "canceled",
              "description": null,
              "position": 4
          },
          {
              "name": "Done",
              "id": "7b55dabd-de0b-4bb0-ab29-b93e89afedf4",
              "color": "#5e6ad2",
              "type": "completed",
              "description": null,
              "position": 3
          },
          {
              "name": "Todo",
              "id": "21f6624d-ba5e-4da9-be96-bf7a32381acb",
              "color": "#e2e2e2",
              "type": "unstarted",
              "description": null,
              "position": 1
          },
          {
              "name": "Backlog",
              "id": "20bbc485-3bec-4098-804c-794fa9310a18",
              "color": "#bec2c8",
              "type": "backlog",
              "description": null,
              "position": 0
          }
        ]
      },
      labels: {
        "nodes": [
          {
              "color": "#4EA7FC",
              "id": "a62f15d8-9e29-4297-b500-2bc4b65a975c",
              "name": "Improvement"
          },
          {
              "color": "#BB87FC",
              "id": "803a23bb-e07c-40c3-add1-6d327af889bb",
              "name": "Feature"
          },
          {
              "color": "#EB5757",
              "id": "06d334ff-eb3d-45c8-85cc-e65488902fb9",
              "name": "Bug"
          }
      ]
      }
    }
  }
}
const mockCreateIssueData = {
  data: {
    issueCreate: {
      success: true,
      issue: { 
        id: 'asdfasdfasdf234234'
      }
    }
  }
}

export const mockGraphqlResponse = (request: { body: string }) => {
  const { body } = request
  
  const { query } = JSON.parse(body)

  switch (query) {
    case GetLinearTeams.query:
      return mockTeamsData;
    case GetLinearTeamMetadata.query:
      return mockTeamData
    case GetLinearIssue.query:
      return null;
    case CreateLinearIssue.createTicketMutation(false):
      return mockCreateIssueData;
    default:
      return null;
  }
}