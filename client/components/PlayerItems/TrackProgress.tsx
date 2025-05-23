import React from "react";
import InputProgress from "./InputProgress";
import styles from "../../styles/TrackProgress.module.scss";

interface TrackProgressProps {
    left: number;
    right: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TrackProgress: React.FC<TrackProgressProps> = ({ left, right, onChange }) => {
    return (
        <div className={styles.container}>
            <InputProgress left={left} right={right} onChange={onChange} />
        </div>
    );
};

export default TrackProgress;
