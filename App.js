import 'react-native-gesture-handler';
import React from "react";
import { StatusBar } from 'react-native'
import { NativeBaseProvider } from "native-base";
import AppContainer from "./src/AppContainer";
import { store } from './src/store'
import { Provider } from 'react-redux';

export default function App() {
          return (
                    <>
                    <StatusBar backgroundColor='#f1f1f1' barStyle='dark-content' />
                    <Provider store={store}>
                              <NativeBaseProvider>
                                        <AppContainer />
                              </NativeBaseProvider>
                    </Provider>
                    </>
          );
}