import { fireEvent, render } from '@testing-library/react'
import { createRef } from 'react'
import { AppLayout } from '../AppLayout'

let mockPathname = '/'
let mockStreaming = false
let mockHand = 0

vi.mock('react-router', () => ({
  useLocation: () => ({ pathname: mockPathname })
}))

vi.mock('@store/store', () => ({
  useLiviStore: (selector: (s: any) => unknown) => selector({ settings: { hand: mockHand } }),
  useStatusStore: (selector: (s: any) => unknown) => selector({ isStreaming: mockStreaming })
}))

vi.mock('../../../hooks/useBlinkingTime', () => ({
  useBlinkingTime: () => '12:34'
}))

let mockNetwork: { type: string; online: boolean } = { type: 'wifi', online: true }
vi.mock('../../../hooks/useNetworkStatus', () => ({
  useNetworkStatus: () => mockNetwork
}))

vi.mock('@mui/material/styles', async () => {
  const actual = await vi.importActual('@mui/material/styles')
  return {
    ...actual,
    useTheme: () => ({
      palette: { background: { paper: '#111' } }
    })
  }
})

describe('AppLayout', () => {
  beforeEach(async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    mockPathname = '/'
    mockStreaming = false
    mockHand = 0
    mockNetwork = { type: 'wifi', online: true }
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 })
    ;(window as any).app = { notifyUserActivity: vi.fn() }
  })

  afterEach(async () => {
    vi.useRealTimers()
  })

  test('hides nav on home when streaming', async () => {
    mockStreaming = true
    const navRef = createRef<HTMLDivElement>()
    const mainRef = createRef<HTMLDivElement>()
    const { container } = render(
      <AppLayout navRef={navRef} mainRef={mainRef} receivingVideo={false}>
        <div>Content</div>
      </AppLayout>
    )
    expect(container.querySelector('#content-root')?.getAttribute('data-nav-hidden')).toBe('1')
  })

  test('forwards pointer activity to app notifier', async () => {
    const navRef = createRef<HTMLDivElement>()
    const mainRef = createRef<HTMLDivElement>()
    const { container } = render(
      <AppLayout navRef={navRef} mainRef={mainRef} receivingVideo={false}>
        <div>Content</div>
      </AppLayout>
    )
    fireEvent.pointerDown(container.querySelector('#main') as HTMLElement)
    expect((window as any).app.notifyUserActivity).toHaveBeenCalled()
  })

  test('defaults the steering hand to left when the setting is absent', async () => {
    mockHand = undefined as unknown as number
    const navRef = createRef<HTMLDivElement>()
    const mainRef = createRef<HTMLDivElement>()
    const { container } = render(
      <AppLayout navRef={navRef} mainRef={mainRef} receivingVideo={false}>
        <div>Content</div>
      </AppLayout>
    )
    expect((container.querySelector('#main') as HTMLElement).style.flexDirection).toBe('row')
  })
})
