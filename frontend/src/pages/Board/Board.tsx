import React from 'react'
import firstMedal from '@/shared/assets/images/leaders/1st.svg'
import secondMedal from '@/shared/assets/images/leaders/2nd.svg'
import thirdMedal from '@/shared/assets/images/leaders/3rd.svg'
import coinImage from '@/shared/assets/images/main/coin.svg'
import background from '@/shared/assets/images/frens/background.png'
import styles from './Board.module.scss'
import { LoaderTemplate } from '@/shared/ui/LoaderTemplate'
import { leadersModel } from '@/entities/leaders/model'
import { LeaderData } from '@/entities/leaders/model/types'
import { reflect } from '@effector/reflect'
import { toFormattedNumber, toFormattedIndex } from '@/shared/lib/number'

export const Board = () => {
    return (
        <div className={`${styles.root} min-h-screen bg-black text-white`}>
            <Title />
            <MainReflect />
            <Decorations />
        </div>
    )
}

const Title = () => (
    <div className="text-center py-6">
        <h2 className={`${styles.title} text-4xl font-bold`}>LEADERS</h2>
    </div>
)

const Main = React.memo<{
    isLoading: boolean
    list: LeaderData[]
    firstPosition: LeaderData
}>(({ isLoading, list, firstPosition }) => (
    <LoaderTemplate className="px-4" isLoading={isLoading}>
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

const Decorations = () => (
    <div
        style={{
            background: "black",
        }}
        className={styles.background}
        aria-label="background"
    />
)

const FirstPosition = React.memo<LeaderData>(({ position, name, score }) => (
    <div className={styles['first-position']}>
        <div className="min-h-screen bg-black text-white">
            {/* Header: Player count and total points earned */}
            <div className="flex justify-between items-center py-4 px-6 text-gray-400 text-sm">
                <span>Top Players</span>
                <span>Total points earned</span>
            </div>

            {/* User score section */}
            <div className="flex justify-between items-center bg-yellow-600 px-6 py-3 rounded-lg mx-4 mb-4">
                <div className="text-sm font-bold text-black">100+ Me</div>
                <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-white">4,600</span>
                    <img src={coinImage} alt="coin" className="w-6 h-6" />
                </div>
            </div>

            {/* Leaderboard - First player with medal */}
            <div className="space-y-4 px-4">
                <div className="flex justify-between items-center bg-gray-900 px-6 py-3 rounded-lg">
                    <div className="flex items-center space-x-4">
                        <img src={firstMedal} alt="gold-medal" className="w-6 h-6" />
                        <span>{name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span>{toFormattedNumber(score)}</span>
                        <img src={coinImage} alt="coin" className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </div>
    </div>
));


const LeadersList = React.memo<{
    list: LeaderData[]
}>(({ list }) => (
    <div className={styles.list}>
        {list.map(item => (
            <div key={item.position} className="flex justify-between items-center bg-gray-900 px-6 py-3 rounded-lg mb-4">
                <div className="flex items-center space-x-4">
                    {item.position === 2 && <img src={secondMedal} alt="silver-medal" className="w-6 h-6" />}
                    {item.position === 3 && <img src={thirdMedal} alt="bronze-medal" className="w-6 h-6" />}
                    {item.position > 3 ? <span>{toFormattedIndex(item.position)}</span> : null}
                    <span>{item.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span>{toFormattedNumber(item.score)}</span>
                    <img src={coinImage} alt="coin" className="w-6 h-6" />
                </div>
            </div>
        ))}
    </div>
));