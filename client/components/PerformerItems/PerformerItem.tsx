import React from "react";

interface PerformerItemProps {
    artist: string;
}

const PerformerItem: React.FC<PerformerItemProps> = ({ artist }) => {
    return <div>{artist}</div>;
};

export default PerformerItem;
