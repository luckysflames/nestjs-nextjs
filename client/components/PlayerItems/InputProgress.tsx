import React from "react";
import styles from "../../styles/InputProgress.module.scss";

const InputProgress = ({ left, right, onChange }) => {
    const progressWidth = right > 0 ? `${(left / right) * 100}%` : "0%";

    return (
        <div className={styles.wrapper}>
            <div className={styles.progressBar} style={{ width: progressWidth }}></div>
            <input
                className={styles.rangeInput}
                type="range"
                min="0"
                max={right}
                value={left}
                onChange={onChange}
            />
        </div>
    );
};

export default InputProgress;
