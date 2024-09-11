import React from "react";
import graphic from "@/shared/assets/images/main/graphic-center.svg";

import styles from './MonitorLeft.module.scss'

export const MonitorLeft = React.memo<{
    className: string
}>(({ className }) => (
    <div className={className}>
        <svg className={styles.main} width="187" height="250" viewBox="0 0 187 250" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M115.136 218.986L107.516 222.122V212.712L75.5107 225.259L93.0372 248L159.333 229.18L125.042 208.791L115.136 211.144V218.986Z"
                fill="url(#paint0_linear_25_5165)"/>
            <path d="M107.516 222.122L115.136 218.986V211.144V190.755H107.516V212.712V222.122Z"
                  fill="url(#paint1_linear_25_5165)"/>
            <path
                d="M115.136 218.986L107.516 222.122V212.712M115.136 218.986V190.755M115.136 218.986V211.144M115.136 190.755H107.516V212.712M115.136 190.755V211.144M107.516 212.712L75.5107 225.259L93.0372 248L159.333 229.18L125.042 208.791L115.136 211.144"
                stroke="#060000" strokeWidth="2"/>
            <g filter="url(#filter0_d_25_5165)">
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M6 18C58.4651 26.4724 164.317 44.9576 168.002 51.1193C171.687 57.2811 178.751 147.14 181.822 191.299C131.916 197.204 30.4155 209.63 23.659 212.095C15.2134 215.176 12.1423 162.801 6 18ZM156.485 61.9024C152.8 56.973 66.3989 41.8767 23.659 34.9448L25.9623 191.299C73.3089 189.502 168.002 184.521 168.002 178.975C168.002 172.043 161.092 68.0641 156.485 61.9024Z"
                      fill="#37363A"/>
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M6 18C58.4651 26.4724 164.317 44.9576 168.002 51.1193C171.687 57.2811 178.751 147.14 181.822 191.299C131.916 197.204 30.4155 209.63 23.659 212.095C15.2134 215.176 12.1423 162.801 6 18ZM156.485 61.9024C152.8 56.973 66.3989 41.8767 23.659 34.9448L25.9623 191.299C73.3089 189.502 168.002 184.521 168.002 178.975C168.002 172.043 161.092 68.0641 156.485 61.9024Z"
                      stroke="#060000" strokeWidth="2"/>
            </g>
            <path
                d="M110 190.125L110.279 193.312V197M110 190.125L111.891 190L114 190.125L113.734 190.718C112.756 192.902 111.6 195.003 110.279 197V197M110 190.125V190.125C108.76 190.043 107.519 190.28 106.396 190.812L106 191L108.109 194L110.279 197"
                stroke="#060000" strokeWidth="1.2"/>
            <defs>
                <filter id="filter0_d_25_5165" x="0.949219" y="0.817383" width="185.937" height="212.405"
                        filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                   result="hardAlpha"/>
                    <feOffset dy="-12"/>
                    <feGaussianBlur stdDeviation="2"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_25_5165"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_25_5165" result="shape"/>
                </filter>
                <linearGradient id="paint0_linear_25_5165" x1="127.388" y1="248.221" x2="126.05" y2="193.895"
                                gradientUnits="userSpaceOnUse">
                    <stop stopColor="#37363A"/>
                    <stop offset="1" stopColor="#9895A0"/>
                </linearGradient>
                <linearGradient id="paint1_linear_25_5165" x1="127.388" y1="248.221" x2="126.05" y2="193.895"
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
    <svg width="149" height="160" viewBox="0 0 149 160" fill="none" x={'22'} y={'33'} xmlns="http://www.w3.org/2000/svg">
        <path
            id={'path1-left'}
            d="M1.99902 2C44.9795 8.93399 131.867 24.0347 135.573 28.9655C140.206 35.1291 147.155 139.139 147.155 146.073C147.155 151.62 51.9284 156.602 4.31534 158.4L1.99902 2Z"
            fill="#D9D9D9"/>
        <path
            id={'path2-left'}
            d="M1.99902 2C44.9795 8.93399 131.867 24.0347 135.573 28.9655C140.206 35.1291 147.155 139.139 147.155 146.073C147.155 151.62 51.9284 156.602 4.31534 158.4L1.99902 2Z"
            fill="url(#paint0_linear_25_5257)"/>
        <path
            id={'path3-left'}
            d="M1.99902 2C44.9795 8.93399 131.867 24.0347 135.573 28.9655C140.206 35.1291 147.155 139.139 147.155 146.073C147.155 151.62 51.9284 156.602 4.31534 158.4L1.99902 2Z"
            stroke="#060000" strokeWidth="2"/>
        <path
            id={'path4-left'}
            d="M1.99902 2C44.9795 8.93399 131.867 24.0347 135.573 28.9655C140.206 35.1291 147.155 139.139 147.155 146.073C147.155 151.62 51.9284 156.602 4.31534 158.4L1.99902 2Z"
            stroke="#060000" strokeWidth="2"/>
        <path
            id={'path5-left'}
            d="M13.6212 12.5235C13.8802 12.5232 13.9906 12.3321 14.2172 12.2027C15.1347 11.6785 16.6906 12.0949 17.5553 12.2225C18.3888 12.3455 20.2706 12.361 20.8906 13.1512C21.407 13.8094 20.629 15.2108 21.5228 15.7066C22.9232 16.4834 32.956 14.0836 33.0683 15.1809C33.3243 17.6825 33.8659 18.1276 36.066 18.3192C37.6962 18.4611 39.4991 18.0472 41.0886 18.3444C41.9854 18.512 41.3673 19.8574 42.1678 19.9726C43.8102 20.2089 45.6391 19.6733 47.3017 19.5299C49.3155 19.3561 49.9527 19.9357 50.7124 21.9206C51.7435 24.6147 53.9527 22.432 55.8457 22.7479C56.4189 22.8436 56.7841 23.9335 57.0832 24.3671C58.2029 25.9901 59.757 26.8009 61.2965 27.7798"
            stroke="#37363A" strokeWidth="3" strokeLinecap="round"/>
        <path
            id={'path6-left'}
            d="M9.4938 20.1936C9.68174 20.1882 9.76563 20.0342 9.93256 19.9268C10.6086 19.4919 11.7288 19.7916 12.3535 19.8757C12.9556 19.9567 14.3203 19.9314 14.7542 20.5469C15.1157 21.0596 14.5233 22.1888 15.1617 22.5649C16.162 23.1541 23.4874 21.0463 23.5469 21.9161C23.6825 23.8988 24.0665 24.2417 25.6586 24.3498C26.8382 24.43 28.1543 24.065 29.3013 24.2693C29.9484 24.3846 29.4732 25.4661 30.0515 25.5416C31.2381 25.6965 32.5754 25.2343 33.7843 25.087C35.2485 24.9086 35.6992 25.3564 36.2105 26.9185C36.9045 29.0387 38.5506 27.26 39.9175 27.4732C40.3313 27.5377 40.5744 28.3965 40.7827 28.7351C41.5624 30.0024 42.6734 30.6156 43.7706 31.3626"
            stroke="#37363A" strokeWidth="3" strokeLinecap="round"/>
        <defs>
            <linearGradient id="paint0_linear_25_5257" x1="74.5768" y1="2" x2="119.181" y2="159.221"
                            gradientUnits="userSpaceOnUse">
                <stop stopColor="#060000"/>
                <stop offset="1" stopColor="#212020"/>
            </linearGradient>
        </defs>
        <clipPath id={'cp-left'}>
            <use href={'#path1-left'}/>
            <use href={'#path2-left'}/>
            <use href={'#path3-left'}/>
            <use href={'#path4-left'}/>
            <use href={'#path5-left'}/>
            <use href={'#path6-left'}/>
        </clipPath>
        <g clipPath={'url(#cp-left)'}>
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