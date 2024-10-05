import {Route, Routes, useLocation} from "react-router-dom";
import {Auth} from "@/pages/Auth/Auth";
import React, {useEffect, useState} from "react";
import {Main as Home} from "@/pages/Main/Main";
import {Steps, useNavigatorModel} from "@/shared/model";
import {SliderNavigator} from "@/shared/ui/Navigator";
import {Friends} from "@/pages/Friends/Friends";
import {Board} from "@/pages/Board/Board";
import { Earn } from "@/pages/Earn/Earn";
import { reflect } from "@effector/reflect";
import { TaskExpandModal } from "@/widgets/TaskExpandModal";
import { earnModel } from "@/entities/earn/model";

export const RouterView = React.memo(() => {
    const location = useLocation();

    const [displayLocation, setDisplayLocation] = useState(location);
    const [transitionStage, setTransitionStage] = useState<'fade-in' | 'fade-out'>('fade-in');

    useEffect(() => {
        if (location !== displayLocation) setTransitionStage("fade-out");
    }, [location, displayLocation]);

    return (
        <div
            className={transitionStage}
            onAnimationEnd={() => {
                if (transitionStage === 'fade-out') {
                    setTransitionStage('fade-in')
                    setDisplayLocation(location)
                }
            }}
        >
            <Routes location={displayLocation}>
                <Route path={'/'} element={<Auth />} />
                <Route path={'/Main'} element={<Main />} />
            </Routes>
        </div>
    )
})

const Main = () => {
    const { step } = useNavigatorModel()

    useEffect(() => {
        if (step !== Steps.HOME) {
            document.body.classList.add('is-modal-page')
        } else {
            document.body.classList.remove('is-modal-page')
        }
    }, [step]);

    return (
        <>
            <SliderNavigator
                activeStep={step}
                mainComponent={<Home />}
                hiddenComponents={[
                    {
                        step: Steps.FRENS,
                        component: <Friends />,
                    },
                    {
                        step: Steps.BOARD,
                        component: <Board />
                    },
                    {
                        step: Steps.EARN,
                        component: <Earn />
                    }
                ]}
            />
            <TaskModalReflect />
        </>
    )
}

const TaskModalReflect = reflect({
    view: TaskExpandModal,
    bind: {
        data: earnModel.$activeTask,
        onClose: earnModel.taskClosed,
    }
})