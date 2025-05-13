import React from "react";
import { ITrack } from "../../types/track";
import MainLayout from "../../layouts/MainLayout";
import { Button, Grid, TextField } from "@mui/material";
import { useRouter } from "next/router";

const TrackPage = () => {
    const router = useRouter();
    const track: ITrack = {
        _id: "1",
        name: "Track 1",
        artist: "Artist 1",
        text: "Something 1",
        listens: 1,
        picture: "http://localhost:5000/image/7ebb569b-8d98-4e96-8632-a27ea305674e.png",
        audio: "http://localhost:5000/audio/208e90b3-8c4f-4c8a-b3ce-20a55f7f2d76.mp3",
        comments: [],
    };

    return (
        <MainLayout>
            <Button
                variant="outlined"
                style={{ fontSize: 32 }}
                onClick={() => router.push("/tracks")}
            >
                К списку
            </Button>
            <Grid container style={{ margin: "20px 0" }}>
                <img src={track.picture} width={200} height={200} />
                <div style={{ marginLeft: 30 }}>
                    <h1>Название трека - {track.name}</h1>
                    <h1>Исполнитель - {track.artist}</h1>
                    <h1>Прослушиваний - {track.listens}</h1>
                </div>
            </Grid>
            <h1>Слова в треке</h1>
            <p>{track.text}</p>
            <h1>Комментарии</h1>
            <Grid container>
                <TextField label="Ваше имя" fullWidth />
                <TextField label="Ваш комментарий" fullWidth multiline rows={4} />
                <Button>Отправить</Button>
            </Grid>
            <div>
                {track.comments.map((comment) => (
                    <div key={comment._id}>
                        <div>Автор - {comment.username}</div>
                        <div>Комментраий - {comment.text}</div>
                    </div>
                ))}
            </div>
        </MainLayout>
    );
};

export default TrackPage;
