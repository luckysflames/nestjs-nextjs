import { Pause, PlayArrow, VolumeUp } from "@mui/icons-material";
import { Grid, IconButton } from "@mui/material";
import React, { FC, useEffect, useRef } from "react";
import styles from "../../styles/Player.module.scss";
import TrackProgress from "./TrackProgress";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { useActions } from "../../hooks/useActions";
import VolumeProgress from "./VolumeProgress";
import AnimatedPlayIcon from "../PlaylistItems/AnimatedPlayIcon";

const Player = () => {
    // const { currentTime, duration, pause, volume, active } = useTypedSelector(
    //     (state) => state.player
    // );
    // const { tracks } = useTypedSelector((state) => state.track);
    const { pauseTrack, playTrack, setVolume, setCurrentTime, setDuration, setActiveTrack } =
        useActions();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const initialized = useRef(false);

    // useEffect(() => {
    //     if (!initialized.current && tracks.length > 0 && !active) {
    //         initialized.current = true;
    //         setActiveTrack(tracks[0]);
    //         return;
    //     }

    //     if (!active || !audioRef.current) return;

    //     const audio = audioRef.current;
    //     audio.src = `http://localhost:5000/${active.audio}`;
    //     audio.volume = volume / 100;

    //     const handleLoadedMetadata = () => setDuration(Math.ceil(audio.duration));
    //     const handleTimeUpdate = () => setCurrentTime(Math.ceil(audio.currentTime));
    //     const handleEnded = () => {
    //         pauseTrack();
    //         playNextTrack();
    //     };

    //     audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    //     audio.addEventListener("timeupdate", handleTimeUpdate);
    //     audio.addEventListener("ended", handleEnded);

    //     const playAudio = async () => {
    //         try {
    //             await audio.play();
    //             playTrack();
    //         } catch (e) {
    //             console.error("Playback failed:", e);
    //             pauseTrack();
    //         }
    //     };

    //     if (!pause) {
    //         playAudio();
    //     }

    //     return () => {
    //         audio.pause();
    //         audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
    //         audio.removeEventListener("timeupdate", handleTimeUpdate);
    //         audio.removeEventListener("ended", handleEnded);
    //     };
    // }, [active, tracks]);

    // useEffect(() => {
    //     if (!audioRef.current) return;

    //     const togglePlayback = async () => {
    //         try {
    //             if (pause) {
    //                 await audioRef.current?.pause();
    //             } else {
    //                 await audioRef.current?.play();
    //             }
    //         } catch (e) {
    //             console.error("Playback toggle failed:", e);
    //         }
    //     };

    //     togglePlayback();
    // }, [pause]);

    // useEffect(() => {
    //     audioRef.current = new Audio();

    //     return () => {
    //         audioRef.current?.pause();
    //         audioRef.current = null;
    //     };
    // }, []);

    // const handlePlay = () => {
    //     if (pause) {
    //         playTrack();
    //     } else {
    //         pauseTrack();
    //     }
    // };

    // const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const newVolume = Number(e.target.value);
    //     if (audioRef.current) {
    //         audioRef.current.volume = newVolume / 100;
    //     }
    //     setVolume(newVolume);
    // };

    // const changeCurrentTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const newTime = Number(e.target.value);
    //     if (audioRef.current) {
    //         audioRef.current.currentTime = newTime;
    //     }
    //     setCurrentTime(newTime);
    // };

    // const playNextTrack = () => {
    //     if (!active || !tracks?.length) return;

    //     const currentIndex = tracks.findIndex((track) => track._id === active._id);
    //     if (currentIndex === -1) return;

    //     const nextIndex = (currentIndex + 1) % tracks.length;
    //     const nextTrack = tracks[nextIndex];

    //     setActiveTrack(nextTrack);
    //     playTrack();
    // };

    return (
        <div className={styles.player}>
            {/* <div onClick={handlePlay}>
                {!pause ? <AnimatedPlayIcon /> : <div className={styles.playIcon}></div>}
            </div>

            <div>
                <img
                    src={`http://localhost:5000/${active?.picture || tracks[0].picture}`}
                    width={45}
                />
            </div>

            <div className={styles.titles}>
                <div>{active?.name || tracks[0].name}</div>
                <div style={{ fontSize: 12, color: "gray" }}>
                    {active?.artist || tracks[0].artist}
                </div>
            </div>

            <div className={styles.bar}>
                <TrackProgress left={currentTime} right={duration} onChange={changeCurrentTime} />
            </div>

            <div className={styles.volume}>
                <VolumeUp style={{ marginLeft: "auto" }} />
                <VolumeProgress left={volume} right={100} onChange={changeVolume} />
            </div>

            <div className={styles.timeDisplay}>
                {String(Math.floor(currentTime / 60)).padStart(2, "0")}:
                {String(currentTime % 60).padStart(2, "0")} /{" "}
                {String(Math.floor(duration / 60)).padStart(2, "0")}:
                {String(duration % 60).padStart(2, "0")}
            </div> */}
        </div>
    );
};

export default Player;
