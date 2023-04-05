import React from 'react'
import style from './style.module.css'
import Logo from '../../assets/logo.svg'

const Template = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={style.container}>
      {/* <Logo /> */}
      <img className={style.logo} src={Logo}/>
      
      <div className={style.wrapper}>
        {children}
      </div>
    </div>
  )
}

export default Template;