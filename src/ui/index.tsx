import React, { useEffect, useState } from "react";
import ResyncIssue from "./components/ResyncIssue";
import CreateIssue from "./components/CreateIssue";
import LinkIssue from "./components/LinkIssue";
import Settings from "./components/Settings";
import ErrorFallback from "./components/ErrorFallback";

import * as Sentry from "@sentry/react";

type AppRoutes = "loading" | "create-issue" | "link-issue" | "resync-issue" | "settings";
const Main = () => {
  const [route, setRoute] = useState<AppRoutes>("loading");
  const [props, setProps] = useState<any>({});
  useEffect(() => {
    const handleWindowMessage = (event: any) => {
      if (event.data.pluginMessage.type === 'route-update') {
        setProps(event.data.pluginMessage.data.props)
        setRoute(event.data.pluginMessage.data.route);
      }
    };

    // Add event listener when component mounts
    window.addEventListener('message', handleWindowMessage);

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener('message', handleWindowMessage);
    };
  }, []);

  switch (route) {
    case "create-issue":
      return <CreateIssue {...props} />;
    case "link-issue":
      return <LinkIssue {...props} />;
    case "resync-issue":
      return <ResyncIssue {...props} />;
    case "settings":
      return <Settings {...props} />;
    case "loading":
      return <div>Loading...</div>;
    default:
      return <div>Something went wrong</div>;
  }
};

export default () => (
  <Sentry.ErrorBoundary fallback={ErrorFallback}>
    <Main />
  </Sentry.ErrorBoundary>
);
