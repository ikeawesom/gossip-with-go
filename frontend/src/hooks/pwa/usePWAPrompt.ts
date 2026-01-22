import { useEffect, useState } from "react"
import { isIOS, isStandalone } from "../../lib/helpers"

export function usePWAPrompt() {
    // detect if PWA is installable on current device
    const [installable, setInstallable] = useState(false)
    const [isIOSDevice, setIOS] = useState(false)

    useEffect(() => {
        if (isStandalone()) return

        setIOS(isIOS())

        const handler = () => setInstallable(true)
        window.addEventListener("pwa-installable", handler)

        if ((window as any).deferredPrompt) {
            setInstallable(true)
        }

        return () => window.removeEventListener("pwa-installable", handler)
    }, [])

    return {
        installable,
        isIOS: isIOSDevice,
        async install() {
            if ((window as any).deferredPrompt) {
                await (window as any).deferredPrompt.prompt()
            }
        }
    }
}
