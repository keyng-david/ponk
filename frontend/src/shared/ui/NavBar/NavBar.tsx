import React, { useEffect } from "react";
import { Steps, useNavigatorModel } from "@/shared/model";
import styles from './NavBar.module.scss';
import { leadersModel } from "@/entities/leaders/model";
import { earnModel } from "@/entities/earn/model";
import { IonIcon } from '@ionic/react';
import { homeOutline, trophyOutline, peopleOutline, cashOutline, giftOutline } from 'ionicons/icons';

export const NavBar = () => {
    const { step, stepChanged } = useNavigatorModel();

    // Log the initial step value and when the component is rendered
    useEffect(() => {
        console.log('NavBar component rendered');
        console.log('Current step:', step);
    }, [step]);
 
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
        <div className="navigation">
            <ul>
                <li className={`list_item ${step === Steps.HOME ? 'active' : ''}`} onClick={() => handleItemClick(Steps.HOME)}>
                    <a href="#">
                        <span className="icon"><IonIcon icon={homeOutline} /></span>
                        <span className="text">Home</span>
                    </a>
                </li>
                <li className={`list_item ${step === Steps.BOARD ? 'active' : ''}`} onClick={() => {
                    leadersModel.leadersRequested();
                    stepChanged(Steps.BOARD);
                }}>
                    <a href="#">
                        <span className="icon"><IonIcon icon={trophyOutline} /></span>
                        <span className="text">Leaders</span>
                    </a>
                </li>
                <li className={`list_item ${step === Steps.FRENS ? 'active' : ''}`} onClick={() => handleItemClick(Steps.FRENS)}>
                    <a href="#">
                        <span className="icon"><IonIcon icon={peopleOutline} /></span>
                        <span className="text">Frens</span>
                    </a>
                </li>
                <li className={`list_item ${step === Steps.EARN ? 'active' : ''}`} onClick={() => {
                    earnModel.tasksRequested();
                    stepChanged(Steps.EARN);
                }}>
                    <a href="#">
                        <span className="icon"><IonIcon icon={cashOutline} /></span>
                        <span className="text">Earn</span>
                    </a>
                </li>
                <li className="list_item" onClick={handleDropClick}>
                    <a href="#">
                        <span className="icon"><IonIcon icon={giftOutline} /></span>
                        <span className="text">Airdrop</span>
                    </a>
                </li>
                <div className="indicator"></div>
            </ul>
        </div>
    );
};