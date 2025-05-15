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
                {/* {Math.floor(left / 60)}:{left % 60} / {Math.floor(right / 60)}:{right % 60} */}
                {left} / {right}
            </div>
        </div>
    );
};

export default TrackProgress;
