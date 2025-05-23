import React from "react";
import styles from "../../styles/AnimatedPlayIcon.module.scss";

const AnimatedPlayIcon = () => {
    return (
        <div className={styles.equalizer}>
            <div className={styles.bar} />
            <div className={styles.bar} />
            <div className={styles.bar} />
            <div className={styles.bar} />
        </div>
    );
};

export default AnimatedPlayIcon;
