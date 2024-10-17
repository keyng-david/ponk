import React, { useCallback } from "react";
import { Steps, useNavigatorModel } from "@/shared/model";
import { IonIcon } from 'react-ionicons';
import styles from './NavBar.module.scss';
import {leadersModel} from "@/entities/leaders/model";
import {earnModel} from "@/entities/earn/model";

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
                    <a href="#" style={{ color: 'white' }}>
                        <span className="icon"><IonIcon name="home-outline" /></span>
                        <span className="text">Home</span>
                    </a>
                </li>
                <li className={`list_item ${step === Steps.BOARD ? 'active' : ''}`} onClick={() => {
                    leadersModel.leadersRequested()
                    stepChanged(Steps.BOARD)
                }}>
                    <a href="#" style={{ color: 'white' }}>
                        <span className="icon"><IonIcon name="trophy-outline" /></span>
                        <span className="text">Leaders</span>
                    </a>
                </li>
                <li className={`list_item ${step === Steps.FRENS ? 'active' : ''}`} onClick={() => handleItemClick(Steps.FRENS)}>
                    <a href="#" style={{ color: 'white' }}>
                        <span className="icon"><IonIcon name="people-outline" /></span>
                        <span className="text">Frens</span>
                    </a>
                </li>
                <li className={`list_item ${step === Steps.EARN ? 'active' : ''}`} onClick={() => {
                    earnModel.tasksRequested()
                    stepChanged(Steps.EARN)
                }}>
                    <a href="#" style={{ color: 'white' }}>
                        <span className="icon"><IonIcon name="cash-outline" /></span>
                        <span className="text">Earn</span>
                    </a>
                </li>
                <li className="list_item" onClick={handleDropClick}>
                    <a href="#" style={{ color: 'white' }}>
                        <span className="icon"><IonIcon name="gift-outline" /></span>
                        <span className="text">Airdrop</span>
                    </a>
                </li>
                <div className="indicator"></div>
            </ul>
        </div>
    );
};