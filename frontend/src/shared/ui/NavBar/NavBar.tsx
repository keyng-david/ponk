import styles from './NavBar.module.scss'
import React, {useCallback} from "react";
import {Steps, useNavigatorModel} from "@/shared/model";
import {leadersModel} from "@/entities/leaders/model";
import {earnModel} from "@/entities/earn/model";

export const NavBar = () => {
    const { step, stepChanged } = useNavigatorModel()

    const getClasses = useCallback((page: Steps) => {
        const classes = [
            styles.item,
            styles[`item-${page}`],
        ]

        if (page === step) {
            classes.push(styles['is-active'])
        }

        return classes.join(' ')
    }, [step])

    return (
<div class="fixed z-50 w-11/12 h-16 max-w-lg -translate-x-1/2 bg-[#141414] border border-gray-200 rounded-full bottom-6 left-1/2 shadow-lg dark:border-gray-600">
        <div class="grid h-full max-w-lg grid-cols-5 mx-auto">
            <button onClick={() => stepChanged(Steps.HOME)} data-tooltip-target="tooltip-home" type="button" class="inline-flex flex-col items-center justify-center px-5 rounded-s-full hover:bg-gray-50 dark:hover:bg-gray-800 group">
                <svg class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-[#38afed]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
                </svg>
                <span class="sr-only">Home</span>
            </button>
            
            <button onClick={() => stepChanged(Steps.LEADERBOARD)} data-tooltip-target="tooltip-wallet" type="button" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-[#38afed]">
                    <path fill-rule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 0 0-.584.859 6.753 6.753 0 0 0 6.138 5.6 6.73 6.73 0 0 0 2.743 1.346A6.707 6.707 0 0 1 9.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 0 0-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 0 1-1.112-3.173 6.73 6.73 0 0 0 2.743-1.347 6.753 6.753 0 0 0 6.139-5.6.75.75 0 0 0-.585-.858 47.077 47.077 0 0 0-3.07-.543V2.62a.75.75 0 0 0-.658-.744 49.22 49.22 0 0 0-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 0 0-.657.744Zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 0 1 3.16 5.337a45.6 45.6 0 0 1 2.006-.343v.256Zm13.5 0v-.256c.674.1 1.343.214 2.006.343a5.265 5.265 0 0 1-2.863 3.207 6.72 6.72 0 0 0 .857-3.294Z" clip-rule="evenodd" />
                </svg>
                <span class="sr-only">Leader</span>
            </button>

            <div class="flex items-center justify-center">
                <button onClick={() => stepChanged(Steps.EARN)} data-tooltip-target="tooltip-new" type="button" class="inline-flex items-center justify-center w-10 h-10 font-medium bg-[#38afed] rounded-full hover:bg-[#38afed] group focus:ring-4 focus:ring-[#38afed] focus:outline-none dark:focus:ring-[#38afed]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span class="sr-only">Earn</span>
                </button>
            </div>

            <button onClick={() => stepChanged(Steps.FRIENDS)} data-tooltip-target="tooltip-settings" type="button" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-[#38afed]">
                    <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
                </svg>
                <span class="sr-only">Friends</span>
            </button>

            <button onClick={() => alert('Coming Soon!')} class="inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-gray-50 dark:hover:bg-gray-800 group">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-5 h-5 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-[#38afed]" fill="currentColor">
                    <path d="M383.5 192c.3-5.3 .5-10.6 .5-16c0-51-15.9-96-40.2-127.6C319.5 16.9 288.2 0 256 0s-63.5 16.9-87.8 48.4C143.9 80 128 125 128 176c0 5.4 .2 10.7 .5 16L240 192l0 128-32 0c-7 0-13.7 1.5-19.7 4.2L68.2 192l28.3 0c-.3-5.3-.5-10.6-.5-16c0-64 22.2-121.2 57.1-159.3C62 49.3 18.6 122.6 4.2 173.6C1.5 183.1 9 192 18.9 192l6 0L165.2 346.3c-3.3 6.5-5.2 13.9-5.2 21.7l0 96c0 26.5 21.5 48 48 48l96 0c26.5 0 48-21.5 48-48l0-96c0-7.8-1.9-15.2-5.2-21.7L487.1 192l6 0c9.9 0 17.4-8.9 14.7-18.4C493.4 122.6 450 49.3 358.9 16.7C393.8 54.8 416 112.1 416 176c0 5.4-.2 10.7-.5 16l28.3 0L323.7 324.2c-6-2.7-12.7-4.2-19.7-4.2l-32 0 0-128 111.5 0z"/>
              </svg>
                <span class="sr-only">Coming Soon</span>
            </button>
        </div>
    </div>
</div>

