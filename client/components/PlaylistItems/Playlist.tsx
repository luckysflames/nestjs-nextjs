import React, { useState, useEffect } from "react";
import styles from "../../styles/Playlist.module.scss";
import axios from "axios";
import { useRouter } from "next/router";
import TrackList from "./TrackList";
import { ITrack } from "../../types/track";
import { usePlayerContext } from "../PlayerContext";

const Playlist: React.FC = () => {
    const router = useRouter();
    const [query, setQuery] = useState<string>("");
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
    const { tracks, setTracks } = usePlayerContext();

    const refreshTracks = async () => {
        try {
            const response = await axios.get("http://localhost:5000/tracks");
            setTracks(response.data);
            localStorage.setItem("tracks", JSON.stringify(response.data));
        } catch (e) {
            console.error("Ошибка загрузки треков:", e);
        }
    };

    useEffect(() => {
        if (!tracks.length) {
            refreshTracks();
        }
    }, []);

    const search = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        if (timer) {
            clearTimeout(timer);
        }
        setTimer(
            setTimeout(async () => {
                try {
                    const response = await axios.get(
                        `http://localhost:5000/tracks/search?query=${e.target.value}`
                    );
                    setTracks(response.data);
                    localStorage.setItem("tracks", JSON.stringify(response.data));
                } catch (e) {
                    console.error("Ошибка поиска треков:", e);
                }
            }, 500)
        );
    };

    if (!tracks.length && !query) {
        return <div>Ошибка загрузки треков или треки отсутствуют</div>;
    }

    return (
        <div className={styles.playlist}>
            <div className={styles.header}>
                <h1>Плейлист</h1>
                <button id={styles.upload} onClick={() => router.push("/discover/create")}>
                    Загрузить
                </button>
            </div>
            <input
                id={styles.search}
                type="text"
                value={query}
                onChange={search}
                placeholder="Ищите что-нибудь здесь..."
            />
            <TrackList tracks={tracks} />
        </div>
    );
};

export default Playlist;
