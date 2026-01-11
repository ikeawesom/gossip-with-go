/// <reference lib="webworker" />

self.addEventListener("fetch", (event) => {
    const e = event as FetchEvent
    const url = new URL(e.request.url)

    if (url.pathname.startsWith("/api")) {
        return
    }
})
