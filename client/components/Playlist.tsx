import React, { useState } from "react";
import styles from "../styles/Playlist.module.scss";
import { useDispatch } from "react-redux";
import { NextThunkDispatch } from "../store";
import { searchTracks } from "../store/actions-creators/track";
import { useRouter } from "next/router";
import TrackList from "./TrackList";

const Playlist = ({ tracks }) => {
    const router = useRouter();
    const [query, setQuery] = useState<string>("");
    const dispatch = useDispatch() as NextThunkDispatch;
    const [timer, setTimer] = useState(null);

    const search = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        if (timer) {
            clearTimeout(timer);
        }
        setTimer(
            setTimeout(async () => {
                await dispatch(await searchTracks(e.target.value));
            }, 500)
        );
    };

    return (
        <div className={styles.playlist}>
            <div className={styles.header}>
                <h1>Плейлист</h1>
                <button id={styles.upload} onClick={() => router.push("/tracks/create")}>
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
