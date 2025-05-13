import { createWrapper } from "next-redux-wrapper";
import { reducer } from "./reducers";
import { configureStore } from "@reduxjs/toolkit";

const makeStore = () =>
    configureStore({
        reducer: reducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    });

export type AppStore = ReturnType<typeof makeStore>;

export const wrapper = createWrapper<AppStore>(makeStore, { debug: true });
