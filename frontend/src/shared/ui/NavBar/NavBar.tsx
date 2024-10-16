import React, { useCallback, useEffect } from "react";
import { Steps, useNavigatorModel } from "@/shared/model";
import { leadersModel } from "@/entities/leaders/model";
import { earnModel } from "@/entities/earn/model";
import styles from './NavBar.module.scss';  // Keep this for applying custom styles

export const NavBar = () => {
    const { step, stepChanged } = useNavigatorModel();

    // Define click handlers for each button
    const handleHomeClick = () => stepChanged(Steps.HOME);
    const handleLeadersClick = () => {
        leadersModel.leadersRequested();
        stepChanged(Steps.BOARD);
    };
    const handleFriendsClick = () => stepChanged(Steps.FRIENDS);
    const handleEarnClick = () => {
        earnModel.tasksRequested();
        stepChanged(Steps.EARN);
    };
        const handleDropClick = () => {
  alert("Coming soon");
};

    useEffect(() => {
        // JavaScript to handle active state switching
        const listItems = document.querySelectorAll('.list_item');
        listItems.forEach(item => item.addEventListener('click', function () {
            listItems.forEach(li => li.classList.remove('active'));
            this.classList.add('active');
        }));
    }, []);

    return (
        <div className="navigation">
            <ul>
                <li className="list_item active" onClick={handleHomeClick}>
                    <a href="#home" style={{ color: 'white' }}>
                        <span className="icon"><ion-icon name="home-outline"></ion-icon></span>
                        <span className="text">Home</span>
                    </a>
                </li>
                <li className="list_item" onClick={handleLeadersClick}>
                    <a href="#leaders" style={{ color: 'white' }}>
                        <span className="icon"><ion-icon name="trophy-outline"></ion-icon></span>
                        <span className="text">Leaders</span>
                    </a>
                </li>
                <li className="list_item" onClick={handleFriendsClick}>
                    <a href="#friends" style={{ color: 'white' }}>
                        <span className="icon"><ion-icon name="people-outline"></ion-icon></span>
                        <span className="text">Frens</span>
                    </a>
                </li>
                <li className="list_item" onClick={handleEarnClick}>
                    <a href="#earn" style={{ color: 'white' }}>
                        <span className="icon"><ion-icon name="cash-outline"></ion-icon></span>
                        <span className="text">Earn</span>
                    </a>
                </li>
                <li className="list_item" onClick={handleDropClick}>
                    <a href="#profile" style={{ color: 'white' }}>
                        <span className="icon"><ion-icon name="gift-outline"></ion-icon></span>
                        <span className="text">Airdrop</span>
                    </a>
                </li>
                <div className="indicator"></div>
            </ul>
        </div>
    );
};