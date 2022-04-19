import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { Text } from 'react-native'
import { Host } from 'react-native-portalize'
import RootNavigator from './routes/RootNavigator'

export default function AppContainer() {
          return <NavigationContainer>
                    <Host>
                              <RootNavigator />
                    </Host>
          </NavigationContainer>
}