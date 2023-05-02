export type LinearStatusType = 'backlog' | 'unstarted' | 'started' | 'completed' | 'canceled' | 'archived'

export interface LinearIssue {
	id: string;
	identifier: string;
	title: string;
	description: string;
	descriptionData: any;
	priority: number;
	priorityLabel: "High";
	labels: {
		nodes: { name: string; color: string; }[]
	};
	estimate: number | null;
	team: {
		issueEstimationAllowZero: boolean;
		issueEstimationExtended: boolean;
		defaultIssueEstimate: number;
		issueEstimationType: "notUsed" | "exponential" | "linear" | "fibonacci" | "tShirt";
	};
	state: {
		name: string;
		color: string;
        type: LinearStatusType
	}
	url: string;
	assignee: {
		name: string;
		displayName: string;
		id: string;
		avatarUrl: string | null
	}
}

export type WidgetType = 'DEFAULT' | 'CARD'