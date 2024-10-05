import React from "react";
import graphic from "@/shared/assets/images/main/graphic-center.svg";

import styles from './MonitorCenter.module.scss'

export const MonitorCenter = React.memo<{
    className: string
}>(({ className }) => (
    <div className={className}>
        <svg className={styles.main} width="231" height="189" viewBox="0 0 231 189" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path
                d="M121.37 136.698H109.572V160.989C100.133 160.989 88.5198 164.69 83.8931 166.541C58.9086 180.421 85.9751 185.742 102.631 186.667C119.982 188.518 156.764 189.582 165.093 179.033C173.421 168.484 139.414 162.608 121.37 160.989V136.698Z"
                fill="url(#paint0_linear_16_4064)"/>
            <path
                d="M109.572 172.093V160.989M121.37 168.623V160.989M121.37 160.989V136.698H109.572V160.989M121.37 160.989C139.414 162.608 173.421 168.484 165.093 179.033C156.764 189.582 119.982 188.518 102.631 186.667C85.9751 185.742 58.9086 180.421 83.8931 166.541C88.5198 164.69 100.133 160.989 109.572 160.989"
                stroke="#060000" strokeWidth="2"/>
            <g filter="url(#filter0_d_16_4064)">
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M15.8803 158L2 15.2461L108.318 12L210.204 13.1641L219.818 152.309C154.35 151.384 29.7605 151.337 15.8803 158ZM26.2905 132.534L15.8803 27.7383C26.9845 24.4071 139.103 26.3503 195.318 27.7383C206.978 40.2531 206.049 99.0959 205.818 126.5C183.054 124.279 78.8041 129.296 26.2905 132.534Z"
                      fill="#37363A"/>
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M15.8803 158L2 15.2461L108.318 12L210.204 13.1641L219.818 152.309C154.35 151.384 29.7605 151.337 15.8803 158ZM26.2905 132.534L15.8803 27.7383C26.9845 24.4071 139.103 26.3503 195.318 27.7383C206.978 40.2531 206.049 99.0959 205.818 126.5C183.054 124.279 78.8041 129.296 26.2905 132.534Z"
                      stroke="#060000" strokeWidth="2"/>
            </g>
            <path
                d="M115.818 143.125L115.539 146.312V150M115.818 143.125L113.927 143L111.818 143.125L112.084 143.718C113.063 145.902 114.218 148.003 115.539 150V150M115.818 143.125L117.71 143L119.818 143.125V143.125C118.416 144.87 117.197 146.755 116.178 148.749L115.539 150"
                stroke="#060000" strokeWidth="1.2"/>
            <defs>
                <filter id="filter0_d_16_4064" x="0.901367" y="-0.000244141" width="229.989" height="159.521"
                        filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                   result="hardAlpha"/>
                    <feOffset dx="6" dy="-7"/>
                    <feGaussianBlur stdDeviation="2"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_16_4064"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_16_4064" result="shape"/>
                </filter>
                <linearGradient id="paint0_linear_16_4064" x1="131.086" y1="188.055" x2="130.119" y2="139.494"
                                gradientUnits="userSpaceOnUse">
                    <stop stopColor="#37363A"/>
                    <stop offset="1" stopColor="#9895A0"/>
                </linearGradient>
            </defs>
            <MonitorCenterScreen/>
        </svg>
    </div>
))

const MonitorCenterScreen = () => (
    <svg width="196" height="122" y="22" x="12" viewBox="0 0 200 125" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            id={'path1-center'}
            d="M2 4.20359L14.5 123.289C69.0401 119.918 174.358 116.477 198 118.789C198.24 90.2631 199.109 14.816 187 1.789C128.616 0.34416 13.5327 0.735979 2 4.20359Z"
            fill="url(#paint0_linear_25_4716)" stroke="#060000" strokeWidth="2"/>
        <path
            id={'path2-center'}
            d="M2 4.20359L14.5 123.289C69.0401 119.918 174.358 116.477 198 118.789C198.24 90.2631 199.109 14.816 187 1.789C128.616 0.34416 13.5327 0.735979 2 4.20359Z"
            stroke="#060000" strokeWidth="2"/>
        <path
            id={'path3-center'}
            d="M127 16.3757C127.276 16.3144 127.339 16.1206 127.543 15.9536C128.369 15.2771 130.144 15.2763 131.1 15.1847C132.022 15.0965 134.029 14.6669 134.914 15.2149C135.652 15.6714 135.224 17.0854 136.316 17.3103C138.028 17.6627 148.019 13.1922 148.452 14.1295C149.438 16.2663 150.141 16.5296 152.537 16.1797C154.312 15.9204 156.112 15.1323 157.889 15.0189C158.891 14.9549 158.617 16.2821 159.502 16.1948C161.317 16.0155 163.11 15.1144 164.838 14.5968C166.931 13.9699 167.775 14.3289 169.15 15.8933C171.016 18.0165 172.743 15.5792 174.848 15.4109C175.485 15.3599 176.185 16.2311 176.627 16.5415C178.281 17.7032 180.166 18.0493 182.084 18.5465"
            stroke="#37363A" strokeWidth="3" strokeLinecap="round"/>
        <path
            id={'path4-center'}
            d="M145 25.5676C145.195 25.5272 145.24 25.3993 145.384 25.2891C145.97 24.8427 147.226 24.8422 147.903 24.7818C148.556 24.7235 149.977 24.4401 150.603 24.8016C151.126 25.1029 150.822 26.0359 151.596 26.1843C152.808 26.4169 159.882 23.467 160.188 24.0854C160.886 25.4954 161.384 25.6692 163.08 25.4383C164.337 25.2672 165.612 24.7471 166.869 24.6723C167.579 24.6301 167.385 25.5059 168.011 25.4482C169.297 25.3299 170.566 24.7353 171.79 24.3938C173.272 23.9801 173.869 24.217 174.842 25.2493C176.163 26.6503 177.387 25.0421 178.877 24.931C179.328 24.8973 179.823 25.4722 180.136 25.677C181.308 26.4436 182.642 26.672 184 27"
            stroke="#37363A" strokeWidth="3" strokeLinecap="round"/>
        <defs>
            <linearGradient id="paint0_linear_25_4716" x1="104" y1="2.28894" x2="104" y2="113.289"
                            gradientUnits="userSpaceOnUse">
                <stop stopColor="#060000"/>
                <stop offset="1" stopColor="#212020"/>
            </linearGradient>
        </defs>
        <clipPath id={'cp-center'}>
            <use href={'#path1-center'}/>
            <use href={'#path2-center'}/>
            <use href={'#path3-center'}/>
            <use href={'#path4-center'}/>
        </clipPath>
        <g clipPath={'url(#cp-center)'}>
            <image
                className={styles.graphic}
                href={graphic}
            />
            <image
                className={styles.graphic}
                href={graphic}
            />
        </g>
    </svg>

)