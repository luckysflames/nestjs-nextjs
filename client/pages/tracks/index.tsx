import { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Button, Card, Grid } from "@mui/material";
import { useTypedSelector } from "../../hooks/useTypedSelector";
import { useActions } from "../../hooks/useActions";
import MainLayout from "../../layouts/MainLayout";
import TrackList from "../../components/TrackList";
import { fetchTracks } from "../../store/actions-creators/track";
import { NextThunkDispatch, wrapper } from "../../store";

const Index: NextPage = () => {
    const router = useRouter();
    const { tracks, error } = useTypedSelector((state) => state.track);
    const { fetchTracks } = useActions();

    // useEffect(() => {
    //     fetchTracks();
    // }, [fetchTracks]);

    if (error) {
        return (
            <MainLayout>
                <h1>{error}</h1>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Grid container justifyContent="center">
                <Card style={{ width: 900 }}>
                    <Box p={3}>
                        <Grid container justifyContent="space-between">
                            <h1>Список треков</h1>
                            <Button onClick={() => router.push("/tracks/create")}>Загрузить</Button>
                        </Grid>
                    </Box>
                    <TrackList tracks={tracks} />
                </Card>
            </Grid>
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