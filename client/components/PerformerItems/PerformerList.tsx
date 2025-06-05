import { useRouter } from "next/router";
import React from "react";
import { usePlayerContext } from "../PlayerContext";
import PerformerItem from "./PerformerItem";

const PerformerList = () => {
    const router = useRouter();
    const { tracks } = usePlayerContext();

    const getUniqueArtists = () => {
        const artists = tracks.map((track) => track.artist);
        return [...new Set(artists)];
    };
    return (
        <div>
            {getUniqueArtists().map((artist) => (
                <div
                    key={artist}
                    onClick={() => router.push("/performers/" + encodeURIComponent(artist))}
                >
                    <PerformerItem artist={artist} />
                </div>
            ))}
        </div>
    );
};

export default PerformerList;
