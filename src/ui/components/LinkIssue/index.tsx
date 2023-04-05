import React, {  useState } from 'react'
import { getLinearIssue } from "../../queries"
import classnames from 'classnames'
import style from './style.module.css'
import { useLinearAuth } from '../../hooks/useLinearAuth';

const linear_issue_slug_regex = /^https:\/\/linear.app\/[a-zA-Z0-9-]+\/issue\/([a-zA-Z0-9-]+)/

const LinkIssue = () => {
  const [issueURL, setIssueURL] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { isLoading, token, requireLinearOauth } = useLinearAuth()

  const onChange = (e: any) => {
    setIssueURL(e.target.value)
    setError(null)
  }

  const isValidLinearURL = linear_issue_slug_regex.test(issueURL);

  const onSubmit = async (e: any) => {
    try {
      e.preventDefault()
      setIsSaving(true)
      const linear_issue_match = (issueURL || "").match(linear_issue_slug_regex)
      const issueId = linear_issue_match && linear_issue_match?.length >= 2 ? linear_issue_match[1] : null
      if (!issueId) return;

      const linearIssue = await getLinearIssue(issueId, token)

      window.parent.postMessage({ pluginMessage: { type: "link-linear-issue", data: linearIssue } }, '*');
    } catch (error: any) {
      console.error("error doing 'onSubmit'", error)
      if (error.message === "AUTHENTICATION_ERROR") {
        requireLinearOauth()
      } else {
        setError(error.message)
      }
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div>Please Open your browser to complete oauth flow...</div>
    )
  }
  return (
      <form className={style.container} onSubmit={onSubmit}>
        <div className={style.formGroup}>
          <label htmlFor="">Issue URL</label>
          <input
            value={issueURL}
            onChange={onChange}
            className={classnames({
              [style.input]: true, 
              [style.errorInput]: issueURL.length > 0 && !isValidLinearURL 
            })}
            disabled={isSaving}
            placeholder="https://linear.app/test-project/issue/TEST-123/customize-settings"
          />
          {issueURL.length > 0 && !isValidLinearURL && (
            <div className={style.inputErrorMessage}>
              <svg className={style.errorIcon} focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></svg>
              <span>This is not a valid Linear URL</span>
            </div>
          )}
         
        </div>
        {error && (
          <div className={style.inputErrorMessage}>
            <svg className={style.errorIcon} focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path></svg>
            <span>{error}</span>
          </div>
        )}
        <button
            type='submit'
            className={style.submitBtn}
            disabled={!isValidLinearURL || isSaving}
            onSubmit={onSubmit}
          >
            Link Issue
          </button>
      </form>
  )
}

export default LinkIssue;