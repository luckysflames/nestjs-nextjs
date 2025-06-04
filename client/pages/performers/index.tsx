import { NextPage } from "next";
import { useRouter } from "next/router";
import { usePlayerContext } from "../../components/PlayerContext";

const Index: NextPage = () => {
    const router = useRouter();
    const { tracks } = usePlayerContext();

    const getUniqueArtists = () => {
        const artists = tracks.map((track) => track.artist);
        return [...new Set(artists)];
    };

    return (
        <>
            <h1>Performers page</h1>
            {getUniqueArtists().map((artist) => (
                <div key={artist} onClick={() => router.push("/performers/" + encodeURIComponent(artist))}>
                    {artist}
                </div>
            ))}
        </>
    );
};

export default Index;
