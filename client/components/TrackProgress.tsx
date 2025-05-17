import React from "react";
import InputProgress from "./InputProgress";

interface TrackProgressProps {
    left: number;
    right: number;
    onChange: (e) => void;
}

const TrackProgress: React.FC<TrackProgressProps> = ({ left, right, onChange }) => {
    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <InputProgress left={left} right={right} onChange={onChange} />
            <div style={{ marginLeft: "auto" }}>
                {String(Math.floor(left / 60)).padStart(2, "0")}:
                {String(left % 60).padStart(2, "0")} /{" "}
                {String(Math.floor(right / 60)).padStart(2, "0")}:
                {String(right % 60).padStart(2, "0")}
            </div>
        </div>
    );
};

export default TrackProgress;
