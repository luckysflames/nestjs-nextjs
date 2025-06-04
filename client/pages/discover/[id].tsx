import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { ITrack } from "../../types/track";
import { Button, Grid, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import { usePlayerContext } from "../../components/PlayerContext";
import styles from "./[id].module.scss";

interface Comment {
    _id: string;
    username: string;
    text: string;
}

const TrackPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query; // Получаем ID из URL
    const { setActiveTrack, activeTrackId, tracks } = usePlayerContext();
    const [track, setTrack] = useState<ITrack | null>(null);
    const [commentText, setCommentText] = useState<string>("");
    const [username, setUsername] = useState<string>("User"); // Временное значение
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    // Загрузка трека
    useEffect(() => {
        if (!id) return;

        const fetchTrack = async () => {
            setLoading(true);
            setError("");

            // Проверяем, есть ли трек в tracks
            const cachedTrack = tracks.find((t) => t._id === id);
            if (cachedTrack) {
                setTrack(cachedTrack);
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/tracks/${id}`);
                setTrack(response.data);
            } catch (e) {
                console.error("Ошибка загрузки трека:", e);
                setError("Не удалось загрузить трек");
            } finally {
                setLoading(false);
            }
        };

        fetchTrack();
    }, [id, tracks]);

    // Синхронизация активного трека
    // useEffect(() => {
    //     if (track && activeTrackId !== track._id) {
    //         setActiveTrack(track);
    //     }
    // }, [track, activeTrackId, setActiveTrack]);

    // Обновление просмотров
    useEffect(() => {
        if (!track) return;

        const updateListens = async () => {
            try {
                await axios.post(`http://localhost:5000/tracks/listen/${track._id}`);
                setTrack((prev) => (prev ? { ...prev, listens: prev.listens + 1 } : prev));
            } catch (e) {
                console.error("Ошибка обновления просмотров:", e);
            }
        };
        updateListens();
    }, [track?._id]);

    // Добавление комментария
    const addComment = async () => {
        if (!commentText.trim() || !track) return;
        try {
            const response = await axios.post(`http://localhost:5000/tracks/comments`, {
                username,
                text: commentText,
                trackId: track._id,
            });
            setTrack((prev) =>
                prev
                    ? {
                          ...prev,
                          comments: [...(prev.comments || []), response.data],
                      }
                    : prev
            );
            setCommentText("");
        } catch (e) {
            console.error("Ошибка добавления комментария:", e);
            setError("Не удалось добавить комментарий");
        }
    };

    if (loading) {
        return (
            <MainLayout title="Загрузка... | Music">
                <Typography variant="h5">Загрузка...</Typography>
            </MainLayout>
        );
    }

    if (error || !track) {
        return (
            <>
                <Typography variant="h5" color="error">
                    {error || "Трек не найден"}
                </Typography>
                <Button
                    variant="outlined"
                    onClick={() => router.push("/discover")}
                    style={{ marginTop: 20 }}
                >
                    Назад
                </Button>
            </>
        );
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.frame}>
                    <button id={styles.back} onClick={() => router.push("/discover")}>
                        Назад
                    </button>

                    <div className={styles.info}>
                        <div className={styles.leftColumn}>
                            <img
                                className={styles.albumImage}
                                src={"http://localhost:5000/" + track.picture}
                            />
                        </div>

                        <div className={styles.data}>
                            <p id={styles.tracktitle}>Трек</p>
                            <p id={styles.trackname}>{track.name}</p>
                            <p id={styles.trackartist}>{track.artist}</p>
                            <p>{track.listens} прослушиваний</p>
                        </div>

                        <div className={styles.lyrics}>
                            <h1>Слова</h1>
                            <div className={styles.text}>
                                {!track.text
                                    ? "Что-то пошло не так... Возможно, слова не были добавлены к треку"
                                    : track.text.replace(/\\n/g, "\n")}
                            </div>
                        </div>

                        <div className={styles.threebuttons}>
                            <button id={styles.play} onClick={() => ({})}>
                                Слушать
                            </button>
                            <div className={styles.anotherbuttons}>
                                <button id={styles.heart} onClick={() => ({})}>
                                    <img
                                        src="/icons/heart.svg"
                                        alt="like"
                                        width={"20px"}
                                        height={"20px"}
                                    />
                                </button>
                                <button id={styles.more} onClick={() => ({})}>
                                    <img
                                        src="/icons/more.svg"
                                        alt="more"
                                        width={"20px"}
                                        height={"20px"}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.comments}>
                        <h1>Комментарии</h1>
                        {track.comments.map((comment) => (
                            <div>
                                <div>Автор - {comment.username}</div>
                                <div>Комментарий - {comment.text}</div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.createcomment}>
                        {/* <input
                            className={styles.inputcomment}
                            type="text"
                            {...username}
                            placeholder="Ваше имя"
                        /> */}
                        <input
                            className={styles.inputcomment}
                            type="text"
                            placeholder="Комментарий"
                        />
                        <button onClick={addComment}>Отправить</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TrackPage;
