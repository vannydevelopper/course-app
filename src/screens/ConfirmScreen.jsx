import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { ScrollView, StyleSheet, View, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../components/Header'
import { setRouteAction } from '../store/actions/appActions'
import { loadingSelector, routeSelector } from '../store/selectors/appSelectors'
import DeclarationTypeScreen from './DeclarationTypeScreen'
import IncidentScreen from './IncidentScreen'
import PickUpScreen from './PickUpScreen'
import TrajetScreen from './TrajetScreen'
import Loading from '../components/Loading'

export default function ConfirmScreen() {
          const dispatch = useDispatch()
          const route = useRoute()
          const navigation = useNavigation()
          
          useFocusEffect(useCallback(() => {
                    dispatch(setRouteAction(route.name))
          }, []))
          const routeName = useSelector(routeSelector)
          const loading = useSelector(loadingSelector)
          return (
                    <View style={styles.container}>
                              {loading && <Loading />}
                              <ScrollView  keyboardShouldPersistTaps="always">
                                        <DeclarationTypeScreen />
                                        <PickUpScreen />
                                        <TrajetScreen />
                                        <IncidentScreen />
                              </ScrollView>
                    </View>
          )
}

const styles = StyleSheet.create({
          container: {
                    flex: 1,
                    backgroundColor: '#fff',
          },
})