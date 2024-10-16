import React, {useCallback, useEffect, useState} from "react";

import styles from './Navigator.module.scss'
import {NavBar} from "@/shared/ui/NavBar";
import { clickerModel } from "@/features/clicker/model";

export type NavigatorProps = {
    activeStep: number
    mainComponent: React.ReactNode
    hiddenComponents: {
        step: number
        component: React.ReactNode
    }[]
}

export const SliderNavigator = React.memo<NavigatorProps>(({ activeStep, mainComponent, hiddenComponents }) => {
    const [ active, setActive ] = useState(activeStep)
    const [ prev, setPrev ] = useState<number[]>([])
    const [ next, setNext ] = useState(0)

    const { isMultiError } = clickerModel.useClicker()

    const getClasses = useCallback((step: number) => {
        const classes = [styles.step]

        if (prev.includes(step)) {
            classes.push(styles['step-prev'])
        }

        if (step === active) {
            classes.push(styles['step-active'])
        }

        if (step === next) {
            classes.push(styles['step-next'])
        }

        return classes.join(' ')
    }, [active, prev, next])

    useEffect(() => {
        if (active !== activeStep) {
            setNext(activeStep)
            const timeout1 = setTimeout(() => {
                setPrev(prevState => [
                    ...prevState.filter(item => item !== activeStep),
                    active,
                ])
                setActive(activeStep)
                setNext(0)

                clearTimeout(timeout1)
            }, 300)
        }
    }, [activeStep, active, prev]);

    return (
        <div className={styles.root}>
            {mainComponent}
            {hiddenComponents.map(({ step, component }) => {
                if (step === active || prev.includes(step) || step === next) {
                    return (
                        <div key={step} className={getClasses(step)}>
                            {component}
                        </div>
                    )
                }

                return null
            })}
            <NavBar />
            {isMultiError && (
                <div className={styles['invalid-platform']}>
                    <h1>YOUR CAN USE ONLY ONE DEVICE</h1>
                    <h1>YOUR CAN USE ONLY ONE DEVICE</h1>
                </div>
            )}
        </div>
    )
})