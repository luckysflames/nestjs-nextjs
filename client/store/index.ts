

// create a makeStore function
import {Context, createWrapper, MakeStore} from "next-redux-wrapper";
import {AnyAction, applyMiddleware, createStore, Store} from "redux";
import {reducer, RootState} from "./reducers";
import thunk, {ThunkAction, ThunkDispatch} from "redux-thunk";
import { configureStore } from "@reduxjs/toolkit";

const makeStore = () =>
    configureStore({
        reducer: reducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    });

// export an assembled wrapper
export const wrapper = createWrapper<Store<RootState>>(makeStore, {debug: true});

export type NextThunkDispatch = ThunkDispatch<RootState, void, AnyAction>