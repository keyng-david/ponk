import Avatar from '@/shared/assets/images/skin/Avatar.webp'
import trophy from '@/shared/assets/images/skin/leaderboard.png'
import './backGround.css'
import styles from './Main.module.scss'
import {ClickerField} from "@/features/clicker/ui";
import {useConnectTon} from "@/features/ton/useConnectTon";
import {useAuth} from "@/features/auth/useAuth";
import {useEffect, useMemo} from "react";
import {useTelegram} from "@/shared/lib/hooks/useTelegram";
import {walletModel} from "@/shared/model/wallet";
import {randModel} from "@/shared/model/rang";

export const Main = () => {
    const { initialize } = useConnectTon();
    const { wallet } = walletModel.useWalletModel();
    const { rang } = randModel.useRang();

    const authModel = useAuth();
    const { isValidPlaform } = useTelegram();

    // Map rang value to corresponding rank label
    const rangLabel = useMemo(() => {
        switch (rang) {
            case 0: return 'No Rank';
            case 1: return 'Soldier';
            case 2: return 'Lieutenant';
            case 3: return 'General';
            default: return 'No Rank';
        }
    }, [rang]);

    useEffect(() => {
        if (isValidPlaform) {
            authModel.initialize().then();
        }
    });

    return (
        <div className={styles.root}>
            <div className={`${styles['general-button']} button`}>
                <div className="border-line top-line"></div>
                <div className="border-line bottom-line"></div>
                <div className="border-line left-line"></div>
                <div className="border-line right-line"></div>
                <div className="inner1">{rangLabel}</div>
            </div>

            <img
                className={styles.logo}
                src={logo}
                alt={'logo'}
            />

            <div className={`${styles['wallet-button']} button`} onClick={wallet === 'none' ? initialize : undefined}>
                <div className="border-line top-line"></div>
                <div className="border-line bottom-line"></div>
                <div className="border-line left-line"></div>
                <div className="border-line right-line"></div>
                <div className="inner1">Wallet</div>
            </div>

            <Background />
            <ClickerField />
        </div>
    );
};

const Background = () => (
    <div className={styles.background}>
        {/* Galaxy animation here */}
        <div id="stars"></div>
        <div id="stars2"></div>
    </div>
);