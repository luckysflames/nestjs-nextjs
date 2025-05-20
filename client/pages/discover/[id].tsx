import React, { useState } from "react";
import { ITrack } from "../../types/track";
import MainLayout from "../../layouts/MainLayout";
import { Button, Grid, TextField } from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import type { GetServerSideProps } from "next";
import { useInput } from "../../hooks/useInput";
import styles from "./[id].module.scss";

const TrackPage = ({ serverTrack }) => {
    const [track, setTrack] = useState<ITrack>(serverTrack);
    const router = useRouter();
    const username = useInput("");
    const text = useInput("");

    const addComment = async () => {
        try {
            const response = await axios.post("http://localhost:5000/tracks/comments", {
                username: username.value,
                text: text.value,
                trackId: track._id,
            });
            setTrack({ ...track, comments: [...track.comments, response.data] });
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <MainLayout
            title={"Музыкальная площадка - " + track.name + " - " + track.artist}
            keywords={"Музыка, артисты, " + track.name + ", " + track.artist}
        >
            <div className={styles.container}>
                <div className={styles.frame}>
                    <button id={styles.back} onClick={() => router.push("/tracks")}>
                        Назад
                    </button>

                    <div className={styles.info}>
                        <img
                            src={"http://localhost:5000/" + track.picture}
                            width={350}
                            height={350}
                        />
                        <div className={styles.data}>
                            <p id={styles.tracktitle}>Трек</p>
                            <p id={styles.trackname}>{track.name}</p>
                            <p id={styles.trackartist}>{track.artist}</p>
                            <p>{track.listens} прослушиваний</p>
                            <button id={styles.play} onClick={() => ({})}>
                                Слушать
                            </button>
                            <div className={styles.anotherbuttons}>
                                <button id={styles.heart} onClick={() => ({})}>
                                    <img
                                        src="/icons/heart.svg"
                                        alt="like"
                                        width={"25px"}
                                        height={"25px"}
                                    />
                                </button>
                                <button id={styles.more} onClick={() => ({})}>
                                    <img
                                        src="/icons/more.svg"
                                        alt="more"
                                        width={"25px"}
                                        height={"25px"}
                                    />
                                </button>
                            </div>
                        </div>

                        <div className={styles.lyrics}>
                            <h1>Слова</h1>
                            <p>
                                {!track.text
                                    ? "Что-то пошло не так... Возможно, слова не были добавлены к треку"
                                    : track.text}
                            </p>
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
                        <input
                            className={styles.inputcomment}
                            type="text"
                            {...username}
                            placeholder="Ваше имя"
                        />
                        <input
                            className={styles.inputcomment}
                            type="text"
                            {...text}
                            placeholder="Комментарий"
                        />
                        <button onClick={addComment}>Отправить</button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default TrackPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const response = await axios.get("http://localhost:5000/tracks/" + params.id);
    return {
        props: {
            serverTrack: response.data,
        },
    };
};
