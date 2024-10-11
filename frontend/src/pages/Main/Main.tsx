import logo from '@/shared/assets/images/main/logo.png';

import './backGround.css';
import styles from './Main.module.scss';
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

    const rangText = useMemo(() => {
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
    }, [isValidPlaform, authModel]);

    return (
        <div className={styles.root}>
            {/* Rank Button */}
            <button
                className="absolute z-10 bottom-[15%] left-[2%] w-[113px] h-[60px] text-white bg-gray-800 hover:bg-gray-700 font-orbitron font-bold tracking-wide rounded-lg shadow-md transition-transform duration-300"
            >
                {rangText}
            </button>

            {/* Logo */}
            <img
                className={styles.logo}
                src={logo}
                alt="logo"
            />

            {/* Wallet Button */}
            <button
                className="absolute z-10 bottom-[15%] right-[2%] w-[113px] h-[60px] text-white bg-blue-600 hover:bg-blue-500 font-orbitron font-bold tracking-wide rounded-lg shadow-md transition-transform duration-300"
                onClick={wallet === 'none' ? initialize : undefined}
            >
                Wallet
            </button>

            {/* Background */}
            <Background/>
            <ClickerField/>
        </div>
    );
};

const Background = () => (
    <div className={styles.background}>
        <div id="stars"></div>
        <div id="stars2"></div>
    </div>
);