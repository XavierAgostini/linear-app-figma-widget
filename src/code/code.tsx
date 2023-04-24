const { widget } = figma
const { AutoLayout, Fragment, SVG, Text, Line, usePropertyMenu, useSyncedState, useEffect, waitForTask, useWidgetId } = widget
import { prosemirrorToWidgetReact } from './helpers'
import { AssignedUser } from './components/AssignedUser'
import { IssueEstimate } from './components/IssueEstimate'
import { Labels } from './components/Labels'


import {
	LinearLogoSVG,
	CreateIssueSVG,
	LinkIssueSVG,
	LinearBacklogIcon,
	LinearInProgressIcon,
	LinearTodoIcon,
	LinearCancelledIcon,
	LinearDoneIcon,
	LinearHighPriorityIcon,
	LinearMediumPriorityIcon,
	LinearLowPriorityIcon,
	LinearUrgentPriorityIcon,
	LinearNoPriorityIcon,
	KeyboarArrowUpIcon,
	KeyboardArrowDownIcon,
	ResyncIcon,
} from './components/icons'

import { LinearIssue, WidgetType } from './types'

function LinearAppWidget() {
	const widgetNodeId = useWidgetId()
	const [linearIssue, setLinearIssue] = useSyncedState<LinearIssue | null>('linearIssue', null);
	const [widgetType, setWidgetType] = useSyncedState<WidgetType>("widgetType", "DEFAULT")
	const [cardMinimized, setCardMinimized] = useSyncedState<boolean>('cardMinimized', false)
	const [lastSynced, setLastSynced] = useSyncedState<string>('lastSynced', "")

	const storeLinearAuthToken = (token: string) => {
		waitForTask(new Promise(resolve => {
			setTimeout(async () => {
				await figma.clientStorage.setAsync('linear-auth-token', token)
				figma.closePlugin()
				resolve(null)
			}, 0)
		}));
	}

	const getLinearAuthToken = () => {
		waitForTask(new Promise(_resolve => {
			setTimeout(async () => {
				const linearAuthToken = await figma.clientStorage.getAsync('linear-auth-token')
				figma.ui.postMessage({ type: 'get-linear-auth-token-response', data: { linearAuthToken } }, { origin: '*' })
			}, 0)
		}))
	}

	const storeFigmaFileId = (token: string) => {
		waitForTask(new Promise(resolve => {
			setTimeout(async () => {
				await figma.clientStorage.setAsync('figma-file-id', token)
				resolve(null)
			}, 0)
		}));
	}

	const getFigmaFileId = () => {
		waitForTask(new Promise(_resolve => {
			setTimeout(async () => {
				const figmaFileId = await figma.clientStorage.getAsync('figma-file-id')
				figma.ui.postMessage({ type: 'get-figma-file-id-response', data: { figmaFileId } }, { origin: '*' })
			}, 0)
		}))
	}
	
	
	const onCreateIssue = () => {
		openPluginUI({ routeName: 'create-issue', props: {}, options: { visible: true, width: 440, height: 480, title: "Create Issue" }})
	}

	const createLinkedLinearWidget = ({type, data } : {type: string; data: LinearIssue}) => {
		try {
			const widgetNode = figma.getNodeById(widgetNodeId) as WidgetNode;
			if (!widgetNode) return;
			// check if linked issue already exists
			
			const issueSlug = data.identifier

			const widgetId = widgetNode.widgetId
			const allWidgetNodes: WidgetNode[] = (figma.currentPage.findAll(node => {
				return node?.type === "WIDGET"
			})) as WidgetNode[]

			const myWidgetNodes: WidgetNode[] = allWidgetNodes.filter(node => {
				return node?.widgetId === widgetId
			})

			const preExistingLinearIssueWidget = myWidgetNodes.find(node =>  node?.widgetSyncedState?.linearIssue?.identifier === issueSlug)
			
			if (preExistingLinearIssueWidget) {
				figma.notify(`Linked issue already exists!`)
				figma.viewport.scrollAndZoomIntoView([preExistingLinearIssueWidget])
				figma.closePlugin();
				return
			}

			const clonedNode = widgetNode.cloneWidget({
				'linearIssue': data,
				'lastSynced': (new Date()).toUTCString(),
				'widgetType': 'CARD',
			}, {})
	
			clonedNode.x = widgetNode.x + widgetNode?.width + Math.floor(Math.random() * 150);
			clonedNode.y = widgetNode.y + Math.floor(Math.random() * 150);

			const linkMessage = type === 'link-linear-issue' ? 'Linear issues linked!' : 'Linear issue created!'
			figma.notify(linkMessage)
			figma.closePlugin();
		} catch (error) {
			console.error("Error doing 'createLinkedLinearWidget'",error)
		}
	}

	useEffect(() => {
		figma.on('selectionchange', () => {
			if (figma.ui.show) {
				const selectedNode = figma.currentPage.selection[0]
				// figma.ui.postMessage({ type: 'store-linear-token-response', data: {}}, { origin: '*' })

				figma.ui.postMessage({ type: 'selectionchange', data: { id: selectedNode?.id, type: selectedNode?.type, name: selectedNode?.name } }, { origin: '*' })
			}
		})
		figma.ui.onmessage = (msg) => {
			if (msg.type === 'get-linear-auth-token') {
				getLinearAuthToken()
			}
			if (msg.type === 'get-current-page') {
				const currentPage = figma.currentPage
				figma.ui.postMessage({ type: 'selectionchange', data: { id: currentPage.id, type: currentPage.type, name: currentPage.name } }, { origin: '*' })
			}
			if (msg.type === 'go-to-plugin-settings') {
				openPluginUI({ routeName: 'settings', props: {}, options: { visible: true, width: 400, height: 400, title: "Settings" } })
				if (msg?.data?.type === 'authorize') {
					figma.clientStorage.setAsync('linear-auth-token', null)
					figma.notify("Linear API Token required")
				}
			}
			if (msg.type === 'link-linear-issue' || msg.type === 'create-linear-issue') {
				createLinkedLinearWidget(msg)
			}
			if (msg.type === 'close-plugin') {
				figma.closePlugin();
			}
			if (msg.type === 'resync-linear-auth-issue-response') {
				setLinearIssue(msg.data)
				setLastSynced((new Date()).toUTCString())
				figma.notify('Linear issue resynced!')
				figma.closePlugin();
			}
			if (msg.type === 'revoke-linear-token') {
				figma.clientStorage.setAsync('linear-auth-token', null)
				figma.notify("Linear API Token revoked")
			}
			if (msg.type === 'store-linear-token') {
				storeLinearAuthToken(msg.token)
				figma.ui.postMessage({ type: 'store-linear-token-response', data: {}}, { origin: '*' })
				figma.notify("Successfully authorized Linear API Token!")
			}
			if (msg.type === 'get-figma-file-id') {
				getFigmaFileId()
			}
			if (msg.type === 'store-figma-file-id') {
				const fileId = msg.data.figmaFileId
				storeFigmaFileId(fileId)
				if (!fileId) {
					figma.notify('Figma File URL cleared!')
				} else {
					figma.notify('Figma File URL saved!')

				}
			}
			if (msg.type === 'resync-error') {
				figma.notify('Unable to resync at this time, please try again.')
				figma.closePlugin()
			}
		};
	});

	const openURL = (url: string) => {
		waitForTask(new Promise(resolve => {
			const openLinkUIString = `<script>window.open('${url}','_blank');</script>`
			figma.showUI(openLinkUIString, { visible: false})
			setTimeout(() => {
				resolve(null)
			}, 1000)
		}));
	}
	const openLinearTicketURL = () => {
		waitForTask(new Promise(resolve => {
			const openLinkUIString = `<script>window.open('${linearIssue?.url}','_blank');</script>`
			figma.showUI(openLinkUIString, { visible: false})
			setTimeout(() => {
				resolve(null)
			}, 1000)
		}));
	}

	const onLinkIssue = () => {
		openPluginUI({ routeName: 'link-issue', props: {}, options: { visible: true, width: 440, height: 175, title: "Link Issue" }})
	}

	const getLinearStatusIcon = (state: LinearIssue['state']) => {
		const { type, color } = state;

		switch (type) {
			case 'backlog':
				return LinearBacklogIcon(color)
			case 'unstarted':
				return LinearTodoIcon(color)
			case 'started':
				return LinearInProgressIcon(color)
			case 'completed':
				return LinearDoneIcon(color)
			case 'cancelled':
				return LinearCancelledIcon(color)
			default:
				return LinearBacklogIcon(color)
		}
	}

	const toggleCard = () => setCardMinimized(prev => !prev)

	const openPluginUI = (input: { routeName: string, props: any, options: { visible: boolean; width: number; height: number; title: string } }) => {
		const { routeName, props, options } = input
		waitForTask(new Promise(_resolve => {
			figma.showUI(`${__uiFiles__['main']}`, options)
			figma.ui.postMessage({type:'route-update', data: { route: routeName, props }}, { origin: '*' })
		}));
	}

	const onResync = () => {
		openPluginUI({ routeName: 'resync-issue', props: { linearIssueSlug: linearIssue?.identifier }, options: { visible: false, width: 400, height: 100, title: "Resync Issue" } })
	}

	const getLinearPriorityIcon = (priorityLabel) => {
		switch (priorityLabel) {
			case 'High':
				return LinearHighPriorityIcon
			case 'Medium':
				return LinearMediumPriorityIcon
			case 'Low':
				return LinearLowPriorityIcon
			case 'Urgent':
				return LinearUrgentPriorityIcon
			case 'No Priority':
				return LinearNoPriorityIcon
			default:
				return LinearNoPriorityIcon
		}
	}

	const minimizedName = cardMinimized && linearIssue?.title?.length > 85 ? `${linearIssue?.title.slice(0, 85)}...` : linearIssue?.title
	
	usePropertyMenu(
    [
      {
        tooltip: 'Settings',
        propertyName: 'settings',
        itemType: 'action',
      },
    ],
    (e) => {
			if (e.propertyName === 'settings') {
				openPluginUI({ routeName: 'settings', props: {}, options: { visible: true, width: 400, height: 400, title: "Settings" } })
			}
    },
  )

	if (widgetType === 'CARD') {
		return (
			<AutoLayout
				direction="vertical"
				fill="#F4F5F8"
				cornerRadius={8}
				width={512}
				effect={{
					type: 'drop-shadow',
					color: { r: 0, g: 0, b: 0, a: 0.2 },
					offset: { x: 0, y: 0 },
					blur: 2,
					spread: 2,
				}}
			>
				<AutoLayout
					verticalAlignItems="center"
					horizontalAlignItems="center"
					cornerRadius={{ topLeft: 8, topRight: 0, bottomLeft: 0, bottomRight: 0 }}
					padding={{ left: 8, right: 8, top: 8, bottom: 8 }}
					height={60}
					width="fill-parent"
					fill="#5E6AD2"
				>
					<SVG src={LinearLogoSVG} />
				</AutoLayout>

				<AutoLayout
					direction="vertical"
					verticalAlignItems="center"
					width="fill-parent"
				>
					<AutoLayout
						width="fill-parent"
						direction='vertical'
						verticalAlignItems="center"
						horizontalAlignItems="start"
						spacing="auto"
						padding={{ left: 24, right: 24, top: 16, bottom: 16 }}
					>
						<AutoLayout
							width="fill-parent"
							verticalAlignItems="center"
							spacing="auto"
						>
							<AutoLayout
								width="fill-parent"
								verticalAlignItems="center"
								spacing={8}
							>
								<SVG src={getLinearPriorityIcon(linearIssue?.priorityLabel)} />
								<Text
									fontWeight="bold"
									fontSize={24}
									onClick={openLinearTicketURL}
									hoverStyle={{
										fill: "#2161dc"
									}}
								>
									{linearIssue?.identifier}
								</Text>
								<SVG src={getLinearStatusIcon(linearIssue?.state)} />

							</AutoLayout>
							<SVG
								src={cardMinimized ? KeyboarArrowUpIcon : KeyboardArrowDownIcon}
								onClick={toggleCard}
								hoverStyle={{
									fill: { r: 0, g: 0, b: 0, a: 0.1 },
								}}
							/>
						</AutoLayout>
						<Text
							fontSize={24}
							fontWeight="bold"
							width="fill-parent"
							verticalAlignText="top"
							{...(cardMinimized ? { onClick: toggleCard } : {})}
						>
							{minimizedName}
						</Text>

					</AutoLayout>

					{!cardMinimized && (
						<AutoLayout
							direction="vertical"
							spacing={8}
							padding={{ left: 24, right: 24 }}
							width="fill-parent"
						>
							<Fragment>
								<Line stroke="#E5E5E5" strokeWidth={1} length='fill-parent' />
								<AutoLayout
									direction="vertical"
									padding={{ left: 0, right: 0, top: 16, bottom: 16 }}
									width="fill-parent"
									spacing={12}
								>
									<AutoLayout
										spacing={4}
									>
										<Text
											fill="#6b6f76"
											width={120}
										>
											Assignee:
										</Text>
										<AssignedUser user={linearIssue?.assignee} />
									</AutoLayout>
									<AutoLayout
										spacing={4}
									>
										<Text
											fill="#6b6f76"
											width={120}
										>
											Status:
										</Text>
										<AutoLayout
											verticalAlignItems="center"
											spacing={8}
										>
											<SVG src={getLinearStatusIcon(linearIssue?.state)} />
											<Text>In Progress</Text>
										</AutoLayout>
									</AutoLayout>
									<IssueEstimate
										estimate={linearIssue?.estimate}
										type={linearIssue?.team?.issueEstimationType}
									/>
									<AutoLayout
										spacing={4}
									>
										<Text
											fill="#6b6f76"
											width={120}
										>
											Priority:
										</Text>
										<AutoLayout
											verticalAlignItems="center"
											spacing={8}
										>
											<SVG src={getLinearPriorityIcon(linearIssue?.priorityLabel)} />
											<Text>{linearIssue.priorityLabel}</Text>
										</AutoLayout>
									</AutoLayout>
									<AutoLayout
										spacing={4}
										width="fill-parent"
									>
										<Text
											fill="#6b6f76"
											width={120}
										>
											Labels:
										</Text>
										<Labels labels={linearIssue?.labels} />
									</AutoLayout>
									<AutoLayout
										direction="vertical"
										spacing={8}
										width={"fill-parent"}
									>
										<Text fill="#6b6f76">Description:</Text>

										{prosemirrorToWidgetReact(linearIssue, openLinearTicketURL, openURL)}
									</AutoLayout>
								</AutoLayout>
							</Fragment>
							<Line stroke="#E5E5E5" strokeWidth={1} length='fill-parent' />
							<AutoLayout
									width="fill-parent"
									padding={{ left: 0, right: 0, top: 16, bottom: 16 }}
									spacing='auto'
								>
									<AutoLayout
										direction="vertical"
										verticalAlignItems="center"
										horizontalAlignItems="start"
										spacing={4}
									>
										<Text fill="#6b6f76">Last Synced:</Text>
										<Text>{lastSynced}</Text>
									</AutoLayout>
									<AutoLayout
										fill="#e5e5e5"
										horizontalAlignItems="center"
										verticalAlignItems="center"
										spacing={8}
										onClick={onResync}
										width={120}
										padding={{ left: 8, right: 8, top: 4, bottom: 4 }}
										cornerRadius={8}
										hoverStyle={{
											fill: { r: 0, g: 0, b: 0, a: 0.2 },
										}}
									>
										<SVG src={ResyncIcon} />
										<Text fontWeight="bold" onClick={onResync}>Resync</Text>
									</AutoLayout>
								</AutoLayout>
						</AutoLayout>
					)}
				</AutoLayout>
			</AutoLayout>
		)
	}
	return (
		<AutoLayout
			direction="vertical"
			fill="#F4F5F8"
			cornerRadius={8}
			width={250}
			effect={{
				type: 'drop-shadow',
				color: { r: 0, g: 0, b: 0, a: 0.2 },
				offset: { x: 0, y: 0 },
				blur: 2,
				spread: 2,
			}}
		>
			<AutoLayout
				verticalAlignItems="center"
				horizontalAlignItems="center"
				cornerRadius={{ topLeft: 8, topRight: 0, bottomLeft: 0, bottomRight: 0 }}
				padding={{ left: 8, right: 8, top: 8, bottom: 8 }}
				height={60}
				width="fill-parent"
				fill="#5E6AD2"
			>
				<SVG src={LinearLogoSVG} />
			</AutoLayout>
			<AutoLayout
				direction="vertical"
				verticalAlignItems="center"
				horizontalAlignItems="center"
				width="fill-parent"
			>
				<AutoLayout
					width="fill-parent"
					hoverStyle={{
						fill: { r: 0, g: 0, b: 0, a: 0.1 },
					}}
					spacing={8}
					padding={{ left: 16, right: 16, top: 16, bottom: 16 }}
					onClick={onCreateIssue}
				>
					<AutoLayout width={24}>
						<SVG src={CreateIssueSVG} />
					</AutoLayout>
					<Text>Create Issue in Linear</Text>
				</AutoLayout>
				<AutoLayout
					width="fill-parent"
					padding={{ left: 16, right: 16, top: 16, bottom: 16 }}
					spacing={8}
					hoverStyle={{
						fill: { r: 0, g: 0, b: 0, a: 0.1 },
					}}
					onClick={onLinkIssue}
			>
					<AutoLayout width={24}>
						<SVG src={LinkIssueSVG} />
					</AutoLayout>
					<Text>Link Issue from Linear</Text>
				</AutoLayout>

			</AutoLayout>
		</AutoLayout>
	);
}

widget.register(LinearAppWidget)
