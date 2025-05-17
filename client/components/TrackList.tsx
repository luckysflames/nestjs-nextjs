import React from "react";
import { ITrack } from "../types/track";
import TrackItem from "./TrackItem";
import styles from "../styles/TrackList.module.scss";

interface TrackListProps {
    tracks: ITrack[];
}

const TrackList: React.FC<TrackListProps> = ({ tracks }) => {
    return (
        <div className={styles.list}>
            {tracks.map((track) => (
                <TrackItem key={track._id} track={track} />
            ))}
        </div>
    );
};

export default TrackList;
