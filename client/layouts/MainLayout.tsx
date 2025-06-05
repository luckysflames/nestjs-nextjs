import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Player from "../components/PlayerItems/Player";
import Head from "next/head";
import styles from "./MainLayout.module.scss";
import { PlayerContext } from "../components/PlayerContext";
import { ITrack } from "../types/track";
import axios from "axios";

interface MainLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    keywords?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title, description, keywords }) => {
    const [tracks, setTracks] = useState<ITrack[]>([]);
    const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const [volume, setVolume] = useState<number>(50);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Инициализация audioRef на клиенте
    useEffect(() => {
        audioRef.current = new Audio();
        return () => {
            audioRef.current?.pause();
            audioRef.current = null;
        };
    }, []);

    // Загрузка треков из localStorage или API
    useEffect(() => {
        const cachedTracks = localStorage.getItem("tracks");
        if (cachedTracks) {
            setTracks(JSON.parse(cachedTracks));
        }
        const fetchTracks = async () => {
            try {
                const response = await axios.get("http://localhost:5000/tracks");
                setTracks(response.data);
                localStorage.setItem("tracks", JSON.stringify(response.data));
            } catch (e) {
                console.error("Ошибка загрузки треков:", e);
            }
        };
        fetchTracks();
    }, []);

    // Функция для установки активного трека
    const setActiveTrack = (track: ITrack, autoPlay: boolean = false) => {
        setActiveTrackId(track._id);
        if (audioRef.current) {
            audioRef.current.src = `http://localhost:5000/${track.audio}`;
            audioRef.current.currentTime = 0;
            setCurrentTime(0);
            setDuration(0);
            if (autoPlay || isPlaying) {
                audioRef.current.play().catch((e) => {
                    console.error("Playback failed:", e);
                    setIsPlaying(false);
                });
                setIsPlaying(true);
            }
        }
    };

    // Функция для переключения воспроизведения/паузы
    const togglePlay = () => {
        if (!audioRef.current) return false;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
            return false;
        } else {
            audioRef.current.play().catch((e) => {
                console.error("Playback failed:", e);
                setIsPlaying(false);
            });
            setIsPlaying(true);
            return true;
        }
    };

    // Обновление currentTime и duration
    useEffect(() => {
        if (!audioRef.current) return;

        const audio = audioRef.current;
        const handleLoadedMetadata = () => setDuration(Math.ceil(audio.duration));
        const handleTimeUpdate = () => setCurrentTime(Math.ceil(audio.currentTime));

        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("timeupdate", handleTimeUpdate);

        return () => {
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("timeupdate", handleTimeUpdate);
        };
    }, [audioRef.current]);

    // Синхронизация громкости
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    return (
        <PlayerContext.Provider
            value={{
                setActiveTrack,
                activeTrackId,
                isPlaying,
                togglePlay,
                tracks,
                setTracks,
                currentTime,
                setCurrentTime,
                duration,
                setDuration,
                volume,
                setVolume,
            }}
        >
            <Head>
                <title>{title || "Главная - Music"}</title>
                <meta
                    name="description"
                    content={
                        "Музыкальная площадка. Здесь каждый может оставить свой трек и стать знаменитым." +
                        (description || "")
                    }
                />
                <meta name="robots" content="index, follow" />
                <meta name="keywords" content={keywords || "Музыка, треки, артисты"} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="shortcut icon" href="/icons/brand.svg"></link>
            </Head>

            <div className={styles.layoutContainer}>
                <Navbar />
                <main className={styles.children}>{children}</main>
                <Player audioRef={audioRef} />
            </div>
        </PlayerContext.Provider>
    );
};

export default MainLayout;
