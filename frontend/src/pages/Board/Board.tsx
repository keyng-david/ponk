import background from '@/shared/assets/images/frens/background.png'
import firstBg from '@/shared/assets/images/leaders/firstbg.png'

import styles from './Board.module.scss'
import React from 'react'
import { LoaderTemplate } from '@/shared/ui/LoaderTemplate'
import { leadersModel } from '@/entities/leaders/model'
import { LeaderData } from '@/entities/leaders/model/types'
import { reflect } from '@effector/reflect'
import { toFormattedNumber, toFormattedIndex } from '@/shared/lib/number'

export const Board = () => {
    return (
        <div className={styles.root}>
            <Title />
            <MainReflect />
            <Decorations />
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

const Decorations = () => (
    <>
        <img src={background} className={styles.background} alt={'background'}/>
    </>
)

const FirstPosition = React.memo<LeaderData>(({ position, name, score }) => (
    <div className={styles['first-position']}>
        <img className={styles['first-position-bg']} src={firstBg} alt={'firstBg'} />
        <span className={styles['first-label']}>{toFormattedIndex(position)}</span>
        <p className={styles['first-title']}>{name}</p>
        <p className={styles['first-amount']}>{toFormattedNumber(score)}</p>
    </div>
))

const LeadersList = React.memo<{
    list: LeaderData[]
}>(({ list }) => (
    <div className={styles.list}>
        {list.map(item => (
            <div key={item.position} className={styles['list-item']}>
                <span>{toFormattedIndex(item.position)}</span>
                <p className={styles['list-item-name']}>{item.name}</p>
                <p className={styles['list-item-score']}>{toFormattedNumber(item.score)}</p>
            </div>
        ))}
    </div>
))