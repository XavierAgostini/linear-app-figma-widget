import React, { useEffect, useState } from 'react'
import { useLinearAuth } from '../../hooks/useLinearAuth'
import { getLinearIssue } from '../../queries'

interface Props {
  linearIssueSlug: string
}
const ResyncIssue = ({ linearIssueSlug}: Props) => {
  const { isLoading, token, requireLinearOauth } = useLinearAuth()


  const resyncIssue = async ()=> {
    try {
      const updatedLinearIssue = await getLinearIssue(linearIssueSlug, token)
      window.parent.postMessage({ pluginMessage: { type: "resync-linear-auth-issue-response", data: updatedLinearIssue } }, '*');
    } catch (error: any) {
      console.error("error doing 'resyncIssue'", error)
      if (error.message === "AUTHENTICATION_ERROR") {
        requireLinearOauth()
      } else {
        window.parent.postMessage({ pluginMessage: { type: "resync-error", data: {} } }, '*');
      }
    }
  }

  if (isLoading || !token) {
    return (
      <div>Is loading token</div>
    )
  } else {
    resyncIssue()
  }

  return (
    <div>Resyncing issue...</div>
  )
}

export default ResyncIssue