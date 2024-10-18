import React from "react";
import { Steps, useNavigatorModel } from "@/shared/model";
import styles from './NavBar.module.scss';
import { leadersModel } from "@/entities/leaders/model";
import { earnModel } from "@/entities/earn/model";
import { IonIcon } from '@ionic/react';
import { homeOutline, trophyOutline, peopleOutline, cashOutline, giftOutline } from 'ionicons/icons';

export const NavBar = () => {
    const { step, stepChanged } = useNavigatorModel();

    const handleItemClick = (page: Steps) => {
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