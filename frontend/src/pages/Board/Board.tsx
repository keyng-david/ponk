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
    <img src={background} className="absolute inset-0 w-full h-full object-cover" alt="background" />
)

const FirstPosition = React.memo<LeaderData>(({ position, name, score }) => (
    <div className="flex justify-between items-center bg-yellow-600 px-6 py-3 rounded-lg mx-4 mb-4">
        <div className="flex items-center space-x-4">
            <img src={firstMedal} alt="1st position" className="w-8 h-8" />
            <span>{name}</span>
        </div>
        <div className="flex items-center space-x-2">
            <span>{toFormattedNumber(score)}</span>
            <img src={coinImage} alt="coin" className="w-6 h-6" />
        </div>
    </div>
))

const LeadersList = React.memo<{
    list: LeaderData[]
}>(({ list }) => (
    <div className="space-y-4 px-4">
        {list.map((item, index) => (
            <div key={item.position} className="flex justify-between items-center bg-gray-900 px-6 py-3 rounded-lg">
                <div className="flex items-center space-x-4">
                    {index === 0 && <img src={firstMedal} alt="first" className="w-6 h-6" />}
                    {index === 1 && <img src={secondMedal} alt="second" className="w-6 h-6" />}
                    {index === 2 && <img src={thirdMedal} alt="third" className="w-6 h-6" />}
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