const { widget } = figma
const { AutoLayout, SVG, Text} = widget
import { LinearUnassignedUserIcon } from './icons'
import { LinearIssue } from '../types'

export function AssignedUser({ user }: { user: LinearIssue['assignee'] }) {
	// pulled from linear react app
	const getLinearUserInitials = (displayName: string) => {
		const t = displayName.includes("@") ? displayName.split("@")[0].replace(/\./, " ") : displayName
			, n = t.match(/\S+/g) || [];
		return n.length > 1 ? `${n[0][0]}${n[n.length - 1][0]}`.toUpperCase() : t.slice(0, 2).toUpperCase()
	}
	const displayName = !user ? 'Unassigned' : user?.displayName.length < 26 ? user?.displayName : `${user?.displayName.slice(0, 26)}...`
	return (
		<AutoLayout
			verticalAlignItems="center"
			horizontalAlignItems="center"
			spacing={8}
		>
			{!user && <SVG src={LinearUnassignedUserIcon} />}
			{user && (user?.avatarUrl ? <SVG src={user?.avatarUrl} /> : <AutoLayout verticalAlignItems="center" horizontalAlignItems="center" width={14} height={14} cornerRadius={7} fill="#d95753"><Text fontFamily='Inter' fill="#fff" fontSize={8}>{getLinearUserInitials(user?.name)}</Text></AutoLayout>)}
			<Text>{displayName}</Text>
		</AutoLayout>
	)
}