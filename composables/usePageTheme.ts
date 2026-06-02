export function usePageTheme(theme: 'dark' | 'light' = 'dark') {
  const pageTheme = useState<'dark' | 'light'>('pageTheme', () => 'dark')
  pageTheme.value = theme
  onUnmounted(() => { pageTheme.value = 'dark' })
}
