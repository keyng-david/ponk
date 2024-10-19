import React, { useEffect } from "react";
import { Steps, useNavigatorModel } from "@/shared/model";
import styles from './NavBar.module.scss';
import { leadersModel } from "@/entities/leaders/model";
import { earnModel } from "@/entities/earn/model";
import { IonIcon } from '@ionic/react';
import { homeOutline, trophyOutline, peopleOutline, cashOutline, giftOutline } from 'ionicons/icons';

export const NavBar = () => {
    const { step, stepChanged } = useNavigatorModel();

    const [activeIndex, setActiveIndex] = useState(0);

    // Log the initial step value and when the component is rendered
    useEffect(() => {
        console.log('NavBar component rendered');
        console.log('Current step:', step);

        // Update activeIndex based on step
        switch (step) {
            case Steps.HOME:
                setActiveIndex(0);
                break;
            case Steps.BOARD:
                setActiveIndex(1);
                break;
            case Steps.FRENS:
                setActiveIndex(2);
                break;
            case Steps.EARN:
                setActiveIndex(3);
                break;
            default:
                setActiveIndex(0);
                break;
        }
    }, [step]);

    const handleItemClick = (page: Steps) => {
        console.log('Clicked item:', page);
        stepChanged(page);
    };

    const handleDropClick = () => {
        alert("Coming Soon");
    };

    return (
    <div className={styles.navigation}>
        <ul>
            <li className={`${styles.list_item} ${activeIndex === 0 ? styles.active : ''}`} onClick={() => handleItemClick(0, Steps.HOME)}>
                <a href="#">
                    <span className={styles.icon}><IonIcon icon={homeOutline} /></span>
                    <span className={styles.text}>Home</span>
                </a>
            </li>
            <li className={`${styles.list_item} ${activeIndex === 1 ? styles.active : ''}`} onClick={() => {
                leadersModel.leadersRequested(); 
                handleItemClick(1, Steps.BOARD);
            }}>
                <a href="#">
                    <span className={styles.icon}><IonIcon icon={trophyOutline} /></span>
                    <span className={styles.text}>Leaders</span>
                </a>
            </li>
            <li className={`${styles.list_item} ${activeIndex === 2 ? styles.active : ''}`} onClick={() => handleItemClick(2, Steps.FRENS)}>
                <a href="#">
                    <span className={styles.icon}><IonIcon icon={peopleOutline} /></span>
                    <span className={styles.text}>Frens</span>
                </a>
            </li>
            <li className={`${styles.list_item} ${activeIndex === 3 ? styles.active : ''}`} onClick={() => {
                earnModel.tasksRequested();
                handleItemClick(3, Steps.EARN);
            }}>
                <a href="#">
                    <span className={styles.icon}><IonIcon icon={cashOutline} /></span>
                    <span className={styles.text}>Earn</span>
                </a>
            </li>
            <li className={`${styles.list_item}`} onClick={handleDropClick}>
                <a href="#">
                    <span className={styles.icon}><IonIcon icon={giftOutline} /></span>
                    <span className={styles.text}>Airdrop</span>
                </a>
            </li>
            <div className={styles.indicator} style={{ transform: `translateX(calc(70px * ${activeIndex} + ${activeIndex * 7}px))` }}></div>
        </ul>
    </div>
);