vi.mock('../keysControl', () => ({
  __esModule: true,
  useActivateControl: 'useActivateControlMock',
  useFocus: 'useFocusMock',
  useKeyDown: 'useKeyDownMock'
}))

describe('hooks index', () => {
  test('re-exports hooks', async () => {
    const mod = await import('../index')

    expect(mod.useActivateControl).toBe('useActivateControlMock')
    expect(mod.useFocus).toBe('useFocusMock')
    expect(mod.useKeyDown).toBe('useKeyDownMock')
  })
})
