import React, { useEffect } from "react";
import styles from "../../styles/Player.module.scss";
import TrackProgress from "./TrackProgress";
import AnimatedPlayIcon from "../PlaylistItems/AnimatedPlayIcon";
import { ITrack } from "../../types/track";
import { usePlayerContext } from "../PlayerContext";

interface PlayerProps {
    audioRef: React.MutableRefObject<HTMLAudioElement | null>;
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

    const handlePlay = () => {
        togglePlay();
    };

    const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = Number(e.target.value);
        setVolume(newVolume);
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

        setActiveTrack(previousTrack); // Передаем isPlaying как autoPlay
    };

    const playNextTrack = () => {
        if (!active || !tracks?.length) return;

        const currentIndex = tracks.findIndex((track) => track._id === active._id);
        if (currentIndex === -1) return;

        const nextIndex = (currentIndex + 1) % tracks.length;
        const nextTrack = tracks[nextIndex];

        setActiveTrack(nextTrack); // Передаем isPlaying как autoPlay
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

    if (!tracks.length) {
        return <div>Нет доступных треков</div>;
    }

    return (
        <div className={styles.player}>
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

            <div>
                <img
                    src={`http://localhost:5000/${active?.picture || "defaultAlbumsPage.svg"}`}
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

            <div className={styles.bar}>
                <TrackProgress left={currentTime} right={duration} onChange={changeCurrentTime} />
            </div>

            <div className={styles.timeDisplay}>
                {String(Math.floor(currentTime / 60)).padStart(2, "0")}:
                {String(currentTime % 60).padStart(2, "0")} /{" "}
                {String(Math.floor(duration / 60)).padStart(2, "0")}:
                {String(duration % 60).padStart(2, "0")}
            </div>
        </div>
    );
};

export default Player;
