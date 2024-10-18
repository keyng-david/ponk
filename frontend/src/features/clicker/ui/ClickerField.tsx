import React, { TouchEvent, useCallback, useMemo, useState } from "react";
import progress from '@/shared/assets/images/main/progress.png';
import pointImage from '@/shared/assets/images/main/Point.webp';

import skin1 from '@/shared/assets/images/skins/Skin1.webp';
import skin2 from '@/shared/assets/images/skins/Skin2.webp';
import skin3 from '@/shared/assets/images/skins/Skin3.webp';
import skin4 from '@/shared/assets/images/skins/Skin4.webp';
import { randModel } from "@/shared/model/rang";

import { MAX_AVAILABLE, CLICK_STEP, clickerModel } from "../model";
import styles from './ClickerField.module.scss';
import { getRandomArbitrary, getRandomInt } from "@/shared/lib/number";
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
  const { haptic } = useTelegram();

  const [isClickEnabled, setIsClickEnabled] = useState(true);

  const { rang } = randModel.useRang();
  const skinImage = useMemo(() => {
    switch (rang) {
      case 0: return skin1;
      case 1: return skin2;
      case 2: return skin3;
      case 3: return skin4;
      default: return skin1;
    }
  }, [rang]);

  const valueString = formatNumberForGrid(value); // Use special formatting for value display in grid component

  const onTouchStart = useCallback((e: TouchEvent<HTMLDivElement>) => {
    if (isClickEnabled) {
      let pointParent: HTMLDivElement | null = null;

      for (let i = 0; i < Math.min(e.touches.length, 3); i++) {
        const { clientX, clientY } = e.touches[i];
        if (canBeClicked) {
          onClick();

          const point = document.createElement('img');
          point.src = pointImage;
          point.alt = 'point';
          point.style.transform = `rotate(${getRandomInt(-25, 25)}deg) scale(${getRandomArbitrary(0.8, 1.2)})`;

          pointParent = document.createElement('div');
          pointParent.appendChild(point);
          pointParent.style.top = `${clientY}px`;
          pointParent.style.left = `${clientX}px`;
          pointParent.className = styles.point;

          document.querySelector('#clicker')!.appendChild(pointParent);

          haptic();
        }

        const timeout1 = setTimeout(() => {
          if (pointParent && document.querySelector('#clicker')) {
            document.querySelector('#clicker')!.removeChild(pointParent);
          }

          clearTimeout(timeout1);
        }, 500);
      }

      setIsClickEnabled(false);
      timeout1 = setTimeout(() => {
        setIsClickEnabled(true);
        clearTimeout(timeout1);
      }, 150);
    }
  }, [isClickEnabled, canBeClicked, haptic]);

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
      <p className={styles.value}>{valueString}</p>
      <ProgressBar value={available} />
      <div className={styles.skinContainer}>
        <img
          id={'skinImage'}
          className={styles.skinImage}
          src={skinImage}
          alt={'skin image'}
          onClick={handleSkinClick}
        />
      </div>
      
      <!-- Grid Component -->
      <div class="flex space-x-4 fixed bottom-28 inset-x-4">
      
        <!-- Energy Box -->
        <div class="bg-opacity-100 shadow-lg rounded-md p-4 w-36 h-16 flex flex-col justify-center items-center border border-gray-700 float-animation" style="background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%); box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.6);">
          <div class="text-xs text-gray-400 font-semibold">Energy</div>
          <div class="text-white text-lg font-bold">{formatNumberForGrid(MAX_AVAILABLE)}</div> <!-- Replaced with MAX_AVAILABLE -->
        </div>
      
        <!-- Boost Box -->
        <div class="bg-opacity-100 shadow-lg rounded-md p-4 w-36 h-16 flex flex-col justify-center items-center border border-gray-700 float-animation" style="background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%); box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.6);">
          <div class="text-xs text-gray-400 font-semibold">Boost</div>
          <div class="text-white text-lg font-bold"> 🚀 </div>
        </div>
      
        <!-- Damage Box -->
        <div class="bg-opacity-100 shadow-lg rounded-md p-4 w-36 h-16 flex flex-col justify-center items-center border border-gray-700 float-animation" style="background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%); box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.6);">
          <div class="text-xs text-gray-400 font-semibold">Damage</div>
          <div class="text-white text-lg font-bold">{formatNumberForGrid(CLICK_STEP)}</div> <!-- Replaced with CLICK_STEP -->
        </div>
      </div>
    </div>
  );
};

const ProgressBar = React.memo<{ value: number }>(({ value }) => {
  const list = useMemo(() => {
    let count = 0;
    let curr = value;

    while (curr >= 0) {
      count += 1;
      curr = curr - MAX_AVAILABLE / 12;
    }

    return count;
  }, [value]);

  const percentage = (value / MAX_AVAILABLE) * 100;

  return (
    <div className="range" style={{ '--p': percentage } as React.CSSProperties}>
      <div className="available">{value}</div>
    </div>
  );
});