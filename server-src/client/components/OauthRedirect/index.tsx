import React from 'react'
import Template from '../Template'
const OauthRedirect = () => {

  const openFigma = () => window.open("figma://", '_self')
  openFigma()
  return (
    <Template>
      <h1>You're all done!</h1>
      <h3>You can close this window and return to the Figma app to start using the Linear widget</h3>
    </Template>
  )
}

export default OauthRedirect;