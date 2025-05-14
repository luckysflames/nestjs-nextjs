// create a makeStore function
import { createWrapper } from "next-redux-wrapper";
import { reducer, rootReducer } from "./reducers";
import { AnyAction, configureStore, ThunkDispatch } from "@reduxjs/toolkit";

const makeStore = () =>
    configureStore({
        reducer: reducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    });

export type NextThunkDispatch = ThunkDispatch<RootState, void, AnyAction>;
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];

export const wrapper = createWrapper<AppStore>(makeStore);
