/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching'

declare let self: ServiceWorkerGlobalScope

precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener("fetch", (event) => {
    const e = event as FetchEvent
    const url = new URL(e.request.url)

    if (url.pathname.startsWith("/api")) {
        return
    }
})
