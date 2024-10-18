import Avatar from '@/shared/assets/images/skin/Avatar.webp';
import './backGround.css';
import styles from './Main.module.scss';
import { ClickerField } from "@/features/clicker/ui";
import { useConnectTon } from "@/features/ton/useConnectTon";
import { useAuth } from "@/features/auth/useAuth";
import { useEffect, useMemo } from "react";
import { useTelegram } from "@/shared/lib/hooks/useTelegram";
import { walletModel } from "@/shared/model/wallet";
import { randModel } from "@/shared/model/rang";

export const Main = () => {
  const { initialize } = useConnectTon();
  const { wallet } = walletModel.useWalletModel();
  const { rang } = randModel.useRang();

  const authModel = useAuth();
  const { isValidPlaform } = useTelegram();
  const { userName } = authModel; // Access userName from useAuth

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
      {/* Replacing logo, wallet, and rank button with the new Header component */}
      <div class="w-[90%] max-w-lg mx-auto rounded-lg p-4 px-4 flex items-center justify-between text-white mt-6 shadow-lg" 
        style={{ background: "radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)" }}>
        <div class="flex items-center space-x-3">
          <img src={Avatar} alt="User Avatar" class="w-10 h-10 rounded-full" />
          <div class="text-left">
            <span class="font-bold" style={{ background: "linear-gradient(115deg, #62cff4, #2c67f2)", WebkitBackgroundClip: "text", color: "transparent" }}>
              {userName || "Player"}
            </span>
            <div class="text-sm flex items-center space-x-2">
              <h3 class="text-lg font-bold">{rangLabel}</h3>
              <span class="text-gray-400">•</span>
              <span class="text-gray-400">Rank</span>
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button class="text-white font-bold px-4 py-2 rounded-full" 
            style={{ background: "linear-gradient(115deg, #62cff4, #2c67f2)" }} 
            onClick={wallet === 'none' ? initialize : undefined}>
            Wallet
          </button>
        </div>
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