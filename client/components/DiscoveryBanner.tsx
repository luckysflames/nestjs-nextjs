import React from "react";
import styles from "../styles/DiscoveryBanner.module.scss";

const DiscoveryBanner = () => {
    return (
        <div className={styles.container}>
            <div className={styles.textContainer}>
                <span className={styles.title}>Открой для себя мир музыки</span>
                <span className={styles.text}>
                    Будь ты страстным меломаном, начинающим исполнителем или просто ищешь новые
                    треки — наша платформа предлагает удобный и простой способ погрузиться в музыку
                </span>
            </div>
            <div className={styles.buttons}>
                <div className={styles.getStarted}>
                    <span>Get Started</span>
                    <img className={styles.arrow} src="/icons/rightArrow.svg" />
                </div>
                <div className={styles.learnMore}>Learn More</div>
            </div>
        </div>
    );
};

export default DiscoveryBanner;
