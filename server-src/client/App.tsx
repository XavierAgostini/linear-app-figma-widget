import React from 'react'
import { Routes, Route, Outlet, Link } from "react-router-dom";
import Home from "./components/Home";
import Page404 from "./components/Page404";
import OauthRedirect from "./components/OauthRedirect"
import InvalidOauth from "./components/InvalidOauth"

const App = () => {
  return (
    <div className='app'>
    <Routes>
      <Route path="/">
        <Route index element={<Home />} />
        <Route path="/oauth/redirect" element={<OauthRedirect />} />
        <Route path="/oauth/invalid" element={<InvalidOauth />} />
        <Route path="*" element={<Page404 />} />
      </Route>
    </Routes>
    </div>
  )
}

export default App;