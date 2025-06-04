import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/Player.module.scss";
import TrackProgress from "./TrackProgress";
import AnimatedPlayIcon from "../PlaylistItems/AnimatedPlayIcon";
import { usePlayerContext } from "../PlayerContext";
import VolumeProgress from "./VolumeProgress";

interface PlayerProps {
    audioRef: React.RefObject<HTMLAudioElement | null>;
}

const Player: React.FC<PlayerProps> = ({ audioRef }) => {
    const {
        tracks,
        activeTrackId,
        isPlaying,
        togglePlay,
        currentTime,
        setCurrentTime,
        duration,
        volume,
        setVolume,
        setActiveTrack,
    } = usePlayerContext();
    const active = tracks.find((track) => track._id === activeTrackId) || null;

    const [prevVolume, setPrevVolume] = useState(volume);
    const [loop, setLoop] = useState(false);
    const loopRef = useRef(loop);

    const handlePlay = () => {
        togglePlay();
    };

    const handleLoop = () => {
        const newLoop = !loopRef.current;
        setLoop(newLoop);
        loopRef.current = newLoop;
    };

    const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = Number(e.target.value);
        setVolume(newVolume);
    };

    const mute = () => {
        if (volume !== 0) {
            setPrevVolume(volume);
            setVolume(0);
        } else {
            setVolume(prevVolume);
        }
    };

    const changeCurrentTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = Number(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const playPreviousTrack = () => {
        if (!active || !tracks?.length) return;

        const currentIndex = tracks.findIndex((track) => track._id === active._id);
        if (currentIndex === -1) return;

        const previousIndex = (currentIndex - 1 + tracks.length) % tracks.length;
        const previousTrack = tracks[previousIndex];

        setActiveTrack(previousTrack);
    };

    const playNextTrack = () => {
        if (!active || !tracks?.length) return;

        const currentIndex = tracks.findIndex((track) => track._id === active._id);
        if (currentIndex === -1) return;

        if (loopRef.current) {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(console.error);
            }
        } else {
            const nextIndex = (currentIndex + 1) % tracks.length;
            setActiveTrack(tracks[nextIndex]);
        }
    };

    // Обработка окончания трека
    useEffect(() => {
        if (!audioRef.current) return;

        const handleEnded = () => {
            setCurrentTime(0);
            playNextTrack();
        };

        audioRef.current.addEventListener("ended", handleEnded);

        return () => {
            audioRef.current?.removeEventListener("ended", handleEnded);
        };
    }, [audioRef.current, active, tracks]);

    useEffect(() => {
        if (!activeTrackId || !tracks.length || !("mediaSession" in navigator)) return;

        const activeTrack = tracks.find((track) => track._id === activeTrackId);
        if (!activeTrack) return;

        navigator.mediaSession.metadata = new MediaMetadata({
            title: activeTrack.name,
            artist: activeTrack.artist,
            album: activeTrack.text,
            artwork: [
                {
                    src: `http://localhost:5000/${activeTrack.picture}`,
                    sizes: "96x96",
                    type: "image/jpeg",
                },
            ],
        });
    }, [activeTrackId, tracks]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "MediaPlayPause") {
                togglePlay();
            } else if (e.code === "MediaTrackNext") {
                playNextTrack();
            } else if (e.code === "MediaTrackPrevious") {
                playPreviousTrack();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [togglePlay]);

    useEffect(() => {
        if (!audioRef.current) return;

        if ("mediaSession" in navigator) {
            navigator.mediaSession.setActionHandler("play", () => {
                togglePlay();
            });
            navigator.mediaSession.setActionHandler("pause", () => {
                togglePlay();
            });
            navigator.mediaSession.setActionHandler("previoustrack", () => {
                playPreviousTrack();
            });
            navigator.mediaSession.setActionHandler("nexttrack", () => {
                playNextTrack();
            });
        }

        return () => {
            if ("mediaSession" in navigator) {
                navigator.mediaSession.setActionHandler("play", null);
                navigator.mediaSession.setActionHandler("pause", null);
                navigator.mediaSession.setActionHandler("previoustrack", null);
                navigator.mediaSession.setActionHandler("nexttrack", null);
            }
        };
    }, [isPlaying, activeTrackId]);

    if (!tracks.length) {
        return <div>Нет доступных треков</div>;
    }

    return (
        <div className={styles.player}>
            <div className={styles.bar}>
                <TrackProgress left={currentTime} right={duration} onChange={changeCurrentTime} />
            </div>

            <div>
                <img
                    src={`http://localhost:5000/${
                        active?.picture || "/image/defaultAlbumsPage.svg"
                    }`}
                    width={45}
                    alt={active?.name || "Нет обложки трека"}
                />
            </div>

            <div className={styles.titles}>
                <div>{active?.name || "Выберите трек"}</div>
                <div style={{ fontSize: 12, color: "gray" }}>
                    {active?.artist || "Ну пожалуйста"}
                </div>
            </div>

            <div className={styles.buttons}>
                <div onClick={playPreviousTrack} className={styles.skipPrevious}></div>
                <div onClick={handlePlay}>
                    {isPlaying && active ? (
                        <AnimatedPlayIcon />
                    ) : (
                        <div className={styles.playIcon}></div>
                    )}
                </div>
                <div onClick={playNextTrack} className={styles.skipNext}></div>
            </div>

            <div className={styles.loopTrack}>
                {loop ? (
                    <img src="/icons/loopTrack(green).svg" alt="loop track" onClick={handleLoop} />
                ) : (
                    <img src="/icons/loopTrack.svg" alt="loop track" onClick={handleLoop} />
                )}
            </div>

            <div className={styles.volume}>
                <VolumeProgress left={volume} right={100} onChange={changeVolume} mute={mute} />
            </div>

            <div className={styles.timeDisplay}>
                <div className={styles.minutes}>
                    {String(Math.floor(currentTime / 60)).padStart(2, "0")}:
                    {String(currentTime % 60).padStart(2, "0")}
                </div>
                /
                <div className={styles.seconds}>
                    {String(Math.floor(duration / 60)).padStart(2, "0")}:
                    {String(duration % 60).padStart(2, "0")}
                </div>
            </div>
        </div>
    );
};

export default Player;
