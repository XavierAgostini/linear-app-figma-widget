import React from "react";
import Main from '.';
import ReactDOM from 'react-dom'
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: `${import.meta.env.VITE_SENTRY_DSN}`,
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});

ReactDOM.render(<Main />, document.getElementById("root"))