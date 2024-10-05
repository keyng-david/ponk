import backgroundImage from '@/shared/assets/images/main/background.svg'
import tableImage from '@/shared/assets/images/main/table.svg'
import cabelImage from '@/shared/assets/images/main/cabel.svg'
import clockImage from '@/shared/assets/images/main/clock.png'
import pictureImage from '@/shared/assets/images/main/picture.png'
import keyboardImage from '@/shared/assets/images/main/keyboard.svg'
import bankaLeftImage from '@/shared/assets/images/main/banka-left.png'
import bankaRightImage from '@/shared/assets/images/main/banka-right.png'
import logo from '@/shared/assets/images/main/logo.png'
import walletButton from '@/shared/assets/images/main/wallet-button.png'

import noRang from '@/shared/assets/images/rangs/no-rang.png'
import soldier from '@/shared/assets/images/rangs/soldier.png'
import lieutenant from '@/shared/assets/images/rangs/lieutnent.png'
import general from '@/shared/assets/images/rangs/general.png'

import styles from './Main.module.scss'
import {MonitorTop} from "@/shared/ui/MonitorTop";
import {MonitorCenter} from "@/shared/ui/MonitorCenter";
import {MonitorRight} from "@/shared/ui/MonitorRight";
import {MonitorLeft} from "@/shared/ui/MonitorLeft";
import {ClickerField} from "@/features/clicker/ui";
import {useConnectTon} from "@/features/ton/useConnectTon";
import {useAuth} from "@/features/auth/useAuth";
import {useEffect, useMemo} from "react";
import {useTelegram} from "@/shared/lib/hooks/useTelegram";
import {walletModel} from "@/shared/model/wallet";
import {randModel} from "@/shared/model/rang";

export const Main = () => {
    const { initialize } = useConnectTon()
    const { wallet } = walletModel.useWalletModel()
    const { rang } = randModel.useRang()

    const authModel = useAuth()
    const { isValidPlaform } = useTelegram()

    const rangImage = useMemo(() => {
        switch (rang) {
            case 0: return noRang
            case 1: return soldier
            case 2: return lieutenant
            case 3: return general
            default: return noRang
        }
    }, [rang])

    useEffect(() => {
        if (isValidPlaform) {
            authModel.initialize().then()
        }
    })

    return (
        <div className={styles.root}>
            <img
                className={styles['general-button']}
                src={rangImage}
                alt={'rang'}
            />
            <img
                className={styles.logo}
                src={logo}
                alt={'logo'}
            />
            <img
                className={styles['wallet-button']}
                src={walletButton}
                alt={'wallet'}
                onClick={wallet === 'none' ? initialize : undefined}
            />
            <Background/>
            <ClickerField/>
        </div>
    )
}

const Background = () => (
    <div className={styles.background}>
            <img
                className={styles['background-image']}
                src={backgroundImage}
                alt={'background'}
            />
            <img
                className={styles.table}
                src={tableImage}
                alt={'table'}
            />
            <img
                className={styles.cabel}
                src={cabelImage}
                alt={'cabel'}
            />
            <img
                className={styles.clock}
                src={clockImage}
                alt={'clock'}
            />
            <img
                className={styles.picture}
                src={pictureImage}
                alt={'picture'}
            />
            <img
                className={styles.keyboard}
                src={keyboardImage}
                alt={'keyboard'}
            />
            <img
                className={styles['banka-left']}
                src={bankaLeftImage}
                alt={'banka-left'}
            />
            <img
                className={styles['banka-right']}
                src={bankaRightImage}
                alt={'banka-right'}
            />
            <MonitorTop className={styles['monitor-top']}/>
            <MonitorCenter className={styles['monitor-center']}/>
            <MonitorRight className={styles['monitor-right']}/>
            <MonitorLeft className={styles['monitor-left']}/>
    </div>
)