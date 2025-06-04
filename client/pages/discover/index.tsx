import { NextPage } from "next";
import Playlist from "../../components/PlaylistItems/Playlist";
import styles from "./index.module.scss";
import TrackCard from "../../components/TrackCard";
import DiscoveryBanner from "../../components/DiscoveryBanner";

const Index: NextPage = () => {
    return (
        <div className={styles.contentWrapper}>
            <div className={styles.cards}>
                <TrackCard />
                <TrackCard />
                <TrackCard />
                <TrackCard />
            </div>
            <DiscoveryBanner />
            <Playlist />
        </div>
    );
};

export default Index;
