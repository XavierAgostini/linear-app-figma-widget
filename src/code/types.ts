export type LinearStatusType = 'backlog' | 'unstarted' | 'started' | 'completed' | 'cancelled' | 'archived'

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