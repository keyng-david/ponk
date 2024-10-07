import React, { TouchEvent, useCallback, useMemo, useState } from "react";
import progress from '@/shared/assets/images/main/progress.png';
import pointImage from '@/shared/assets/images/main/point.png';

import skin1 from '@/shared/assets/images/skins/skin1.png';
import skin2 from '@/shared/assets/images/skins/skin2.png';
import skin3 from '@/shared/assets/images/skins/skin3.png';
import skin4 from '@/shared/assets/images/skins/skin4.png';
import {randModel} from "@/shared/model/rang";

import { MAX_AVAILABLE, clickerModel } from "../model";
import styles from './ClickerField.module.scss';
import { getRandomArbitrary, getRandomInt, toFormattedNumber } from "@/shared/lib/number";
import { useTelegram } from "@/shared/lib/hooks/useTelegram";

let timeout1: NodeJS.Timeout;

export const ClickerField = () => {
    const { value, available, canBeClicked, onClick } = clickerModel.useClicker();
    const { haptic } = useTelegram();

    const [isClickEnabled, setIsClickEnabled] = useState(true);

    // Fetching user's rank to determine the skin image
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

    const valueString = toFormattedNumber(value);

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
                <img id={'skinImage'} className={styles.skinImage} src={skinImage} alt={'skin image'} />
            </div>
        </div>
    );
};

const ProgressBar = React.memo<{
    value: number
}>(({ value }) => {
    const list = useMemo(() => {
        let count = 0;
        let curr = value;

        while (curr >= 0) {
            count += 1;
            curr = curr - MAX_AVAILABLE / 12;
        }

        return count;
    }, [value]);

    return (
        <div className={styles['progress-bar']}>
            <span className={styles.available}>{value}</span>
            <div className={styles.row}>
                {Array(list).fill(1).map((_, index) => (
                    <img key={index} className={styles['item']} src={progress} alt={'progress'} />
                ))}
            </div>
        </div>
    );
});