import React from "react";
import graphic from "@/shared/assets/images/main/graphic-center.svg";

import styles from './MonitorRight.module.scss'

export const MonitorRight = React.memo<{
    className: string
}>(({ className }) => (
    <div className={className}>
        <svg className={styles.main} width="202" height="251" viewBox="0 0 202 251" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M68.4987 219.986L76.0833 223.122V213.712L107.938 226.259L90.494 249L24.5082 230.18L54.1245 209L68.4987 212.144V219.986Z"
                fill="url(#paint0_linear_25_4897)"/>
            <path d="M76.0833 223.122L68.4987 219.986V212.144V191.755H76.0833V213.712V223.122Z"
                  fill="url(#paint1_linear_25_4897)"/>
            <path
                d="M68.4987 219.986L76.0833 223.122V213.712M68.4987 219.986V191.755M68.4987 219.986V212.144M68.4987 191.755H76.0833V213.712M68.4987 191.755V212.144M76.0833 213.712L107.938 226.259L90.494 249L24.5082 230.18L54.1245 209L68.4987 212.144"
                stroke="#060000" strokeWidth="2"/>
            <g filter="url(#filter0_d_25_4897)">
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M177.125 19C124.905 27.4724 5.79312 39.8383 2.125 46C-1.54312 52.1617 5.18177 148.14 2.125 192.299C51.7975 198.204 152.824 210.63 159.549 213.095C167.955 216.176 171.011 163.801 177.125 19ZM27.3433 62.9024C31.0115 57.973 117.009 42.8767 159.549 35.9448L157.256 192.299C110.131 190.502 15.8804 185.521 15.8804 179.975C15.8804 173.043 22.7582 69.0641 27.3433 62.9024Z"
                      fill="#37363A"/>
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M177.125 19C124.905 27.4724 5.79312 39.8383 2.125 46C-1.54312 52.1617 5.18177 148.14 2.125 192.299C51.7975 198.204 152.824 210.63 159.549 213.095C167.955 216.176 171.011 163.801 177.125 19ZM27.3433 62.9024C31.0115 57.973 117.009 42.8767 159.549 35.9448L157.256 192.299C110.131 190.502 15.8804 185.521 15.8804 179.975C15.8804 173.043 22.7582 69.0641 27.3433 62.9024Z"
                      stroke="#060000" strokeWidth="2"/>
            </g>
            <path
                d="M72.125 191.125L71.8459 194.312V198M72.125 191.125L70.2335 191L68.125 191.125L68.3905 191.718C69.3695 193.902 70.5251 196.003 71.8459 198V198M72.125 191.125V191.125C73.3654 191.043 74.6061 191.28 75.7292 191.812L76.125 192L74.0165 195L71.8459 198"
                stroke="#060000" strokeWidth="1.2"/>
            <defs>
                <filter id="filter0_d_25_4897" x="-0.00195312" y="0.816406" width="201.178" height="213.406"
                        filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                   result="hardAlpha"/>
                    <feOffset dx="19" dy="-13"/>
                    <feGaussianBlur stdDeviation="2"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_25_4897"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_25_4897" result="shape"/>
                </filter>
                <linearGradient id="paint0_linear_25_4897" x1="56.3042" y1="249.221" x2="57.6482" y2="194.895"
                                gradientUnits="userSpaceOnUse">
                    <stop stopColor="#37363A"/>
                    <stop offset="1" stopColor="#9895A0"/>
                </linearGradient>
                <linearGradient id="paint1_linear_25_4897" x1="56.3042" y1="249.221" x2="57.6482" y2="194.895"
                                gradientUnits="userSpaceOnUse">
                    <stop stopColor="#37363A"/>
                    <stop offset="1" stopColor="#9895A0"/>
                </linearGradient>
            </defs>
            <Screen />
        </svg>
    </div>
))

const Screen = () => (
    <svg width="151" height="160" viewBox="0 0 151 160" y={'33'} x={'10'} fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            id={'path1-right'}
            d="M149.301 2C106.521 8.93399 6.28609 16.7136 2.59732 21.6445C-2.01364 27.808 4.82405 139.139 4.82405 146.073C4.82405 151.62 99.6049 156.602 146.995 158.4L149.301 2Z"
            fill="#D9D9D9"/>
        <path
            id={'path2-right'}
            d="M149.301 2C106.521 8.93399 6.28609 16.7136 2.59732 21.6445C-2.01364 27.808 4.82405 139.139 4.82405 146.073C4.82405 151.62 99.6049 156.602 146.995 158.4L149.301 2Z"
            fill="url(#paint0_linear_25_4989)"/>
        <path
            id={'path3-right'}
            d="M149.301 2C106.521 8.93399 6.28609 16.7136 2.59732 21.6445C-2.01364 27.808 4.82405 139.139 4.82405 146.073C4.82405 151.62 99.6049 156.602 146.995 158.4L149.301 2Z"
            stroke="#060000" strokeWidth="2"/>
        <path
            id={'path4-right'}
            d="M79.2958 22.015C79.5372 21.9209 79.5709 21.7028 79.7352 21.5001C80.4006 20.6793 82.0016 20.5039 82.8539 20.3097C83.6753 20.1225 85.435 19.4555 86.2991 19.9675C87.0189 20.394 86.8011 21.982 87.8139 22.1205C89.4005 22.3375 97.8832 16.4672 98.3853 17.4494C99.5298 19.6885 100.196 19.9073 102.316 19.289C103.887 18.8309 105.418 17.7922 107.007 17.4936C107.903 17.3251 107.815 18.803 108.602 18.6205C110.219 18.246 111.73 17.0845 113.228 16.3486C115.042 15.4573 115.846 15.7668 117.272 17.3419C119.209 19.4798 120.478 16.6451 122.357 16.2541C122.926 16.1357 123.661 17.0193 124.097 17.3152C125.728 18.4226 127.47 18.6155 129.26 18.9705"
            stroke="#37363A" strokeWidth="3" strokeLinecap="round"/>
        <path
            id={'path5-right'}
            d="M78.2265 30.6594C78.3997 30.5863 78.4221 30.4123 78.5388 30.2517C79.0115 29.6016 80.1642 29.4752 80.777 29.3274C81.3675 29.1849 82.6305 28.6671 83.2578 29.0836C83.7804 29.4307 83.6371 30.6977 84.3684 30.8171C85.5142 31.0041 91.5791 26.3865 91.9495 27.1757C92.7939 28.9747 93.276 29.1553 94.7992 28.6795C95.9278 28.327 97.0223 27.5102 98.1655 27.2853C98.8105 27.1584 98.7591 28.3386 99.3255 28.1995C100.488 27.9142 101.567 26.9991 102.64 26.424C103.941 25.7274 104.523 25.9817 105.565 27.2526C106.98 28.9775 107.87 26.7234 109.221 26.4271C109.63 26.3374 110.168 27.0498 110.485 27.29C111.671 28.1889 112.928 28.3581 114.221 28.6572"
            stroke="#37363A" strokeWidth="3" strokeLinecap="round"/>
        <defs>
            <linearGradient id="paint0_linear_25_4989" x1="77.0624" y1="2" x2="32.2803" y2="159.111"
                            gradientUnits="userSpaceOnUse">
                <stop stopColor="#060000"/>
                <stop offset="1" stopColor="#212020"/>
            </linearGradient>
        </defs>
        <clipPath id={'cp-right'}>
            <use href={'#path1-right'}/>
            <use href={'#path2-right'}/>
            <use href={'#path3-right'}/>
            <use href={'#path4-right'}/>
            <use href={'#path5-right'}/>
        </clipPath>
        <g clipPath={'url(#cp-right)'}>
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