import { NextPage } from "next";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import MainLayout from "../../layouts/MainLayout";
import { fetchTracks } from "../../store/actions-creators/track";
import { NextThunkDispatch, wrapper } from "../../store";
import styles from "./index.module.scss";
import Playlist from "../../components/PlaylistItems/Playlist";

const Index: NextPage = () => {
    const { tracks, error } = useTypedSelector((state) => state.track);

    if (error) {
        return (
            <MainLayout>
                <h1>{error}</h1>
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Для Вас - Music">
            <div className={styles.contentWrapper}>
                <Playlist tracks={tracks} />
            </div>
        </MainLayout>
    );
};

export default Index;

export const getServerSideProps = wrapper.getServerSideProps((store) => async () => {
    const dispatch = store.dispatch as NextThunkDispatch;
    await dispatch(await fetchTracks());
    return {
        props: {},
    };
});
