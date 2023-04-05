import { useState, useEffect, useRef } from 'react';
import { revokeLinearToken } from '../queries/revokeLinearToken'

const LINEAR_CLIENT_ID = import.meta.env.VITE_LINEAR_CLIENT_ID
const LINEAR_REDIRECT_URI = import.meta.env.VITE_LINEAR_REDIRECT_URI
const WS_AUTH_SERVER_URL = import.meta.env.VITE_WS_AUTH_SERVER_URL

/**
 * 
 * @param skipLinearAuth - if true, it will not require the user to authorize the plugin to use Linear
 * @returns 
 */
export const useLinearAuth = (skipLinearAuth = false) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const token = useRef<string>("")
  const socketId = useRef<string>("")

  const initLinearOauthFlow = async () => {
    setIsLoading(true)
    const linearOauthURL = `https://linear.app/oauth/authorize?client_id=${LINEAR_CLIENT_ID}&redirect_uri=${encodeURIComponent(LINEAR_REDIRECT_URI)}&response_type=code&state=${socketId.current}&scope=read,write&prompt=consent`
    console.log('linearOauthURL',linearOauthURL)
    window.open(linearOauthURL)
  }

  const requireLinearOauth = () => {
    parent.postMessage({ pluginMessage: { type: "go-to-plugin-settings", data: { type: 'authorize'} } }, '*');
  }

  const clearLinearToken = () => {
    revokeLinearToken(token.current)
    token.current = ""
    window.parent.postMessage({ pluginMessage: { type: 'revoke-linear-token', data: {} }}, '*')

  }

  useEffect(() => {
    const handleWindowMessage = (event: any) => {

      if (event?.data?.pluginMessage?.type === 'get-linear-auth-token-response') {
        setIsLoading(true)
        const linearAuthToken = event.data.pluginMessage.data.linearAuthToken
        if (!linearAuthToken) {
          if (!skipLinearAuth) requireLinearOauth()
          else setIsLoading(false)
        } else {
          token.current = linearAuthToken;
          setIsLoading(false)
        }
      }
    };

    // Add event listener when component mounts
    window.addEventListener('message', handleWindowMessage);

    // Remove event listener when component unmounts
    return () => {
      window.removeEventListener('message', handleWindowMessage);
    };
  }, []);

  useEffect(function initializeWebsocket() {
    const newSocket = new WebSocket(WS_AUTH_SERVER_URL);
     
    newSocket.onerror = (error: any) => {
      console.error("Error doing 'initializeWebsocket", error)
      parent.postMessage({ pluginMessage: { type: "get-linear-auth-token" } }, '*');;
    }
    newSocket?.addEventListener('message', (event: any) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'connect') {
          socketId.current = data.connectionId
          parent.postMessage({ pluginMessage: { type: "get-linear-auth-token" } }, '*');
        }
        if (data.type === 'accessToken') {
          const linearAuthToken = data.accessToken

          token.current = linearAuthToken
          parent.postMessage({ pluginMessage: { type: "store-linear-token", token: linearAuthToken } }, '*');
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Erro")
      }
    })
    return () => {
      newSocket?.close();
    };
  }, []);

  return {
    clearLinearToken,
    initLinearOauthFlow,
    requireLinearOauth,
    isLoading,
    token: token.current,
  }
}

