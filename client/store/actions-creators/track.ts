import { Dispatch } from "react";
import { TrackAction, TrackActionTypes } from "../../types/track";
import axios from "axios";

export const fetchTracks = () => async (dispatch: Dispatch<TrackAction>) => {
    try {
        const response = await axios.get("http://localhost:5000/tracks");
        dispatch({ type: TrackActionTypes.FETCH_TRACKS, payload: response.data });
    } catch (e) {
        dispatch({
            type: TrackActionTypes.FETCH_TRACKS_ERROR,
            payload: "Произошла ошибка при загрузке треков",
        });
    }
};

export const searchTracks = (query: string) => async (dispatch: Dispatch<TrackAction>) => {
    try {
        const response = await axios.get("http://localhost:5000/tracks/search?query=" + query);
        dispatch({ type: TrackActionTypes.FETCH_TRACKS, payload: response.data });
    } catch (e) {
        dispatch({
            type: TrackActionTypes.FETCH_TRACKS_ERROR,
            payload: "Произошла ошибка при поиске треков",
        });
    }
};

export const deleteTrack = (id: string) => async (dispatch: Dispatch<TrackAction>) => {
    try {
        await axios.delete("http://localhost:5000/tracks/" + id);
        dispatch({ type: TrackActionTypes.FETCH_DELETE_TRACK, payload: id });
    } catch (e) {
        dispatch({
            type: TrackActionTypes.FETCH_TRACKS_ERROR,
            payload: "Произошла ошибка при удалении трека",
        });
    }
};