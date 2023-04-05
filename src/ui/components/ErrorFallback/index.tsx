import React from 'react'
import style from './style.module.css'

const ErrorFallback = (_props: any) => {
  const handleClose = () => {
    window.parent.postMessage({ pluginMessage: { type: 'close-plugin', data: {} } }, '*');
  }
  return (
    <div className={style.container}>
      <h2>Oops! Something went wrong.</h2>
      <p>Please close the plugin and try again.</p>
      <button className={style.closeBtn} onClick={handleClose}>
        Close Plugin
      </button>
    </div>
  )
}

export default ErrorFallback;