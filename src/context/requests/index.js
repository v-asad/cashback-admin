// Exports
import { createContext, useContext, useState } from 'react'
import React, { useEffect } from 'react'
// Create a Socket Context
const RequestContext = createContext()

// Create a Socket Provider Wrapper
const RequestProvider = ({ children }) => {
  const [requests, setRequests] = useState(null)
  useEffect(
    () => console.log("Requsts: ", requests),
    [requests]
  )
  return <RequestContext.Provider value={[requests, setRequests]}>{children}</RequestContext.Provider>
}

// Create a Socket Consumer Hook
const useRequests = () => {
  const [requests, setRequests] = useContext(RequestContext)
  return [requests, setRequests]
}

// Exports
export { RequestProvider, useRequests }
