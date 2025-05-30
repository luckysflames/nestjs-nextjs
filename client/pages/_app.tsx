import React, { FC } from "react";
import { AppProps } from "next/app";
import { wrapper } from "../store";
import "../styles/globals.scss";
import { Provider } from "react-redux";
import MainLayout from "../layouts/MainLayout";

//It's new method how to do, but it doesn't work
const MyApp: FC<AppProps> = ({ Component, pageProps }: AppProps) => {
    const { store, props } = wrapper.useWrappedStore(pageProps);
    return (
        <Provider store={store}>
            <MainLayout>
                <Component {...props.pageProps} />
            </MainLayout>
        </Provider>
    );
};

export default MyApp;
