import { useEffect, useRef } from "react"

const useCustomEvent = (eventName: string) => {
  const ref = useRef<CustomEvent | null>(null)

  useEffect(() => {
    ref.current = new CustomEvent(eventName)
    return () => {
      ref.current = null
    }
  }, [eventName])

  const dispatchEvent = (data: any) => {
    if (ref.current) {
      document.dispatchEvent(new CustomEvent(eventName, { detail: data }))
    }
  }

  const addEventListener = (callback: (arg0: any) => void) => {
    const eventHandler = (event: any) => {
      callback(event.detail)
    }

    document.addEventListener(eventName, eventHandler)

    return () => {
      document.removeEventListener(eventName, eventHandler)
    }
  }

  return { dispatchEvent, addEventListener }
}

export default useCustomEvent
