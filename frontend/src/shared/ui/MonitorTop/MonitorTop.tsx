import React from "react";
import graficTop from "@/shared/assets/images/main/grafic-top.svg";

import styles from './MonitorTop.module.scss'

export const MonitorTop = React.memo<{
    className: string
}>(({ className }) => (
    <div className={className}>
        <svg className={styles.main} width="321" height="199" viewBox="0 0 321 199" fill="none"
             xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <g filter="url(#filter0_f_24_4702)">
                <path d="M21 46.5L4 52.5L269 191.5L317 46.5L201.5 48L205.5 4H120L116.5 7.5L124.5 46.5H21Z"
                      fill="#060000" fillOpacity="0.25"/>
            </g>
            <path d="M117.5 8.5L130.5 79.5H149L141.5 20H180L175 79.5H193.5L199 8.5H117.5Z"
                  fill="url(#paint0_linear_24_4702)" stroke="#060000" strokeWidth="2"/>
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M57.6663 190.5H110L159 197.5L217.5 192L268.217 190.5L281.5 120L290 89L296.5 53.5H223L154 52L117.5 53.5L76.5 52L5.5 53.5L31.5 118L57.6663 190.5ZM21.8413 64.8119L65.8369 176.046L164.513 180.445L256.275 176.046L278.902 64.8119H21.8413Z"
                  fill="#37363A"/>
            <path id={"main"}
                  d="M65.8369 176.046L21.8413 64.8119H278.902L256.275 176.046L164.513 180.445L65.8369 176.046Z"
                  fill="#060000"/>
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M57.6663 190.5H110L159 197.5L217.5 192L268.217 190.5L281.5 120L290 89L296.5 53.5H223L154 52L117.5 53.5L76.5 52L5.5 53.5L31.5 118L57.6663 190.5ZM21.8413 64.8119L65.8369 176.046L164.513 180.445L256.275 176.046L278.902 64.8119H21.8413Z"
                  stroke="#060000" strokeWidth="2"/>
            <path d="M65.8369 176.046L21.8413 64.8119H278.902L256.275 176.046L164.513 180.445L65.8369 176.046Z"
                  stroke="#060000" strokeWidth="2"/>
            <circle cx="124.5" cy="13.5" r="2" fill="#5B5960"/>
            <circle cx="193.5" cy="13.5" r="2" fill="#5B5960"/>
            <circle cx="161.5" cy="13.5" r="2" fill="#5B5960"/>
            <defs>
                <filter id="filter0_f_24_4702" x="0" y="0" width="321" height="195.5" filterUnits="userSpaceOnUse"
                        colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                    <feGaussianBlur stdDeviation="2" result="effect1_foregroundBlur_24_4702"/>
                </filter>
                <linearGradient id="paint0_linear_24_4702" x1="158.25" y1="8.5" x2="156" y2="115"
                                gradientUnits="userSpaceOnUse">
                    <stop stopColor="#37363A"/>
                    <stop offset="1" stopColor="#9895A0"/>
                </linearGradient>
            </defs>
            <MonitorTopScreen/>
        </svg>
    </div>
))

const MonitorTopScreen = () => (
    <svg width="270" height="124" y="60" x="15" viewBox="0 0 273 127" fill="none"
         xmlns="http://www.w3.org/2000/svg">
        <path
            id={'path1'}
            d="M47.7103 120.859L27 63.5L1.5 3.5L62 1.5H128.5H204.5L271.5 3.5L262 61.5L249 123L151.353 125.5L47.7103 120.859Z"
            fill="#060000"/>
        <path
            id={'path2'}
            d="M47.7103 120.859L27 63.5L1.5 3.5L62 1.5H128.5H204.5L271.5 3.5L262 61.5L249 123L151.353 125.5L47.7103 120.859Z"
            fill="url(#paint0_linear_21_4613)"/>
        <path
            id={'path3'}
            d="M47.7103 120.859L27 63.5L1.5 3.5L62 1.5H128.5H204.5L271.5 3.5L262 61.5L249 123L151.353 125.5L47.7103 120.859Z"
            stroke="#060000" strokeWidth="2"/>
        <path
            id={'path4'}
            d="M47.7103 120.859L27 63.5L1.5 3.5L62 1.5H128.5H204.5L271.5 3.5L262 61.5L249 123L151.353 125.5L47.7103 120.859Z"
            stroke="#060000" strokeWidth="2"/>
        <path
            id={'path5'}
            d="M26.5 11.8757C26.7756 11.8144 26.8386 11.6206 27.0427 11.4536C27.8695 10.7771 29.6438 10.7763 30.6004 10.6847C31.5223 10.5965 33.5292 10.1669 34.4144 10.7149C35.1517 11.1714 34.7237 12.5854 35.8163 12.8103C37.5282 13.1627 47.5191 8.69218 47.9517 9.62949C48.9379 11.7663 49.6412 12.0296 52.037 11.6797C53.8122 11.4204 55.6125 10.6323 57.3886 10.5189C58.3908 10.4549 58.117 11.7821 59.0016 11.6948C60.8166 11.5155 62.6099 10.6144 64.3382 10.0968C66.4314 9.46991 67.2749 9.82886 68.6496 11.3933C70.5156 13.5165 72.2435 11.0792 74.348 10.9109C74.9852 10.8599 75.6848 11.7311 76.1268 12.0415C77.7814 13.2032 79.6664 13.5493 81.584 14.0465"
            stroke="#37363A" strokeWidth="3" strokeLinecap="round"/>
        <path
            id={'path6'}
            d="M24.5 19.0676C24.6951 19.0272 24.7397 18.8993 24.8842 18.7891C25.4696 18.3427 26.7258 18.3422 27.4031 18.2818C28.0559 18.2235 29.4767 17.9401 30.1034 18.3016C30.6255 18.6029 30.3225 19.5359 31.0961 19.6843C32.308 19.9169 39.3817 16.967 39.688 17.5854C40.3863 18.9954 40.8842 19.1692 42.5805 18.9383C43.8373 18.7672 45.1119 18.2471 46.3695 18.1723C47.079 18.1301 46.8851 19.0059 47.5115 18.9482C48.7965 18.8299 50.0662 18.2353 51.2898 17.8938C52.7718 17.4801 53.369 17.717 54.3424 18.7493C55.6635 20.1503 56.8868 18.5421 58.3768 18.431C58.828 18.3973 59.3233 18.9722 59.6363 19.177C60.8077 19.9436 62.1423 20.172 63.5 20.5"
            stroke="#37363A" strokeWidth="3" strokeLinecap="round"/>
        <defs>
            <linearGradient id="paint0_linear_21_4613" x1="136.5" y1="1.5" x2="136.5" y2="125.5"
                            gradientUnits="userSpaceOnUse">
                <stop stopColor="#060000"/>
                <stop offset="1" stopColor="#212020"/>
            </linearGradient>
        </defs>
        <clipPath id={'cp'}>
            <use href={'#path1'}/>
            <use href={'#path2'}/>
            <use href={'#path3'}/>
            <use href={'#path4'}/>
            <use href={'#path5'}/>
            <use href={'#path6'}/>
        </clipPath>
        <g clipPath={'url(#cp)'}>
            <image
                className={styles.graphic}
                href={graficTop}
            />
            <image
                className={styles.graphic}
                href={graficTop}
            />
        </g>
    </svg>
)