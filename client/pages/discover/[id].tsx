import React, { useState } from "react";
import { ITrack } from "../../types/track";
import MainLayout from "../../layouts/MainLayout";
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
                    <button id={styles.back} onClick={() => router.push("/discover")}>
                        Назад
                    </button>

                    <div className={styles.info}>
                        <div className={styles.leftColumn}>
                            {track.picture !== undefined ? (
                                <img
                                    className={styles.albumImage}
                                    src={"http://localhost:5000/image/02e616b0-42ec-4ef0-998b-d96ca8b9fdd4.jpg"}
                                    // src={"http://localhost:5000/" + track.picture}
                                />
                            ) : (
                                <img
                                    className={styles.albumImage}
                                    src={"/image/defaultAlbumsPage.png"}
                                />
                            )}
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
