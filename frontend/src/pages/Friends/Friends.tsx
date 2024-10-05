import background from '@/shared/assets/images/frens/background.png'
import ponkes from '@/shared/assets/images/frens/ponkes.png'
import invite from '@/shared/assets/images/frens/invite.png'
import statistic from '@/shared/assets/images/frens/statistic.png'
import points from '@/shared/assets/images/frens/points.png'
import {useTelegram} from "@/shared/lib/hooks/useTelegram";

import styles from './Friends.module.scss'
import { LoaderTemplate } from '@/shared/ui/LoaderTemplate'
import { toFormattedNumber } from '@/shared/lib/number'
import React from 'react'
import { reflect } from '@effector/reflect'
import { friendsModel } from '@/entities/friends/model'

export const Friends = () => {
    const { isLoading } = friendsModel.useFetchGate()

    return (
        <div className={styles.root}>
            <TitleReflect />
            <Main isLoading={isLoading} />
            <Decorations />
        </div>
    )
}

const Main = React.memo<{
    isLoading: boolean
}>(({ isLoading }) => (
    <LoaderTemplate className={styles.main} isLoading={isLoading}>
        <PointsReflect />
        <StatisticReflect />
        <InviteButtonReflect />
        <img src={ponkes} className={styles.ponkes} alt={'decoration'}/>
    </LoaderTemplate>
))

const Title = React.memo<{
    count: number
}>(({ count }) => (
    <>
        <h2 className={styles.title}>{count} FRIENDS</h2>
        <h2 className={styles.title}>{count} FRIENDS</h2>
    </>
))

const TitleReflect = reflect({
    view: Title,
    bind: {
        count: friendsModel.$data.map(state => state.friends)
    }
})

const Points = React.memo<{
    count: number
}>(({ count }) => (
    <div className={styles.points}>
        <img src={points} alt={'points'} />
        <p className={styles['points-value']}>{count}</p>
        <p className={styles['points-description']}>EARN POINTS</p>
    </div>
))

const PointsReflect = reflect({
    view: Points,
    bind: {
        count: friendsModel.$data.map(state => state.points)
    }
})

const Statistic = React.memo<{
    tg: number,
    premium: number
}>(({ tg, premium }) => (
    <div className={styles.statistic}>
        <img src={statistic} className={styles['statistic-bg']} />
        <p className={styles['tg-users']}>{toFormattedNumber(tg)}</p>
        <p className={styles['premium-users']}>{toFormattedNumber(premium)}</p>
    </div>
))

const StatisticReflect = reflect({
    view: Statistic,
    bind: {
        tg: friendsModel.$data.map(state => state.tg),
        premium: friendsModel.$data.map(state => state.premium),
    }
})

const InviteButton = React.memo<{
    link: string
}>(({ link }) => {
    const { sendInviteLink } = useTelegram()

    return (
        <div
            onTouchStart={() => sendInviteLink(link)}>
            <img
                src={invite}
                className={styles['invite-button']}
                alt={'invite button'}
            />
        </div>
    )
})

const InviteButtonReflect = reflect({
    view: InviteButton,
    bind: {
        link: friendsModel.$data.map(state => state.link)
    }
})

const Decorations = () => (
    <>
        <img src={background} className={styles.background} alt={'background'}/>
    </>
)