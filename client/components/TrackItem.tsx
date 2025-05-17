import React, { useEffect, useState } from "react";
import { ITrack } from "../types/track";
import styles from "../styles/TrackItem.module.scss";
import { useRouter } from "next/router";
import { useActions } from "../hooks/useActions";
import { useDispatch } from "react-redux";
import { deleteTrack } from "../store/actions-creators/track";
import { NextThunkDispatch } from "../store";
import { useTypedSelector } from "../hooks/useTypedSelector";
import AnimatedPlayIcon from "./AnimatedPlayIcon";

interface TrackItemProps {
    track: ITrack;
}

const TrackItem: React.FC<TrackItemProps> = ({ track }) => {
    const router = useRouter();
    const { pause, active, duration } = useTypedSelector((state) => state.player);
    const { pauseTrack, playTrack, setActiveTrack } = useActions();
    const dispatch = useDispatch() as NextThunkDispatch;
    const [currentTrackDuration, setCurrentTrackDuration] = useState<number>(0);

    useEffect(() => {
        const audio = new Audio();
        audio.src = `http://localhost:5000/${track.audio}`;

        const handleLoadedMetadata = () => {
            setCurrentTrackDuration(Math.ceil(audio.duration));
        };

        audio.addEventListener("loadedmetadata", handleLoadedMetadata);

        return () => {
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        };
    }, [track.audio]);

    const remove = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await dispatch(await deleteTrack(track._id));
    };

    const play = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (active && active._id === track._id) {
            pause ? playTrack() : pauseTrack();
        } else {
            setActiveTrack(track);
            playTrack();
        }
    };

    return (
        <div className={styles.card}>
            <div onClick={play}>
                {active?._id === track._id ? (
                    !pause ? (
                        <AnimatedPlayIcon />
                    ) : (
                        <img style={{ cursor: "pointer" }} src="/icons/play.svg" />
                    )
                ) : (
                    <img style={{ cursor: "pointer" }} src="/icons/play.svg" />
                )}
            </div>

            <img width={40} height={40} src={"http://localhost:5000/" + track.picture} />
            <div className={styles.titles} onClick={() => router.push("/tracks/" + track._id)}>{track.name}</div>
            <div className={styles.titles}>{track.artist}</div>
            <div className={styles.titles}>
                {String(Math.floor(currentTrackDuration / 60)).padStart(2, "0")}:
                {String(currentTrackDuration % 60).padStart(2, "0")}
            </div>

            {/* <IconButton onClick={(e) => e.stopPropagation()} style={{ marginLeft: "auto" }}>
                <Delete onClick={remove} />
            </IconButton> */}
        </div>
    );
};

export default TrackItem;
