import React from "react";
import Navbar from "../components/Navbar";
import { Container } from "@mui/material";
import Player from "../components/Player";
import Head from "next/head";

interface MainLayoutProps {
    children: React.ReactNode;
    centered?: boolean;
    centeredH?: boolean;
    title?: string;
    description?: string;
    keywords?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    centered = false,
    centeredH = false,
    title,
    description,
    keywords,
}) => {
    return (
        <>
            <Head>
                <title>{title || "Музыкальная платформа"}</title>
                <meta
                    name="description"
                    content={
                        "Музыкальная площадка. Здесь каждый может оставить свой трек и стать знаменитым." +
                        description
                    }
                />
                <meta name="robots" content="index, follow" />
                <meta name="keywords" content={keywords || "Музыка, треки, артисты"} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Navbar />
            <Container
                sx={{
                    margin: "90px 0",
                    ...(centered && {
                        margin: "calc(50vh - 140px) auto",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                    }),
                    ...(centeredH && {
                        margin: "90px auto",
                        display: "flex",
                        flexDirection: "column",
                    }),
                }}
            >
                {children}
            </Container>
            <Player />
        </>
    );
};

export default MainLayout;
