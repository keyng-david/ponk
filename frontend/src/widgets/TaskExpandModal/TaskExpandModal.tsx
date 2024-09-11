import React, { useMemo } from 'react'

import { EarnItem } from '@/entities/earn/model/types'

import taskInfoBg from '@/shared/assets/images/earn/task_info.png'
import itemBg from '@/shared/assets/images/earn/task-list-bg.png'
import joinButton from '@/shared/assets/images/earn/join-button.png'

import styles from './TaskExpandModal.module.scss'
import { toFormattedNumber } from '@/shared/lib/number'
import { useTelegram } from '@/shared/lib/hooks/useTelegram'
import {earnModel} from "@/entities/earn/model";

export type TaskExpandModalProps = {
    data: EarnItem | null
    onClose: () => void
}

export const TaskExpandModal = React.memo<TaskExpandModalProps>(
    ({ data, onClose }) => {
        const { openLink } = useTelegram()

        const rootClasses = useMemo(() => {
            const classes = [styles.root]

            if (!!data) {
                classes.push(styles['is-active'])
            }

            return classes.join(' ')
        }, [data])

        const timeBlocks = useMemo(() => {
            function toView(v: number) {
                if (v < 10) {
                    return `0${v}`
                }

                return `${v}`
            }

            if (data?.time) {
                const days = Math.floor(data.time / (1000 * 60 * 60 * 24));
                const hours = Math.floor((data.time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((data.time % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((data.time % (1000 * 60)) / 1000);

                return {
                    days: toView(days),
                    hours: toView(hours),
                    minutes: toView(minutes),
                    seconds: toView(seconds)
                }
            }

            return {
                days: '00',
                hours: '00',
                minutes: '00',
                seconds: '00'
            }
        }, [data])

        return (
            <div className={rootClasses}>
                <div className={styles.background} />
                <div className={styles.container} >
                    <button className={styles['close-button']} onClick={onClose}>
                        x
                    </button>
                    <div className={styles.header}>
                        <img className={styles['section-background']} src={taskInfoBg} alt='background' />
                        <img className={styles.avatar} src={data?.avatar} />
                        <h2>{data?.name}</h2>
                        <p>{data?.amount}</p>
                    </div>
                    <div className={styles.info}>
                        <img className={styles['section-background']} src={taskInfoBg} alt='background' />
                        <p>{data?.description}</p>
                    </div>
                    <p className={styles.timer}>
                        TIME - {timeBlocks.days}D {timeBlocks.hours}:{timeBlocks.minutes}:{timeBlocks.seconds}
                    </p>
                    <div className={styles.tasks}>
                        <img className={styles['section-background']} src={itemBg} alt='background' />
                        <p>TASK LIST:</p>
                        {data?.tasks.map((item, key) => <p key={key}>{key + 1} {item}</p>)}
                    </div>
                    <img 
                        className={styles['join-button']} 
                        src={joinButton} 
                        alt='join button' 
                        onClick={
                            data?.link && data.id
                                ? () => earnModel.taskJoinedFx({
                                    id: data.id,
                                    link: data.link,
                                })
                                : () => 0
                        }
                    />
                    <p className={styles.participants}>
                        PARTICIPANTS:
                        <br />
                        {toFormattedNumber(data?.participants ?? 0)}
                    </p>
                </div>
            </div>
        )
    }
)