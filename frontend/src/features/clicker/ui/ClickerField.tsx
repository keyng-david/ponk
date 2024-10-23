import React, { TouchEvent, useCallback, useMemo, useState } from "react";
import pointImage from '@/shared/assets/images/main/Point.webp';
import coinImage from '@/shared/assets/images/main/coin.svg';

import skin1 from '@/shared/assets/images/skins/Skin1.webp';
import skin2 from '@/shared/assets/images/skins/Skin2.webp';
import skin3 from '@/shared/assets/images/skins/Skin3.webp';
import skin4 from '@/shared/assets/images/skins/Skin4.webp';
import { randModel } from "@/shared/model/rang";
import { useAuth } from "@/features/auth/useAuth";

import { clickerModel } from "../model";
import styles from './ClickerField.module.scss';
import {getRandomArbitrary, getRandomInt, toFormattedNumber} from "@/shared/lib/number";
import { useTelegram } from "@/shared/lib/hooks/useTelegram";

// Function to format numbers specifically for Grid Component
const formatNumberForGrid = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "m";
  } else if (num >= 10000) {
    return (num / 1000).toFixed(1) + "k";
  } else {
    return num.toString();
  }
};

let timeout1: NodeJS.Timeout;

export const ClickerField = () => {
  const { value, available, canBeClicked, onClick } = clickerModel.useClicker();
  const clickStep = clickerModel.$clickStep.getState();
  const { haptic } = useTelegram();

  const [isClickEnabled, setIsClickEnabled] = useState(true);

  const { rang } = randModel.useRang();
  const { skin } = useAuth();

  // New logic to dynamically load skin image based on skin state or rang
  const skinImage = useMemo(() => {
    if (skin) {
      return skin; // This should be a URL link fetched from the API
    } else {
      // Fallback to default skin based on rang or skin1 if undefined
      switch (rang) {
        case 0: return skin1;
        case 1: return skin2;
        case 2: return skin3;
        case 3: return skin4;
        default: return skin1;
      }
    }
  }, [skin, rang]);

      const valueString = toFormattedNumber(value);

  const onTouchStart = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      if (isClickEnabled) {
        for (let i = 0; i < Math.min(e.touches.length, 3); i++) {
          const { clientX, clientY } = e.touches[i];
          if (canBeClicked) {
            onClick();

            const point = document.createElement('div');
            point.textContent = `+${clickStep}`;
            point.style.transform = `rotate(${getRandomInt(-25, 25)}deg) scale(${getRandomArbitrary(
              0.8,
              1.2
            )})`;
            point.className = styles.pointText;

            const pointParent = document.createElement('div');
            pointParent.appendChild(point);
            pointParent.style.top = `${clientY}px`;
            pointParent.style.left = `${clientX}px`;
            pointParent.className = styles.point;

            document.querySelector('#clicker')!.appendChild(pointParent);

            haptic();

            setTimeout(() => {
              if (pointParent && document.querySelector('#clicker')) {
                document.querySelector('#clicker')!.removeChild(pointParent);
              }
            }, 500);
          }
        }

        setIsClickEnabled(false);
        setTimeout(() => {
          setIsClickEnabled(true);
        }, 150);
      }
    },
    [isClickEnabled, canBeClicked, haptic, clickStep, onClick]
  );

  // New function to handle skin image click animation
  const handleSkinClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const skinImage = e.currentTarget;
    const rect = skinImage.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    skinImage.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`;
    setTimeout(() => {
      skinImage.style.transform = '';
    }, 100);
  };

  function handleTouchMove(event: TouchEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  return (
    <div
      id={'clicker'}
      className={styles.root}
      onTouchStart={onTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
                <p className={styles.value}>
  <img src={coinImage} alt="coin" /> {valueString}
</p>
      <div className={styles.skinContainer}>
  <img
    id={'skinImage'}
    className={`${styles.skinImage} float-animation-delayed`}
    src={skinImage}
    alt={'skin image'}
    onClick={handleSkinClick}
  />
</div>
      
      
      <div className="flex space-x-4 fixed bottom-28 inset-x-4">
      
        
        <div className="bg-opacity-100 shadow-lg rounded-md p-4 w-36 h-16 flex flex-col justify-center items-center border border-gray-700 float-animation" style={{ 
  background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0E 100%)', 
  boxShadow: '0 0 10px 2px rgba(0, 0, 0, 0.6)' 
}}>
          <div className="text-xs text-gray-400 font-semibold">Energy</div>
          <div className="text-white text-lg font-bold">{formatNumberForGrid(available)}</div>
        </div>
      
        
        <div className="bg-opacity-100 shadow-lg rounded-md p-4 w-36 h-16 flex flex-col justify-center items-center border border-gray-700 float-animation" style={{ 
  background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0E 100%)', 
  boxShadow: '0 0 10px 2px rgba(0, 0, 0, 0.6)' 
}}>
          <div className="text-xs text-gray-400 font-semibold">Boost</div>
          <div className="text-white text-lg font-bold"> 🚀 </div>
        </div>
      
        
        <div className="bg-opacity-100 shadow-lg rounded-md p-4 w-36 h-16 flex flex-col justify-center items-center border border-gray-700 float-animation" style={{ 
  background: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0E 100%)', 
  boxShadow: '0 0 10px 2px rgba(0, 0, 0, 0.6)' 
}}>
          <div className="text-xs text-gray-400 font-semibold">Damage</div>
          <div className="text-white text-lg font-bold">{formatNumberForGrid(clickStep)}</div>
        </div>
      </div>
    </div>
  );
};