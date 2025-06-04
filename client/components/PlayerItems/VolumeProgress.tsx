import React, { useState } from "react";
import styles from "../../styles/VolumeProgress.module.scss";

interface VolumeProgressProps {
    left: number;
    right: number;
    onChange: (e) => void;
    mute: (e) => void;
}

const VolumeProgress: React.FC<VolumeProgressProps> = ({ left, right, onChange, mute }) => {
    const getVolumeIcon = () => {
        if (left === 0) return "/icons/muted.svg";
        if (left <= 33) return "/icons/verySmallVolume.svg";
        if (left <= 66) return "/icons/smallVolume.svg";
        return "/icons/loudVolume.svg";
    };

    return (
        <div className={styles.rangeWrap}>
            <div className={styles.containerImg}>
                <img src={getVolumeIcon()} alt="muted" onClick={mute} />
            </div>
            <input
                className={styles.range}
                type="range"
                min={0}
                max={right}
                value={left}
                onChange={onChange}
            />
        </div>
    );
};

export default VolumeProgress;
