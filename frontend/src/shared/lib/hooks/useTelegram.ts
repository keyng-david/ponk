import {useMemo} from "react";

export type TelegramWindow = {
    Telegram: {
        WebApp: {
            expand: () => void
            ready: () => void
            openTelegramLink: (data: string) => void
            openLink: (data: string) => void
            HapticFeedback: {
                impactOccurred: (v: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
            },
            platform: string
        },
        authData: {
            user?: {
                id: string
            }
        }
    }
}

export const useTelegram = () => {
    const tg = (window as unknown as TelegramWindow)

    function sendInviteLink(link: string) {
        try {
            tg.Telegram.WebApp.openTelegramLink(
                `https://t.me/share/url?url=${link}&text=`
            )
        } catch (e) {
            alert(e)
        }
    }

    function openLink(link: string) {
        try {
            tg.Telegram.WebApp.openLink(link)
        } catch (e) {
            alert(e)
        }
    }

    function expand() {
        try {
            tg.Telegram.WebApp.ready()
            tg.Telegram.WebApp.expand()
        } catch (e) {
            console.log(e)
        }
    }

    function haptic() {
        try {
            tg.Telegram.WebApp.HapticFeedback.impactOccurred('light')
        } catch (e) {
            console.log(e)
        }
    }

    const isValidPlaform = useMemo(() => {
        return (
            tg.Telegram.WebApp.platform !== 'macos' && 
            tg.Telegram.WebApp.platform !== 'windows' && 
            tg.Telegram.WebApp.platform !== 'linux'
        )
    }, [tg.Telegram.WebApp.platform])

    return {
        isValidPlaform,

        expand,
        haptic,
        sendInviteLink,
        openLink,
    }
}