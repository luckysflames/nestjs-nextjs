import React, { useEffect, useRef, useState } from "react";
import { ITrack } from "../../types/track";
import styles from "../../styles/TrackItem.module.scss";
import { useRouter } from "next/router";
import axios from "axios";
import { usePlayerContext } from "../PlayerContext";
import AnimatedPlayIcon from "./AnimatedPlayIcon";

interface TrackItemProps {
    track: ITrack;
    refreshTracks?: () => void;
}

const TrackItem: React.FC<TrackItemProps> = ({ track, refreshTracks }) => {
    const router = useRouter();
    const { setActiveTrack, activeTrackId, isPlaying, togglePlay } = usePlayerContext();
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
        try {
            await axios.delete(`http://localhost:5000/tracks/${track._id}`);
            refreshTracks?.();
        } catch (e) {
            console.error("Ошибка удаления трека:", e);
        }
    };

    const play = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (activeTrackId === track._id) {
            togglePlay();
        } else {
            setActiveTrack(track);
            if (!isPlaying) {
                togglePlay();
            }
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
                {activeTrackId === track._id ? (
                    !isPlaying ? (
                        <div className={styles.playIcon}></div>
                    ) : (
                        <AnimatedPlayIcon />
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
                onClick={() => router.push(`/discover/${track._id}`)}
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
