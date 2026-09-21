import { FC, PropsWithChildren, useCallback } from 'react'
import { AppLayoutProps } from './types'

export const AppLayout: FC<PropsWithChildren<AppLayoutProps>> = ({ children, mainRef }) => {
  const onUserActivity = useCallback(() => {
    window.app?.notifyUserActivity?.()
  }, [])

  return (
    <div
      id="main"
      className="App"
      onPointerDownCapture={onUserActivity}
      style={{
        height: '100dvh',
        touchAction: 'none',
        display: 'flex',
        flexDirection: 'row'
      }}
    >
      <div
        ref={mainRef}
        id="content-root"
        data-nav-hidden="1"
        data-nav-present="0"
        style={{
          flex: 1,
          minWidth: 0,
          height: '100%',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {children}
      </div>
    </div>
  )
}
