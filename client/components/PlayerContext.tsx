import React, { createContext } from "react";
import { ITrack } from "../types/track";
import { useContext } from "react";

interface PlayerContextType {
    setActiveTrack: (track: ITrack) => void;
    activeTrackId: string | null;
    isPlaying: boolean;
    togglePlay(): boolean;
    tracks: ITrack[];
    setTracks: (tracks: ITrack[]) => void;
    currentTime: number;
    setCurrentTime: (time: number) => void;
    duration: number;
    setDuration: (duration: number) => void;
    volume: number;
    setVolume: (volume: number) => void;
}

export const PlayerContext = createContext<PlayerContextType | null>(null);

export const usePlayerContext = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error("usePlayerContext must be used within a PlayerContextProvider");
    }
    return context;
};
