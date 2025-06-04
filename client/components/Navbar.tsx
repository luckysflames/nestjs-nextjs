import React, { useEffect, useState } from "react";
import styles from "../styles/Navbar.module.scss";
import { useRouter } from "next/router";

const menuItems = [
    {
        title: "Для Вас",
        defaultSrc: "/icons/discover.svg",
        activeSrc: "/icons/discover(white).svg",
        href: "/discover",
    },
    {
        title: "Тренды",
        defaultSrc: "/icons/trends.svg",
        activeSrc: "/icons/trends(white).svg",
        href: "/trends",
    },
    {
        title: "Жанры",
        defaultSrc: "/icons/genres.svg",
        activeSrc: "/icons/genres(white).svg",
        href: "/genres",
    },
    {
        title: "Радио",
        defaultSrc: "/icons/radio.svg",
        activeSrc: "/icons/radio(white).svg",
        href: "/radio",
    },
    {
        title: "Исполнители",
        defaultSrc: "/icons/artist.svg",
        activeSrc: "/icons/artist(white).svg",
        href: "/performers",
    },
    {
        title: "Альбомы",
        defaultSrc: "/icons/album.svg",
        activeSrc: "/icons/album(white).svg",
        href: "/albums",
    },
];

const Navbar = () => {
    const router = useRouter();
    const [playlists, setPlaylists] = useState([
        { id: 1, name: "Любимые треки", isEditing: false, tempName: "Любимые треки" },
    ]);
    const [activeItem, setActiveItem] = useState(router.pathname);

    useEffect(() => {
        setActiveItem(router.pathname);
    }, [router.pathname]);

    const handleEditClick = (id) => {
        setPlaylists(
            playlists.map((playlist) =>
                playlist.id === id ? { ...playlist, isEditing: true } : playlist
            )
        );
    };

    const handleNameChange = (id, e) => {
        setPlaylists(
            playlists.map((playlist) =>
                playlist.id === id ? { ...playlist, tempName: e.target.value } : playlist
            )
        );
    };

    const handleNameSubmit = (id) => {
        setPlaylists(
            playlists.map((playlist) =>
                playlist.id === id
                    ? {
                          ...playlist,
                          name: playlist.tempName,
                          isEditing: false,
                      }
                    : playlist
            )
        );
    };

    const handleKeyDown = (id, e) => {
        if (e.key === "Enter") {
            handleNameSubmit(id);
        }
    };

    const addNewPlaylist = () => {
        const newId = playlists.length > 0 ? Math.max(...playlists.map((p) => p.id)) + 1 : 1;

        const newPlaylist = {
            id: newId,
            name: "Новый плейлист",
            isEditing: true,
            tempName: "Новый плейлист",
        };
        setPlaylists([...playlists, newPlaylist]);
    };

    const deletePlaylist = (id) => {
        setPlaylists(playlists.filter((playlist) => playlist.id !== id));
    };

    return (
        <div className={styles.container}>
            <div className={styles.drawer}>
                <div className={styles.icon} onClick={() => router.push("/")}>
                    <img src="/icons/brand.svg" alt="clover" width={30} height={30} />
                    <p className={styles.brand}>Music</p>
                </div>
                <hr className={styles.divider} />

                <ul className={styles.list}>
                    {menuItems.map((item) => (
                        <li
                            key={item.title}
                            className={`${styles.listItem} ${
                                activeItem === item.href ? styles.active : ""
                            }`}
                            onClick={() => {
                                router.push(item.href);
                                setActiveItem(item.href);
                            }}
                        >
                            <div className={styles.listItemContent}>
                                <div className={styles.icon}>
                                    {activeItem === item.href ? (
                                        <img
                                            src={item.activeSrc}
                                            alt={item.title}
                                            width={24}
                                            height={24}
                                        />
                                    ) : (
                                        <img
                                            src={item.defaultSrc}
                                            alt={item.title}
                                            width={24}
                                            height={24}
                                        />
                                    )}
                                </div>
                                <span
                                    className={`${styles.text} ${
                                        activeItem === item.href ? styles.activeText : ""
                                    }`}
                                >
                                    {item.title}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className={styles.myLibraryTitle}>
                    <h3 className={styles.title}>Моя медиатека</h3>
                    <img
                        onClick={() => {
                            addNewPlaylist();
                        }}
                        id={styles.addIcon}
                        src="/icons/plus.svg"
                        alt="add playlist"
                        width={24}
                        height={24}
                    />
                </div>
                <hr className={styles.divider} />

                <ul className={styles.list}>
                    {playlists.map((playlist) => (
                        <li key={playlist.id} className={styles.listItem}>
                            <div className={styles.listItemContent}>
                                <div className={styles.icon}>
                                    {playlist.id !== 1 ? (
                                        <img
                                            src="/icons/playlist.svg"
                                            alt="playlist-icon"
                                            width={24}
                                            height={24}
                                        />
                                    ) : (
                                        <img
                                            src="/icons/heart(transparancy).svg"
                                            alt="playlist-icon"
                                            width={24}
                                            height={24}
                                        />
                                    )}
                                </div>

                                {playlist.isEditing ? (
                                    <input
                                        type="text"
                                        value={playlist.tempName}
                                        onChange={(e) => handleNameChange(playlist.id, e)}
                                        onBlur={() => handleNameSubmit(playlist.id)}
                                        onKeyDown={(e) => handleKeyDown(playlist.id, e)}
                                        autoFocus
                                        className={styles.editInput}
                                    />
                                ) : (
                                    <span className={styles.text}>{playlist.name}</span>
                                )}

                                {playlist.id !== 1 ? (
                                    <div className={styles.playlistButtons}>
                                        <img
                                            onClick={() =>
                                                playlist.isEditing
                                                    ? handleNameSubmit(playlist.id)
                                                    : handleEditClick(playlist.id)
                                            }
                                            src="/icons/edit.svg"
                                            alt="edit"
                                            width={18}
                                            height={18}
                                            className={styles.editIcon}
                                        />
                                        <img
                                            src="/icons/trash(transparency).svg"
                                            alt="delete playlist"
                                            width={18}
                                            height={18}
                                            className={styles.trashIcon}
                                            onClick={() => deletePlaylist(playlist.id)}
                                        />
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
