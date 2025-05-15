import { Pause, PlayArrow, VolumeUp } from "@mui/icons-material";
import { Grid, IconButton } from "@mui/material";
import React, { useEffect, useRef } from "react";
import styles from "../styles/Player.module.scss";
import TrackProgress from "./TrackProgress";
import { useTypedSelector } from "../hooks/useTypedSelector";
import { useActions } from "../hooks/useActions";
import VolumeProgress from "./VolumeProgress";

const Player = () => {
    const { currentTime, duration, pause, volume, active } = useTypedSelector(
        (state) => state.player
    );
    const { pauseTrack, playTrack, setVolume, setCurrentTime, setDuration } = useActions();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Инициализация аудио
    useEffect(() => {
        if (!active) return;

        audioRef.current = new Audio();
        const audio = audioRef.current;

        audio.src = `http://localhost:5000/${active.audio}`;
        audio.volume = volume / 100;

        const handleLoadedMetadata = () => setDuration(Math.ceil(audio.duration));
        const handleTimeUpdate = () => setCurrentTime(Math.ceil(audio.currentTime));

        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("timeupdate", handleTimeUpdate);

        return () => {
            audio.pause();
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audioRef.current = null;
        };
    }, [active]);

    // Управление воспроизведением
    useEffect(() => {
        if (!audioRef.current || !active) return;

        const playPromise = pause ? audioRef.current.pause() : audioRef.current.play();

        if (playPromise !== undefined) {
            (error) => {
                console.error("Playback failed:", error);
            };
        }
    }, [pause, active]);

    useEffect(() => {
        if (currentTime === duration) pauseTrack();
    }, [currentTime]);

    const handlePlay = () => {
        if (pause) {
            playTrack();
        } else {
            pauseTrack();
        }
    };

    const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = Number(e.target.value);
        if (audioRef.current) {
            audioRef.current.volume = newVolume / 100;
        }
        setVolume(newVolume);
    };

    const changeCurrentTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = Number(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
        setCurrentTime(newTime);
    };

    if (!active) return null;

    return (
        <div className={styles.player}>
            <IconButton onClick={handlePlay}>{pause ? <PlayArrow /> : <Pause />}</IconButton>
            <Grid container direction="column" style={{ width: 200, margin: "0 20px" }}>
                <div>{active?.name}</div>
                <div style={{ fontSize: 12, color: "gray" }}>{active?.artist}</div>
            </Grid>
            <TrackProgress left={currentTime} right={duration} onChange={changeCurrentTime} />
            <VolumeUp style={{ marginLeft: "auto" }} />
            <VolumeProgress left={volume} right={100} onChange={changeVolume} />
        </div>
    );
};

export default Player;
