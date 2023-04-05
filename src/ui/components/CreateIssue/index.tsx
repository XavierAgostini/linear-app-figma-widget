import React, { useMemo, useState, useEffect } from 'react'
import Select from 'react-select';
import IconSelect, { Option } from "../IconSelect";
import IconMultiSelect from "../IconMultiSelect";
import { useLinearAuth } from '../../hooks/useLinearAuth';
import { getLinearTeams, getLinearTeamMetadata, createLinearIssue } from '../../queries';
import { LinearTeam, LinearTeamMetadata, LinearIssue, WorkflowStates } from '../../types';
import { getLinearUserInitials } from '../../utils';
import { LinearUnassignedIcon } from '../icons';
import classnames from 'classnames'

import style from './style.module.css'

import {
  LinearBacklogIcon,
	LinearInProgressIcon,
	LinearTodoIcon,
	LinearCancelledIcon,
	LinearDoneIcon,
  LinearUrgentPriorityIcon,
  LinearHighPriorityIcon,
  LinearMediumPriorityIcon,
  LinearLowPriorityIcon,
  LinearNoPriorityIcon,
} from '../icons'

const FIGMA_FILE_URL = 'https://www.figma.com/file'


type AssignedUser = {
  label: string;
  value: string;
}

const getLinearStateIconFromStateType = (type: WorkflowStates, color: string) => {
  const LinearStateIconMap = {
    backlog: <LinearBacklogIcon color={color} />,
    unstarted: <LinearTodoIcon color={color} />,
    started: <LinearInProgressIcon color={color} />,
    completed: <LinearDoneIcon color={color} />,
    canceled: <LinearCancelledIcon color={color} />,
  }
  return LinearStateIconMap[type]
}
type FigmaLinkType = "CURRENT_PAGE" | "SELECTED_NODE";
type LinkedFigmaNode = {
  id: string;
  name: string;
  type: string;
}

const CreateIssue = () => {
  const [linearTeams, setLinearTeams] = useState<LinearTeam[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<LinearTeamMetadata | null>(null);
  const [figmaFileId, setFigmaFileId] = useState<string | null>(null);
  const [isTeamInfoLoading, setIsTeamInfoLoading] = useState<boolean>(true);
  const [linkedFigmaNode, setLinkedFigmaNode] = useState<LinkedFigmaNode | null>(null); 
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [assignedUser, setAssignedUser] = useState<AssignedUser | null>(null);
  const [priority, setPriority] = useState<Option | null>(null);
  const [status, setStatus] = useState<Option | null>(null);
  const [labels, setLabels] = useState<AssignedUser[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingTeamMetadata, setLoadingTeamMetadata] = useState<boolean>(false);

  const { isLoading, token, requireLinearOauth } = useLinearAuth()

  const onTeamChange = async (option: any) => {
    try {
      setLoadingTeamMetadata(true)
      const data = await getLinearTeamMetadata(token, option.value)
      setSelectedTeam(data)
    } catch (error: any) {
      console.error("error doing 'onTeamChange'", error)
      if (error.message === "AUTHENTICATION_ERROR") {
        requireLinearOauth()
      }
    } finally {
      setLoadingTeamMetadata(false)
    }
  }
  
  const onFigmaLinkTypeChange = (option: any) => {
    setLinkedFigmaNode(null)
    if (option.value === 'CURRENT_PAGE') {
      window.parent.postMessage({ pluginMessage: { type: 'get-current-page' } }, '*')
    }
  }
  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)
  const onDescriptionChange = (e: React.ChangeEvent<HTMLDivElement>) => setDescription(e?.currentTarget?.textContent || "")


  const TEAM_OPTIONS = useMemo(() => {
    if (!linearTeams) return [];

    return linearTeams.map((team: any) => ({
      label: team.name,
      value: team.id,
    }))
  }, [linearTeams])

  const FIGMA_LINK_OPTIONS = [
    { label: 'Link to Current Page', value: 'CURRENT_PAGE', icon: null },
    { label: 'Link to Selected Element', value: 'SELECTED_NODE', icon: null },
  ]

  const PRIORITY_OPTIONS = [
    { label: 'No Priority', value: 5, icon: LinearNoPriorityIcon },
    { label: 'Low', value: 4, icon: LinearLowPriorityIcon },
    { label: 'Medium', value: 3, icon: LinearMediumPriorityIcon },
    { label: 'High', value: 2, icon: LinearHighPriorityIcon },
    { label: 'Urgent', value: 1, icon: LinearUrgentPriorityIcon },
  ]
  
  const STATUS_OPTIONS = useMemo(() => {
    if (!selectedTeam) return []
  
    return selectedTeam.states.nodes.sort((a,b) => a.position - b.position).map(state => ({
      label: state.name,
      value: state.id,
      icon: getLinearStateIconFromStateType(state.type, state.color)
    }))
  }, [selectedTeam])
  
  const LABEL_OPTIONS = useMemo(() => {
    if (!selectedTeam) return []
  
    return selectedTeam.labels.nodes.map(label => ({
      label: label.name,
      value: label.id,
      icon: <div className={style.labelIcon} style={{backgroundColor: label.color}}/>
    }))

  }, [selectedTeam]);

  const USERS = useMemo(() => {
    if (!selectedTeam) return []
    const unassigned = { label: 'Unassigned', value: 'unassigned', icon: LinearUnassignedIcon }
    const teamMembers = selectedTeam.members.nodes.map(user => ({
      label: user.name,
      value: user.id,
      icon: user.avatarUrl ? <img src={user.avatarUrl} className={style.avatarIcon}/>: <div className={style.avatarIcon}>{getLinearUserInitials(user.displayName)}</div>
    })).concat()
    return [unassigned, ...teamMembers]
  }, [selectedTeam]) 

  const canSubmit = useMemo(() => Boolean(title && description && (!figmaFileId  || (figmaFileId && linkedFigmaNode))), [title, description, linkedFigmaNode, figmaFileId])

  const onSelectLabels = (option: any) => {
    setLabels(prev =>  [...new Set(prev.concat(option))])
  }

  const onSumbit = async (e: any) => {
    try {
      e.preventDefault();
      if (!selectedTeam) return;
      setIsSaving(true)
      const data = await createLinearIssue({
        token,
        teamId: selectedTeam.id,
        title,
        description,
        userId: assignedUser?.value ? assignedUser.value : undefined,
        priorityNumber: priority?.value,
        stateId: status?.value || selectedTeam?.defaultIssueState?.id,
        labelIds: labels.map(label => label.value),
        linkedFigmaURL: figmaFileId ? `${FIGMA_FILE_URL}/${figmaFileId}?node-id=${linkedFigmaNode?.id}` : ''
      })
      window.parent.postMessage({ pluginMessage: { type: "create-linear-issue", data } }, '*');
    } catch (error: any) {
      console.error("Error creating issue: ", error)
      if (error.message === "AUTHENTICATION_ERROR") {
        requireLinearOauth()
      }
      setError("There was an error creating the issue. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const goToPluginSettings = () => {
    window.parent.postMessage({ pluginMessage: { type: "go-to-plugin-settings" } }, '*');
  }

  useEffect(function onWindowMessage () {
    const handleWindowMessage = (event: any) => {
      if (event.data.pluginMessage.type === 'selectionchange') {
        const selectedNode = event.data.pluginMessage.data;
        if (selectedNode?.id) setLinkedFigmaNode(selectedNode);
        else setLinkedFigmaNode(null)
      }
      if (event.data.pluginMessage.type === 'get-figma-file-id-response') {
        const fileId = event.data.pluginMessage.data.figmaFileId;
        console.log('get file id', fileId)
        setFigmaFileId(fileId)
      }
    }
    // get figma file id
    window.parent.postMessage({ pluginMessage: { type: 'get-figma-file-id' } }, '*')
    // initial call to get current page
    window.parent.postMessage({ pluginMessage: { type: 'get-current-page' } }, '*')

    window.addEventListener('message', handleWindowMessage)
    return () => window.removeEventListener('message', handleWindowMessage)
  }, [])

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  async function initializeLinearTeams() {
    try {
      if (!token) return
      const teams = await getLinearTeams(token) || []
      setLinearTeams(teams)
      setIsTeamInfoLoading(false)
    } catch (error: any) {
      if (error.message === "AUTHENTICATION_ERROR") {
        requireLinearOauth()
      }
    }
   
  }
  if (token && isTeamInfoLoading && linearTeams.length === 0) {
    initializeLinearTeams()
  }

  if (!selectedTeam) {
    return (
      <div className={style.container}>
        <div className={style.formGroup}>
          <h3>Linear Team</h3>
          <Select
            onChange={onTeamChange}
            options={TEAM_OPTIONS}
            isDisabled={isLoading || isTeamInfoLoading || loadingTeamMetadata}
          />
        </div>
        { (isLoading || isTeamInfoLoading || loadingTeamMetadata) && <div className={style.loadingMsg}>Loading...</div> }

      </div>
    )
  }

  return (
    <form onSubmit={onSumbit} className={style.container}>
      <div className={style.flexWrapper}>
      <div className={style.formGroup}>
          <input 
            value={title} 
            onChange={onTitleChange} 
            placeholder="Issue title" 
            className={style.titleInput}
          />
        </div>
        <div className={style.formGroup}>
          <div
            contentEditable={!isSaving ? "true" : "false"}
            onInput={onDescriptionChange} 
            placeholder="Add description..." 
            className={style.descriptionInput}
          />
        </div>
      </div>
      <div className={style.formFooter}>
        <div className={style.formGroup}>
          <div className={style.selectOptions}>
            <IconSelect
              isDisabled={isSaving}
              defaultValue={PRIORITY_OPTIONS[0]}
              onChange={setPriority}
              options={PRIORITY_OPTIONS}
            />
            <IconSelect
              isDisabled={isSaving}
              defaultValue={STATUS_OPTIONS[0]}
              onChange={setStatus}
              options={STATUS_OPTIONS}
            />
            <IconSelect
              isDisabled={isSaving}
              defaultValue={USERS[0]}
              onChange={setAssignedUser}
              options={USERS}
            />
          
          </div>

         {figmaFileId && (
            <div className={style.selectOptions}>
              <IconSelect 
                isDisabled={isSaving || !figmaFileId}
                onChange={onFigmaLinkTypeChange}
                defaultValue={FIGMA_LINK_OPTIONS[0]}
                options={FIGMA_LINK_OPTIONS}
              />
              <div 
                className={classnames({
                  [style.figmaLinkOptionValue]: true,
                  [style.isDisabled]: !figmaFileId,
                  [style.emptyValue]: !linkedFigmaNode
                })}
              >
                {linkedFigmaNode ? (
                    <div className={style.figmaElement}><strong>{capitalizeFirstLetter(linkedFigmaNode?.type || "")}:</strong> {linkedFigmaNode?.name}</div>
                  ) : (
                    <div className={style.figmaElClickInfo}>
                      Click on the desired Figma element
                    </div>
                  )
                }
              </div>
            </div>
          )}
          <div className={style.selectOptions}>
          
            <IconMultiSelect
              isDisabled={isSaving}
              defaultValue={[]}
              onChange={onSelectLabels}
              options={LABEL_OPTIONS}
            />
          
          </div>
          {!figmaFileId && (
            <div className={style.figmaFileIdWarning}>
              Add your Figma File URL in the <span className={style.pluginSettingsLink} onClick={goToPluginSettings}>plugin settings</span> to enable Figma linking
            </div>
          )}
        </div>
        {error && (
          <div className={style.error}>
            <svg className={style.errorIcon} focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></svg>
            <span>{error}</span>
          </div>
        ) }
        <button 
          disabled={!canSubmit || isSaving}
          className={style.submitBtn}
          type="submit"
          onClick={onSumbit}
        >
          {isSaving ? 'Creating Issue...' : 'Create Issue'}
        </button>
        
      </div>
    </form>
  )
}

export default CreateIssue;