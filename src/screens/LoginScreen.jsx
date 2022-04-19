import { useNavigation, useRoute } from '@react-navigation/native'
import { Button, Input, useToast } from 'native-base'
import React, { useState } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { setLoadingAction, setRouteAction } from '../store/actions/appActions'
import { setUserAction } from '../store/actions/userActions'
import { SharedElement } from 'react-navigation-shared-element'
import fetchApi from '../helpers/fetchApi'
import Loading from '../components/Loading'
import { loadingSelector } from '../store/selectors/appSelectors'
import { userSelector } from '../store/selectors/userSelector'

export default function LoginScreen() {
          const [numero, setNumero] = useState('')
          const dispatch = useDispatch()
          const navigation = useNavigation()
          const loading = useSelector(loadingSelector)
          const route = useRoute()
          navigation.addListener('focus', () => {
                    dispatch(setRouteAction(route.name))
          })
          const [error, setError] = useState(null)
          const toast = useToast()
          const user = useSelector(userSelector)
          const onLogin = async () => {
                    if(numero == '') {
                              return false
                    }
                    setError(null)
                    dispatch(setLoadingAction(true))
                    try {
                              const driver = await fetchApi('/declarations/driver/login', {
                                        method: 'POST',
                                        body: JSON.stringify({TELEPHONE: numero.toString()}),
                                        headers: {
                                                  'Content-Type': 'application/json'
                                        }
                              })
                              if(driver?.DRIVER_ID) {
                                        dispatch(setUserAction(driver))
                              } else {
                                        setError('Chauffeur inconnue')
                              }
                    } catch (error) {
                              console.log(error)
                              toast.show({
                                        title: "Erreur de connexion",
                                        placement: "bottom",
                                        status: 'error',
                                        duration: 2000,
                                        width: '90%',
                                        minWidth: 300
                              })
                    }
                    dispatch(setLoadingAction(false))
          }
          return (
                    <View style={styles.container}>
                              <View style={styles.content}>
                                        <SharedElement id={"header"} style={{height: 80}}>
                                                  <View style={styles.header}>
                                                            <Image source={require('../../assets/wasili.png')} style={{width: 85, height: 60, marginHorizontal: -10, marginVertical: -16, marginLeft: -20}} />
                                                            <View style={styles.headerDesc}>
                                                                      <Text style={styles.headerTitle}>
                                                                                {user ? user?.NOM_CHAFFEUR + user?.PRENOM_CHAUFFEUR : 'Connexion' }
                                                                      </Text>
                                                                      <Text style={styles.headerSecTitle}>Déclaration de course</Text>
                                                            </View>
                                                  </View>
                                        </SharedElement>
                                        <Text style={styles.title}>
                                                  Entrez votre numéro de téléphone pour commencer
                                        </Text>
                                        <View style={{paddingHorizontal: 20}}>
                                                  <Input
                                                            placeholder='Numéro de téléphone'
                                                            value={numero}
                                                            onChangeText={n => setNumero(n)}
                                                            keyboardType="number-pad"
                                                            size='lg'
                                                            borderRadius={10}
                                                            mt={5}
                                                            backgroundColor="#f1f1f1"
                                                            borderColor={error ? "#eb4034" : '#58A0EB'}
                                                            _focus={{ borderColor: error ? "#eb4034" : '#58A0EB'}}
                                                            isDisabled={loading}
                                                            returnKeyType='go'
                                                            onSubmitEditing={onLogin}
                                                  />
                                                  <Text style={styles.errorText}>{ error }</Text>
                                                  <Button isDisabled={numero == ''} isLoading={loading} borderRadius={20} size="lg" onPress={onLogin} background={"#58A0EB"}>
                                                            Se connecter
                                                  </Button>
                                        </View>
                              </View>
                    </View>
          )
}

const styles = StyleSheet.create({
          container: {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#fff'
          },
          content: {
                    // paddingHorizontal: 20
          },
          title: {
                    color: '#333',
                    fontWeight: 'bold',
                    opacity: 0.8,
                    fontSize: 23,
                    lineHeight: 28,
                    marginVertical: 40,
                    paddingHorizontal: 20
          },
          header: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: '100%',
                    resizeMode: 'contain',
                    paddingHorizontal: 20,
                    paddingVertical: 10
          },
          headerDesc: {
                    flex :1,
                    height: '100%',
                    justifyContent: 'space-between',
          },
          headerTitle: {
                    fontWeight: 'bold',
                    fontSize: 16
          },
          headerSecTitle: {
                    fontWeight: 'bold',
                    color: '#777',
                    fontSize: 16
          },
          errorText: {
                    color: 'red',
                    fontWeight: 'bold',
                    opacity: 0.5,
                    marginBottom: 10
          }
})