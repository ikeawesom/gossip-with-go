import { useEffect, useState } from 'react'

export default function usePWAModal() {
    const [showPWA, setShowPWA] = useState(false);

    const handleClose = () => {
        setShowPWA(false);
        localStorage.setItem("pwaPromptDismissed", "1");
    };

    useEffect(() => {
        // use localstorage to detemine modal for PWA
        const shownPwa = localStorage.getItem("pwaPromptDismissed");
        if (!shownPwa) {
            setShowPWA(true);
        }
    }, [showPWA]);

    return { showPWA, handleClose }
}
