import { NavigationContainer } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import { Text, Linking, View, ActivityIndicator } from 'react-native'
import { Host } from 'react-native-portalize'
import RootNavigator from './routes/RootNavigator'
import * as ExpoLinking from 'expo-linking';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';
import registerPushNotification from './helpers/registerPushNotification'
import { useDispatch } from 'react-redux'
import { setPushNotificationTokenAction } from './store/actions/appActions'
import { setUserAction } from './store/actions/userActions'

export default function AppContainer() {
          const dispatch = useDispatch()
          const [userLoading, setUserLoading] = useState(true)
          useEffect(() => {
                    Notifications.setNotificationHandler({
                              handleNotification: async () => ({
                                        shouldShowAlert: true,
                                        shouldPlaySound: true,
                                        shouldSetBadge: true,
                              }),
                    });
                    (async () => { // save push notification token
                              const token = await registerPushNotification()
                              dispatch(setPushNotificationTokenAction(token.data))
                    
                              const user = await AsyncStorage.getItem('user')
                              // await AsyncStorage.removeItem('user')
                              dispatch(setUserAction(JSON.parse(user)))
                              setUserLoading(false)
                    })()
          }, [])
          const prefix = ExpoLinking.createURL('/')
          if(userLoading) {
                    return (
                              <View style={{ flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
                                        <ActivityIndicator color="#007BFF" animating={userLoading} size='large' />
                              </View>
                    )
          }
          return <NavigationContainer
                              // for deep linking
                              linking={{
                                        prefixes: [prefix],
                                        config: {
                                        },
                                        async getInitialURL() {
                                                  // First, you may want to do the default deep link handling
                                                  // Check if app was opened from a deep link
                                                  const url = await Linking.getInitialURL();

                                                  if (url != null) {
                                                            return url;
                                                  }

                                                  // Handle URL from expo push notifications
                                                  const response = await Notifications.getLastNotificationResponseAsync();
                                                  const myUrl = response?.notification.request.content.data.url;
                                                  return myUrl;
                                        },
                                        subscribe(listener) {
                                                  const onReceiveURL = ({ url }) => listener(url);

                                                  // Listen to incoming links from deep linking
                                                  Linking.addEventListener('url', onReceiveURL);

                                                  // Listen to expo push notifications
                                                  const subscription = Notifications.addNotificationResponseReceivedListener(response => {
                                                            const data = response.notification.request.content.data

                                                            // Any custom logic to see whether the URL needs to be handled
                                                            //...

                                                            // Let React Navigation handle the URL
                                                            listener(data.url);
                                                  });

                                                  return () => {
                                                            // Clean up the event listeners
                                                            Linking.removeEventListener('url', onReceiveURL);
                                                            subscription.remove();
                                                  };
                                        },
                              }}>
                    <Host>
                              <RootNavigator />
                    </Host>
          </NavigationContainer>
}