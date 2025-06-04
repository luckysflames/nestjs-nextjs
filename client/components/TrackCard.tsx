import React, { useEffect, useRef, useState } from "react";
import { usePlayerContext } from "./PlayerContext";
import styles from "../styles/TrackCard.module.scss";
import AnimatedPlayIcon from "./PlaylistItems/AnimatedPlayIcon";
import { useRouter } from "next/router";

const TrackCard = () => {
    const { tracks, activeTrackId, setActiveTrack, isPlaying, togglePlay } = usePlayerContext();
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [shouldScroll, setShouldScroll] = useState({
        name: false,
        artist: false,
    });
    const router = useRouter();

    const titleRef = useRef<HTMLDivElement>(null);
    const artistRef = useRef<HTMLDivElement>(null);

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

    const getRandomTrack = () => {
        if (!tracks || tracks.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * tracks.length);
        return tracks[randomIndex];
    };

    const play = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (activeTrackId === selectedTrack._id) {
            togglePlay();
        } else {
            setActiveTrack(selectedTrack);
            if (!isPlaying) {
                togglePlay();
            }
        }
    };

    useEffect(() => {
        const track = getRandomTrack();
        if (track) {
            setSelectedTrack(track);
        }

        const handleResize = debounce(() => {
            if (track) {
                setShouldScroll({
                    name: checkOverflow(titleRef.current),
                    artist: checkOverflow(artistRef.current),
                });
            }
        }, 100);

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [tracks]);

    useEffect(() => {
        if (selectedTrack) {
            setShouldScroll({
                name: checkOverflow(titleRef.current),
                artist: checkOverflow(artistRef.current),
            });
        }
    }, [selectedTrack]);

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

            if (titleRef.current && selectedTrack && shouldScroll.name) {
                const params = calculateParams(titleRef.current);
                if (params.shouldAnimate) {
                    titleRef.current.style.setProperty("--duration", `${params.duration}s`);
                    titleRef.current.style.setProperty("--gap", `${params.gap}px`);
                } else {
                    setShouldScroll((prev) => ({ ...prev, name: false }));
                }
            }

            if (artistRef.current && selectedTrack && shouldScroll.artist) {
                const params = calculateParams(artistRef.current);
                if (params.shouldAnimate) {
                    artistRef.current.style.setProperty("--duration", `${params.duration}s`);
                    artistRef.current.style.setProperty("--gap", `${params.gap}px`);
                } else {
                    setShouldScroll((prev) => ({ ...prev, artist: false }));
                }
            }
        }
    }, [selectedTrack, shouldScroll]);

    if (!selectedTrack) {
        return <div className={styles.container}>No tracks available</div>;
    }

    const isCurrentTrackPlaying = activeTrackId === selectedTrack._id && isPlaying;

    return (
        <div
            className={styles.container}
            style={{
                background: `url(http://localhost:5000/${selectedTrack.picture}) center / cover no-repeat`,
            }}
        >
            <div className={styles.bottomContainer}>
                <div className={styles.textContainer}>
                    <div
                        onClick={() => router.push(`/discover/${selectedTrack._id}`)}
                        ref={titleRef}
                        className={`${styles.text} ${
                            shouldScroll.name ? styles["text-marquee"] : ""
                        }`}
                    >
                        {shouldScroll.name ? (
                            <div className={styles["text-container"]}>
                                <span className={styles["text-original"]}>
                                    {selectedTrack.name}
                                </span>
                                <span className={styles["text-copy"]} aria-hidden="true">
                                    {selectedTrack.name}
                                </span>
                            </div>
                        ) : (
                            <span>{selectedTrack.name}</span>
                        )}
                    </div>
                    <div
                        onClick={() => router.push(`/performers/${(selectedTrack.artist)}`)}
                        ref={artistRef}
                        className={`${styles.text} ${
                            shouldScroll.artist ? styles["text-marquee"] : ""
                        }`}
                    >
                        {shouldScroll.artist ? (
                            <div className={styles["text-container"]}>
                                <span className={styles["text-original"]}>
                                    {selectedTrack.artist}
                                </span>
                                <span className={styles["text-copy"]} aria-hidden="true">
                                    {selectedTrack.artist}
                                </span>
                            </div>
                        ) : (
                            <span>{selectedTrack.artist}</span>
                        )}
                    </div>
                </div>
                <div onClick={play}>
                    {isCurrentTrackPlaying ? (
                        <AnimatedPlayIcon />
                    ) : (
                        <div className={styles.pauseButton}></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackCard;
