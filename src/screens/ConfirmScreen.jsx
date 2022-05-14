import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { ScrollView, StyleSheet, View, Text, ActivityIndicator } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../components/Header'
import { setRouteAction } from '../store/actions/appActions'
import { loadingSelector, routeSelector, typeSelector } from '../store/selectors/appSelectors'
import DeclarationTypeScreen from './DeclarationTypeScreen'
import IncidentScreen from './IncidentScreen'
import PickUpScreen from './PickUpScreen'
import TrajetScreen from './TrajetScreen'
import Loading from '../components/Loading'
import AnnulerScreen from './AnnulerScreen'

export default function ConfirmScreen() {
          const dispatch = useDispatch()
          const route = useRoute()
          const navigation = useNavigation()
          
          useFocusEffect(useCallback(() => {
                    dispatch(setRouteAction(route.name))
          }, []))
          const routeName = useSelector(routeSelector)
          const loading = useSelector(loadingSelector)

          const selectedType = useSelector(typeSelector)
          const [load, setLoading] = useState(true)
          useEffect(() => {
                    const timer = setTimeout(() => {
                              setLoading(false)
                    })
                    return () => {
                              clearTimeout(timer)
                    }
          }, [])
          if(load) {
                    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                              <ActivityIndicator animating color={"#777"} size="large" />
                    </View>
          }
          return (
                    <View style={styles.container}>
                              {loading && <Loading />}
                              <ScrollView  keyboardShouldPersistTaps="always">
                                        <DeclarationTypeScreen />
                                        {selectedType?.TYPE_DECLARATION_ID == 2 && <AnnulerScreen />}
                                        <PickUpScreen />
                                        {selectedType?.TYPE_DECLARATION_ID != 2 && <TrajetScreen />}
                                        
                                        {selectedType?.TYPE_DECLARATION_ID != 2 && <IncidentScreen />}
                              </ScrollView>
                    </View>
          )
}

const styles = StyleSheet.create({
          container: {
                    flex: 1,
                    backgroundColor: '#fff'
          },
})