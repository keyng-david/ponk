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
            <div
      className={styles.root}
      style={{
        background:
          'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)',
      }}
    >
      <Title />
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

const Title = () => (
  <h2
    className="text-4xl text-center mt-4"
    style={{
      background: 'linear-gradient(115deg, #62cff4, #2c67f2)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
    }}
  >
    EARN
  </h2>
);

const TitleReflect = reflect({
    view: Title,
    bind: {
        count: earnModel.$collabs
    }
})

const Points = () => (
    <div className={styles.points}>
        <img src={points} alt={'points'} />
        <p className={styles['points-value']}>PARTNERS</p>
        <p className={styles['points-description']}>EARN DROPS</p>
    </div>
)

// Fixed List component with task completion logic
const List = React.memo<{
    list: EarnItem[],
    onTaskClick: (item: EarnItem) => void
}>(({ list, onTaskClick }) => {

    // Helper function to determine if a task is done
    const isTaskDone = (item: EarnItem) => {
        return item.isDone === 'done';
    };

    // Handle task click, triggering only if the task is not done
    const handleTaskClick = (item: EarnItem) => {
        let touchStartTime: number;

        const onTouchStart = () => {
            touchStartTime = Date.now();
        };

        const onTouchEnd = () => {
            const touchDuration = Date.now() - touchStartTime;

            // Treat as click if touch is short enough and task is not done
            if (touchDuration < 150 && !isTaskDone(item)) {
                onTaskClick(item);
            }
        };

        return { onTouchStart, onTouchEnd };
    };

    return (
        <div className={styles['task-list-wrapper']}>
            <div className={styles['task-list']}>
                {list.map(item => {
                    const { onTouchStart, onTouchEnd } = handleTaskClick(item);
                    return (
                        <div
                            key={item.name}
                            className={`${styles.task} ${isTaskDone(item) ? styles.completed : ''}`}
                            onTouchStart={onTouchStart}
                            onTouchEnd={onTouchEnd}
                        >
                            <TaskReflect {...item} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
});

const ListReflect = reflect({
    view: List,
    bind: {
        list: earnModel.$list,
        onTaskClick: earnModel.taskSelected
    }
})

const Task = React.memo<EarnItem & {
    onClick: (item: EarnItem) => void
}>(({ onClick, ...item }) => (
    <div className={styles.task}>
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