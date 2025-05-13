import React from "react";
import Navbar from "../components/Navbar";
import { Container } from "@mui/material";
import Player from "../components/Player";

interface MainLayoutProps {
    children: React.ReactNode;
    centered?: boolean;
    centeredH?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    centered = false,
    centeredH = false,
}) => {
    return (
        <>
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
