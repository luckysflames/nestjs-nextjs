import React, { FC } from "react";
import { AppProps } from "next/app";
import { wrapper } from "../store";
import { Provider } from "react-redux";

//It's new method how to do, but it doesn't work
// function MyApp({ Component, pageProps }: AppProps) {
//   const { store, props } = wrapper.useWrappedStore(pageProps);
//   return (
//     <Provider store={store}>
//       <Component {...props.pageProps} />
//     </Provider>
//   );
// }

// export default MyApp;

const WrappedApp: FC<AppProps> = ({Component, pageProps}) => (
    <Component {...pageProps} />
);

export default wrapper.withRedux(WrappedApp);