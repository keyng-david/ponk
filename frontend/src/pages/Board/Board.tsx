import firstImage from '@/shared/assets/images/leaders/1st.svg'
import secondImage from '@/shared/assets/images/leaders/2nd.svg'
import thirdImage from '@/shared/assets/images/leaders/3rd.svg'
import coinImage from '@/shared/assets/images/main/coin.svg';

import styles from './Board.module.scss'
import React from 'react'
import { LoaderTemplate } from '@/shared/ui/LoaderTemplate'
import { leadersModel } from '@/entities/leaders/model'
import { LeaderData } from '@/entities/leaders/model/types'
import { reflect } from '@effector/reflect'
import { toFormattedNumber, toFormattedIndex } from '@/shared/lib/number'

export const Board = () => {
    return (
        <div
            className="min-h-screen text-white"
            style={{ background: "radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)" }}
        >
            <Title />
            <MainReflect />
        </div>
    )
}

const Title = () => (
    <>
        <h2 className={styles.title}>LEADERS</h2>
        <h2 className={styles.title}>LEADERS</h2>
    </>
)

const Main = React.memo<{
    isLoading: boolean
    list: LeaderData[]
    firstPosition: LeaderData
}>(({ isLoading, list, firstPosition }) => (
    <LoaderTemplate className={styles.main} isLoading={isLoading}>
        <FirstPosition {...firstPosition} />
        <LeadersList list={list} />
    </LoaderTemplate>
))

const MainReflect = reflect({
    view: Main,
    bind: {
        list: leadersModel.$list,
        firstPosition: leadersModel.$firstPosition,
        isLoading: leadersModel.$isLoading,
    }
})


const FirstPosition = React.memo<LeaderData>(({ position, name, score }) => {
    let positionImage;
    if (position === 1) {
        positionImage = firstImage;
    } else if (position === 2) {
        positionImage = secondImage;
    } else if (position === 3) {
        positionImage = thirdImage;
    }

    return (
        <div className="flex justify-between items-center bg-gray-900 px-6 py-3 rounded-lg">
            <div className="flex items-center space-x-4">
                <img src={positionImage} alt={`${position}-medal`} className="w-6 h-6" />
                <span>{name}</span>
            </div>
            <div className="flex items-center space-x-2">
                <span>{toFormattedNumber(score)}</span>
                <img src={coinImage} alt="coin" className="w-6 h-6" />
            </div>
        </div>
    )
})

const LeadersList = React.memo<{
    list: LeaderData[]
}>(({ list }) => (
    <div className="space-y-4 px-4">
        {list.map((item, index) => (
            <div key={item.position} className="flex justify-between items-center bg-gray-900 px-6 py-3 rounded-lg">
                <div className="flex items-center space-x-4">
                    <span>{toFormattedIndex(item.position)}</span>
                    <span>{item.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span>{toFormattedNumber(item.score)}</span>
                    <img src={coinImage} alt="coin" className="w-6 h-6" />
                </div>
            </div>
        ))}
    </div>
))