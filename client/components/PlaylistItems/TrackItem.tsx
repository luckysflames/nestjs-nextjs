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

    // Функция с запасом в 2px для точной проверки
    const checkOverflow = (el: HTMLElement | null) => {
        if (!el) return false;
        return el.scrollWidth > el.clientWidth + 2;
    };

    // Дебаунс для ресайза
    const debounce = (func: Function, delay: number) => {
        let timeoutId: NodeJS.Timeout;
        return (...args: any[]) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    };

    useEffect(() => {
        const handleResize = debounce(() => {
            setShouldScroll({
                name: checkOverflow(titleRef.current),
                artist: checkOverflow(artistRef.current),
                duration: checkOverflow(durationRef.current),
            });
        }, 100);

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        setShouldScroll({
            name: checkOverflow(titleRef.current),
            artist: checkOverflow(artistRef.current),
            duration: checkOverflow(durationRef.current),
        });
    }, [track.name, track.artist, currentTrackDuration]);

    useEffect(() => {
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            const calculateParams = (element: HTMLElement) => {
                const textWidth = element.scrollWidth;
                const containerWidth = element.clientWidth;

                if (textWidth < containerWidth * 0.9) {
                    return { shouldAnimate: false };
                }

                const gap = Math.min(Math.max(textWidth * 0.25, 20), 50);
                const duration = Math.max(5, Math.min(textWidth / 30, 15));

                return { shouldAnimate: true, duration, gap };
            };

            if (titleRef.current && shouldScroll.name) {
                const params = calculateParams(titleRef.current);
                if (params.shouldAnimate) {
                    titleRef.current.style.setProperty("--duration", `${params.duration}s`);
                    titleRef.current.style.setProperty("--gap", `${params.gap}px`);
                } else {
                    setShouldScroll((prev) => ({ ...prev, name: false }));
                }
            }

            if (artistRef.current && shouldScroll.artist) {
                const params = calculateParams(artistRef.current);
                if (params.shouldAnimate) {
                    artistRef.current.style.setProperty("--duration", `${params.duration}s`);
                    artistRef.current.style.setProperty("--gap", `${params.gap}px`);
                } else {
                    setShouldScroll((prev) => ({ ...prev, artist: false }));
                }
            }

            if (durationRef.current && shouldScroll.duration) {
                const params = calculateParams(durationRef.current);
                if (params.shouldAnimate) {
                    durationRef.current.style.setProperty("--duration", `${params.duration}s`);
                    durationRef.current.style.setProperty("--gap", `${params.gap}px`);
                } else {
                    setShouldScroll((prev) => ({ ...prev, duration: false }));
                }
            }
        }
    }, [shouldScroll]);

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
                {shouldScroll.name ? (
                    <div className={styles["text-container"]}>
                        <span className={styles["text-original"]}>{track.name}</span>
                        <span className={styles["text-copy"]} aria-hidden="true">
                            {track.name}
                        </span>
                    </div>
                ) : (
                    <span>{track.name}</span>
                )}
            </div>

            <div
                id={styles.trackArtist}
                ref={artistRef}
                className={`${styles.titles} ${shouldScroll.artist ? styles.marquee : ""}`}
                onClick={() => router.push(`/performers/${track.artist}`)}
            >
                {shouldScroll.artist ? (
                    <div className={styles["text-container"]}>
                        <span className={styles["text-original"]}>{track.artist}</span>
                        <span className={styles["text-copy"]} aria-hidden="true">
                            {track.artist}
                        </span>
                    </div>
                ) : (
                    <span>{track.artist}</span>
                )}
            </div>

            <div
                id={styles.timer}
                ref={durationRef}
                className={`${styles.titles} ${shouldScroll.duration ? styles.marquee : ""}`}
            >
                {shouldScroll.duration ? (
                    <div className={styles["text-container"]}>
                        <span className={styles["text-original"]}>
                            {formatDuration(currentTrackDuration)}
                        </span>
                        <span className={styles["text-copy"]} aria-hidden="true">
                            {formatDuration(currentTrackDuration)}
                        </span>
                    </div>
                ) : (
                    <span>{formatDuration(currentTrackDuration)}</span>
                )}
            </div>

            <div onClick={remove} className={styles.deleteIcon}></div>
        </div>
    );
};

export default TrackItem;
