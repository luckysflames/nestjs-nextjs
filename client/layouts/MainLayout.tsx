import React from "react";
import Navbar from "../components/Navbar";
import Player from "../components/PlayerItems/Player";
import Head from "next/head";
import styles from "./MainLayout.module.scss";

interface MainLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    keywords?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, title, description, keywords }) => {
    return (
        <>
            <Head>
                <title>{title || "Главная - Music"}</title>
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
                <link rel="shortcut icon" href="/icons/brand.svg"></link>
            </Head>

            <div className={styles.layoutContainer}>
                <Navbar />
                <main className={styles.children}>{children}</main>
                <Player />
            </div>
        </>
    );
};

export default MainLayout;
