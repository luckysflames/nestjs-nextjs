import React from "react";

interface TrackProgressProps {
    left: number;
    right: number;
    onChange: (e) => void;
}

const TrackProgress: React.FC<TrackProgressProps> = ({ left, right, onChange }) => {
    return (
        <div style={{ display: "flex" }}>
            <input type="range" min={0} max={right} value={left} onChange={onChange} />
            <div>
                {String(Math.floor(left / 60)).padStart(2, "0")}:
                {String(left % 60).padStart(2, "0")} /{" "}
                {String(Math.floor(right / 60)).padStart(2, "0")}:
                {String(right % 60).padStart(2, "0")}
            </div>
        </div>
    );
};

export default TrackProgress;
