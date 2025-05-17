import React from "react";
import styles from "../styles/Navbar.module.scss";
import { useRouter } from "next/router";

const menuItems = [
    {
        title: "Discover",
        src: "/icons/discover.svg",
        href: "/",
    },
    {
        title: "Trends",
        src: "/icons/trends.svg",
        href: "/tracks",
    },
    {
        title: "Genres",
        src: "/icons/genres.svg",
        href: "/",
    },
    {
        title: "Radio",
        src: "/icons/radio.svg",
        href: "/",
    },
    {
        title: "Artist",
        src: "/icons/artist.svg",
        href: "/",
    },
    {
        title: "Albums",
        src: "/icons/album.svg",
        href: "/",
    },
];

const Navbar = () => {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <div className={styles.drawer}>
                <div className={styles.icon}>
                    <img src="/icons/brand.svg" alt="clover" width={30} height={30} />
                    <p className={styles.brand}>Music</p>
                </div>
                <hr className={styles.divider} />

                <ul className={styles.list} style={{ marginBottom: "100px" }}>
                    {menuItems.map((item) => (
                        <li
                            key={item.title}
                            className={styles.listItem}
                            onClick={() => router.push(item.href)}
                        >
                            <div className={styles.listItemContent}>
                                <div className={styles.icon}>
                                    <img src={item.src} alt={item.title} width={24} height={24} />
                                </div>
                                <span className={styles.text}>{item.title}</span>
                            </div>
                        </li>
                    ))}
                </ul>

                <h3 className={styles.title}>My Library</h3>
                <hr className={styles.divider} />

                <ul className={styles.list}>
                    {["Playlist 1", "Playlist 2", "Playlist 3"].map((text) => (
                        <li key={text} className={styles.listItem}>
                            <div className={styles.listItemContent}>
                                <div className={styles.icon}>
                                    <img
                                        src="/icons/playlist.svg"
                                        alt="playlist-icon"
                                        width={24}
                                        height={24}
                                    />
                                </div>
                                <span className={styles.text}>{text}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
