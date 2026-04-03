import { useAppStore } from '@/store/appStore'

export function useGetElementById(id: string) {
  const [container, setContainers] = useState<HTMLElement | null>()
  const isMobile = useAppStore(s => s.isMobile)

  useEffect(() => {
    setContainers(document.getElementById(id))
  }, [isMobile])

  return container
}
