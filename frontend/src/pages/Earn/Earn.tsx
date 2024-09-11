import React from 'react'
import { reflect } from '@effector/reflect'

import { earnModel } from "@/entities/earn/model"

import { LoaderTemplate } from '@/shared/ui/LoaderTemplate'
import background from '@/shared/assets/images/frens/background.png'
import points from '@/shared/assets/images/frens/points.png'
import taskBg from '@/shared/assets/images/earn/task_bg.png'

import styles from './Earn.module.scss'
import { EarnItem } from '@/entities/earn/model/types'

export const Earn = () => {
    return (
        <div className={styles.root}>
            <TitleReflect />
            <MainReflect />
            <Decorations />
        </div>
    )
}

const Main = React.memo<{
    isLoading: boolean
}>(({ isLoading }) => (
    <LoaderTemplate className={styles.main} isLoading={isLoading}>
        <Points />
        <ListReflect />
    </LoaderTemplate>
))

const MainReflect = reflect({
    view: Main,
    bind: {
        isLoading: earnModel.$isLoading,
    }
})

const Title = React.memo<{
    count: number
}>(({ count }) => (
    <>
        <h2 className={styles.title}>{count} COLLABS</h2>
        <h2 className={styles.title}>{count} COLLABS</h2>
    </>
))

const TitleReflect = reflect({
    view: Title,
    bind: {
        count: earnModel.$collabs
    }
})

const Points = () => (
    <div className={styles.points}>
        <img src={points} alt={'points'} />
        <p  className={styles['points-value']}>PARTNERS</p>
        <p  className={styles['points-description']}>EARN DROPS</p>
    </div>
)

const List = React.memo<{
    list: EarnItem[]
}>(({ list }) => (
    <div className={styles['task-list-wrapper']}>
        <div className={styles['task-list']}>
            {list.map(item => (
                <TaskReflect key={item.name} {...item} />
            ))}
        </div>
    </div>
))

const ListReflect = reflect({
    view: List,
    bind: {
        list: earnModel.$list,
    }
})

const Task = React.memo<EarnItem & {
    onClick: (item: EarnItem) => void
}>(({ onClick, ...item }) => (
    <div className={styles.task} onTouchStart={() => {
        onClick(item)
        console.log('ON CLICK')
    }}>
        <img src={item.avatar} className={styles['task-label']} />
        <p className={styles['task-title']}>{item.name}</p>
        <img className={styles['task-bg']} src={taskBg} />
    </div>
))

const TaskReflect = reflect({
    view: Task,
    bind: {
        onClick: earnModel.taskSelected
    }
})

const Decorations = () => (
    <>
        <img src={background} className={styles.background} alt={'background'}/>
    </>
)