import React, { useCallback, useMemo } from "react"

import styles from './LoaderTemplate.module.scss'

export type LoaderTemplateProps = React.PropsWithChildren<{
    isLoading: boolean
    className: string
}>

export const LoaderTemplate = React.memo<LoaderTemplateProps>(({ isLoading, children, className }) => {
    const loaderClass = useMemo(() => {
        const classes = [
            styles.loader,
        ]

        if (isLoading) {
            classes.push(styles['is-showing'])
        }
        
        return classes.join(' ')
    }, [isLoading])
    
    const contentClass = useMemo(() => {
        const classes = [
            styles.content,
        ]

        if (!isLoading) {
            classes.push(styles['is-showing'])
        }
        
        return classes.join(' ')
    }, [isLoading])
    
    return (
        <div className={[styles.root, className].join(' ')}>
            <div className={contentClass}>
                {children}
            </div>
            <div className={loaderClass}>
                <Loader />
            </div>
        </div>
    )
})

const Loader = () => {
    const currentColor = 'rgba(255, 255, 255, 1)'

    const gradientsId = {
        a: `spinner-a`,
        b: `spinner-b`,
    }

    return (
        <svg
            viewBox="0 0 200 200"
            fill="none"
            // @ts-ignore
            xmlns="http://www.w3.org/2000/svg"
            className={styles.svg}>
            <defs>
                <linearGradient id={gradientsId.a}>
                    <stop
                        offset="0%"
                        stopOpacity={0}
                        stopColor={currentColor}
                    />
                    <stop
                        offset="100%"
                        stopOpacity={0.5}
                        stopColor={currentColor}
                    />
                </linearGradient>
                <linearGradient id={gradientsId.b}>
                    <stop offset="0%" stopColor={currentColor} />
                    <stop
                        offset="100%"
                        stopOpacity={0.5}
                        stopColor={currentColor}
                    />
                </linearGradient>
            </defs>
            <g>
                <path
                    stroke={`url(#${gradientsId.a})`}
                    strokeWidth="15"
                    d="M15 100a85 85 0 0 1 170 0"
                    fill="none"
                />
                <path
                    stroke={`url(#${gradientsId.b})`}
                    strokeWidth="15"
                    d="M185 100a85 85 0 0 1-170 0"
                    fill="none"
                />
            </g>
        </svg>
    )
}