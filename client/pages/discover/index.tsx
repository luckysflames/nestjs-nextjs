import { NextPage } from "next";
import MainLayout from "../../layouts/MainLayout";
import Playlist from "../../components/PlaylistItems/Playlist";
import styles from "./index.module.scss";

const Index: NextPage = () => {
    return (
        <div className={styles.contentWrapper}>
            <Playlist />
        </div>
    );
};

export default Index;
