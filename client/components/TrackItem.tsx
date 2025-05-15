import React, { useState } from "react";
import { ITrack } from "../types/track";
import { Card, Grid, IconButton } from "@mui/material";
import styles from "../styles/TrackItem.module.scss";
import { Delete, Pause, PlayArrow } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useActions } from "../hooks/useActions";
import { useDispatch } from "react-redux";
import { deleteTrack } from "../store/actions-creators/track";
import { NextThunkDispatch } from "../store";

interface TrackItemProps {
    track: ITrack;
    active?: boolean;
}

const TrackItem: React.FC<TrackItemProps> = ({ track, active = false }) => {
    const router = useRouter();
    const { pauseTrack, playTrack, setActiveTrack } = useActions();
    const dispatch = useDispatch() as NextThunkDispatch;

    const remove = async () => {
        await dispatch(await deleteTrack(track._id));
    };

    const play = (e) => {
        e.stopPropagation();
        setActiveTrack(track);
        playTrack();
    };

    return (
        <Card
            className={`${styles.track} MuiCard-root`}
            onClick={() => router.push("/tracks/" + track._id)}
        >
            <IconButton onClick={play}>{active ? <Pause /> : <PlayArrow />}</IconButton>

            <img width={70} height={70} src={"http://localhost:5000/" + track.picture} />

            <Grid container direction="column" style={{ width: 200, margin: "0 20px" }}>
                <div>{track.name}</div>
                <div style={{ fontSize: 12, color: "gray" }}>{track.artist}</div>
            </Grid>

            {active && <div>02:42 / 03:22</div>}

            <IconButton onClick={(e) => e.stopPropagation()} style={{ marginLeft: "auto" }}>
                <Delete onClick={remove} />
            </IconButton>
        </Card>
    );
};

export default TrackItem;
