import React from "react";
import styles from "../styles/InputProgress.module.scss";

const InputProgress = ({ left, right, onChange }) => {
    return (
        <div className={styles.range}>
            <input
                className={styles.rangeinput}
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
