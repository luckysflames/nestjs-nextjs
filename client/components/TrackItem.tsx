import React, { useEffect, useRef, useState } from "react";
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
    const { pause, active } = useTypedSelector((state) => state.player);
    const { pauseTrack, playTrack, setActiveTrack } = useActions();
    const dispatch = useDispatch() as NextThunkDispatch;
    const [currentTrackDuration, setCurrentTrackDuration] = useState<number>(0);
    const [shouldScroll, setShouldScroll] = useState({
        name: false,
        artist: false,
        duration: false,
    });

    const titleRef = useRef<HTMLDivElement>(null);
    const artistRef = useRef<HTMLDivElement>(null);
    const durationRef = useRef<HTMLDivElement>(null);

    const checkOverflow = (el: HTMLElement | null) => {
        if (!el) return false;
        return el.scrollWidth > el.clientWidth;
    };

    useEffect(() => {
        setShouldScroll({
            name: checkOverflow(titleRef.current),
            artist: checkOverflow(artistRef.current),
            duration: checkOverflow(durationRef.current),
        });
    }, [track.name, track.artist, currentTrackDuration]);

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

    const formatDuration = (seconds: number) => {
        return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
            seconds % 60
        ).padStart(2, "0")}`;
    };

    return (
        <div className={styles.card}>
            <div onClick={play}>
                {active?._id === track._id ? (
                    !pause ? (
                        <AnimatedPlayIcon />
                    ) : (
                        <div className={styles.playIcon}></div>
                    )
                ) : (
                    <div className={styles.playIcon}></div>
                )}
            </div>

            <img
                width={40}
                height={40}
                src={`http://localhost:5000/${track.picture}`}
                alt={track.name}
            />

            <div
                id={styles.trackName}
                ref={titleRef}
                className={`${styles.titles} ${shouldScroll.name ? styles.marquee : ""}`}
                onClick={() => router.push(`/tracks/${track._id}`)}
            >
                <span>{track.name}</span>
            </div>

            <div
                id={styles.trackArtist}
                ref={artistRef}
                className={`${styles.titles} ${shouldScroll.artist ? styles.marquee : ""}`}
            >
                <span>{track.artist}</span>
            </div>

            <div
                id={styles.timer}
                ref={durationRef}
                className={`${shouldScroll.duration ? styles.marquee : ""}`}
            >
                <span>{formatDuration(currentTrackDuration)}</span>
            </div>

            <div onClick={remove} className={styles.deleteIcon}></div>
        </div>
    );
};

export default TrackItem;
