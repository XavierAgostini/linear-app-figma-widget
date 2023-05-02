import React, { useEffect, useState, useRef } from 'react'
import { useLinearAuth } from '../../hooks/useLinearAuth'
import classnames from 'classnames'
import style from './style.module.css'

const FIGMA_FILE_REGEX = /https:\/\/www.figma.com\/file\/([a-zA-Z0-9]+)/
const FIGMA_FILE_URL = 'https://www.figma.com/file/'

const Settings = () => {
  const [figmaFileUrl, setFigmaFileUrl] = useState<string>('')
  const [linearTokenExists, setLinearTokenExists] = useState<boolean>(false)
  const [isEditingFigmaFileUrl, setIsEditingFigmaFileUrl] = useState<boolean>(false)

  const currentFileUrlRef = useRef<string>("")

  const isValidFigmaURL = FIGMA_FILE_REGEX.test(figmaFileUrl);
  
  const onFigmaUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => setFigmaFileUrl(e.target.value)

  const skipLinearAuth = true
  const { isLoading, initLinearOauthFlow, clearLinearToken } = useLinearAuth(skipLinearAuth)

  useEffect(() => {
    const handleWindowMessage = (event: any) => {
      if (event?.data?.pluginMessage?.type === 'get-figma-file-id-response') {
        const figmaFileId = event.data.pluginMessage.data.figmaFileId
        const url = `${FIGMA_FILE_URL}${figmaFileId}`
        currentFileUrlRef.current = url
        const isValidURL = FIGMA_FILE_REGEX.test(url);

        if (!figmaFileId || !isValidURL) {
          setIsEditingFigmaFileUrl(true)
          return
        }
       
        setFigmaFileUrl(url)
      }
      if (event?.data?.pluginMessage?.type === 'get-linear-auth-token-response') {
        const token = event.data.pluginMessage.data.linearAuthToken

        if (!token) {
          return
        }
        setLinearTokenExists(true)
      }

      if (event?.data?.pluginMessage?.type === 'store-linear-token-response') {
        setLinearTokenExists(true)
      }
    };

    // get store figma file id
    window.parent.postMessage({ pluginMessage: { type: 'get-figma-file-id', data: {} } }, '*');

    window.parent.postMessage({ pluginMessage: { type: 'get-linear-auth-token', data: {} } }, '*');
    // Add event listener when component mounts
    window.addEventListener('message', handleWindowMessage);

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener('message', handleWindowMessage);
    };
  }, [])

  const onFigmaUrlSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!isValidFigmaURL) return;
    const figmaFileId = figmaFileUrl.match(FIGMA_FILE_REGEX)?.[1]
    window.parent.postMessage({ pluginMessage: { type: 'store-figma-file-id', data: { figmaFileId } }}, '*')
    setIsEditingFigmaFileUrl(false)
  }

  const onClearFigmaUrl = () => {
    window.parent.postMessage({ pluginMessage: { type: 'store-figma-file-id', data: { figmaFileId: "" } }}, '*')
    currentFileUrlRef.current = ""
    setFigmaFileUrl("")
    setIsEditingFigmaFileUrl(true)
  }
  const onEditFigmaUrl = () => setIsEditingFigmaFileUrl(true);

  
  const onRevokeLinearToken = () => {
    clearLinearToken()
    setLinearTokenExists(false)
  }

  const onEnableLinearConnection = () => {
    initLinearOauthFlow()
  }

  const showErrorMessage = !isValidFigmaURL && figmaFileUrl.length > 0;
  const canSave = isValidFigmaURL && figmaFileUrl !== currentFileUrlRef.current;

  return (
    <div className={style.container}>
      <div className={style.settings}>
        <div className={style.setting}>
          <label>Linear API Token</label>
          {linearTokenExists && (
            <div className={style.flexContainer}>
              <div className={style.linearToken}>lin_********</div>
              <button className={style.minimalButton} onClick={onRevokeLinearToken}>Revoke Connection</button>
            </div>
          )}
          {!linearTokenExists && (
            <div className={style.flexContainer}>
              <div className={style.linearToken}>Not Authenticated</div>
              <button
                className={style.minimalButton}
                onClick={onEnableLinearConnection}
                disabled={isLoading}
              >
                {!isLoading ? 'Add Connection' : 'Loading...'}
              </button>
            </div>
          )}
        </div>
        <div className={style.setting}>
          <label>Figma Project URL</label>
          {!isEditingFigmaFileUrl && (
            <div className={style.flexContainer}>
              <div className={style.figmaUrl}>{figmaFileUrl}</div>
              <div  className={style.flexContainer}>
                <button className={style.minimalButton} onClick={onClearFigmaUrl}>Clear</button>
                <button className={style.minimalButton} onClick={onEditFigmaUrl}>Edit</button>
              </div>
            </div>
          )}
          {(isEditingFigmaFileUrl) && (
            <form className={style.figmaUrlForm} onSubmit={onFigmaUrlSubmit}>
              <input
                type="text"
                placeholder='https://www.figma.com/file/FILE_ID'
                className={classnames({
                  [style.input]: true,
                  [style.errorInput]: showErrorMessage
                })}
                value={figmaFileUrl}
                onChange={onFigmaUrlChange} 
              />
              <button type="submit" className={style.submitBtn} disabled={!canSave}>Save</button>
            </form>
          )}
         
          {showErrorMessage && (
            <div className={style.inputErrorMessage}>
              <svg className={style.errorIcon} focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></svg>
              <span>This is not a valid Linear URL</span>
            </div>
            )}
          {(!isValidFigmaURL || isEditingFigmaFileUrl) && (
            <div className={style.note}>
              You can find your Figma project URL by clicking on the <em>Share</em> button in the top right corner of your Figma file, and selecting <em>Copy link</em>
              <span className={style.shareBtn}>Share</span>
            </div>
          )}
           
        </div>
        <div className={style.setting}>
            <label htmlFor="linear-project-slug">About</label>
            <div>Plugin Version: <strong>5</strong></div>
          <div>
            <a href="#" target="_blank">Documentation</a>
          </div>
          <div>
            <a href="https://forms.gle/wN7xSAVM5GLgzxaj9" target="_blank">Contact</a>
          </div>
        </div>
      </div>
     
    </div>
  )
}

export default Settings;