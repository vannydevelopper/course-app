import { useNavigation, useRoute } from '@react-navigation/native'
import { Button, Input, useToast } from 'native-base'
import React, { useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { setLoadingAction, setRouteAction } from '../store/actions/appActions'
import { setUserAction } from '../store/actions/userActions'
import { SharedElement } from 'react-navigation-shared-element'
import fetchApi from '../helpers/fetchApi'
import Loading from '../components/Loading'
import { loadingSelector, pushNotificatioTokenSelector } from '../store/selectors/appSelectors'
import { userSelector } from '../store/selectors/userSelector'
import PendingInfo from '../components/PendingInfo'
import PasswordModal from '../components/PasswordModal'
import CreatePasswordModal from '../components/CreatePasswordModal'

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

          const [showPendingInfo, setShowPendingInfo] = useState(false)
          const [showPasswordModal, setShowPasswordModal] = useState(false)
          const [showCreatePasswordModal, setShowCreatePasswordModal] = useState(false)


          const onLogin = async () => {
                    if(numero == '') {
                              return false
                    }
                    setError(null)
                    dispatch(setLoadingAction(true))
                    try {
                              const driver = await fetchApi('/declarations/driver/login', {
                                        method: 'POST',
                                        body: JSON.stringify({
                                                  TELEPHONE: numero.toString(),
                                        }),
                                        headers: {
                                                  'Content-Type': 'application/json'
                                        }
                              })
                              if(driver?.DRIVER_ID) {
                                        if(!driver?.IS_CONFIRMED) {
                                                  setShowPendingInfo(true)
                                        } else if(driver?.IS_CONFIRMED && !driver.MOT_DE_PASSE) {
                                                  setShowCreatePasswordModal(true)
                                        } else if(driver?.IS_CONFIRMED && driver.MOT_DE_PASSE) {
                                                  setShowPasswordModal(true)
                                        }
                                        // dispatch(setUserAction(driver))
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
                              {loading && <Loading simple />}
                              {showPendingInfo && <PendingInfo isLoging onClose={() => setShowPendingInfo(false)} />}
                              {showPasswordModal && <PasswordModal onClose={() => setShowPasswordModal(false)} numero={numero} />}
                              {showCreatePasswordModal && <CreatePasswordModal onClose={() => setShowCreatePasswordModal(false)} numero={numero} />}
                              <View style={styles.content}>
                                        <SharedElement id={"header"} style={{height: 80}}>
                                                  <View style={styles.header}>
                                                            <Image source={require('../../assets/wasili-icon.png')} style={{width: 100, height: 60, marginHorizontal: -20, marginVertical: 0, marginTop: 20, marginLeft: -30}} />
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
                                                  <Button isDisabled={numero == ''} borderRadius={20} size="lg" onPress={onLogin} background={"#58A0EB"}>
                                                            Se connecter
                                                  </Button>
                                                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
                                                            <Text style={styles.toRegisterText}>
                                                                      Nouveau chauffeur? 
                                                            </Text>
                                                            <TouchableWithoutFeedback onPress={() => navigation.navigate('Register') }>
                                                                      <Text style={styles.registerText} >Créer un compte</Text>
                                                            </TouchableWithoutFeedback>
                                                  </View>
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
                    width: '100%'
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
                    maxHeight: 60,
                    resizeMode: 'contain',
                    paddingHorizontal: 20,
                    paddingVertical: 10,
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
          },
          toRegisterText: {
                    fontSize: 15,
                    color: '#777',
          },
          registerBtn: {
                    marginLeft: 5,
                    borderBottomColor: '#58A0EB',
                    borderBottomWidth: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 1
          },
          registerText: {
                    color: '#58A0EB',
                    textDecorationLine: 'underline',
                    marginLeft: 5
          }
})