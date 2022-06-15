import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, BackHandler, TouchableNativeFeedback, Platform } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Portal } from 'react-native-portalize'
import LottieView from 'lottie-react-native';
import { AntDesign } from '@expo/vector-icons'; 
import { FormControl, Input, useToast, WarningOutlineIcon } from 'native-base';
import Loading from './Loading';
import fetchApi from '../helpers/fetchApi';
import { useDispatch, useSelector } from 'react-redux';
import { setUserAction } from '../store/actions/userActions';
import { pushNotificatioTokenSelector } from '../store/selectors/appSelectors';
import registerPushNotification from '../helpers/registerPushNotification';

export default function PasswordModal({ onClose, numero }) {
          const [password, setPassword] = useState('')
          const [error, setError] = useState(null)
          const [loading, setLoading] = useState(false)
          const pushNotificatonToken = useSelector(pushNotificatioTokenSelector)

          const toast = useToast()
          const dispatch = useDispatch()

          const onSubmit = async () => {
                    if(password == '') {
                              return false
                    }
                    setError(null)
                    setLoading(true)
                    try {
                              const token = await registerPushNotification()
                              const driver = await fetchApi('/declarations/driver/login?password=login', {
                                        method: 'POST',
                                        body: JSON.stringify({
                                                  TELEPHONE: numero.toString(),
                                                  MOT_DE_PASSE: password,
                                                  PUSH_NOTIFICATION_TOKEN: token.data,
                                                  DEVICE: Platform.OS === 'ios' ? 1 : 0
                                        }),
                                        headers: {
                                                  'Content-Type': 'application/json'
                                        }
                              })
                              if(driver.success) {
                                        await AsyncStorage.setItem('user', JSON.stringify(driver))
                                        dispatch(setUserAction(driver))
                                        onClose()
                              } else {
                                        setError('Mot de passe incorrect')
                              }
                    } catch (error) {
                              console.log(error)
                              toast.show({
                                        title: "Problème de connexion",
                                        placement: "bottom",
                                        status: 'error',
                                        duration: 2000,
                                        width: '90%',
                                        minWidth: 300
                              })
                    }
                    setLoading(false)
          }
          useEffect(() => {
                    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
                              onClose()
                              return true
                    })
                    return () => {
                              handler.remove()
                    }
          }, [])
          return (
                    <Portal>
                              {loading && <Loading simple />}
                              <View style={styles.loadingContainer}>
                                        <View style={{...styles.content}}>
                                                  <Text style={styles.modalTitle}>
                                                            Mot de passe
                                                  </Text>
                                                  <View style={{ paddingHorizontal: 10, width: '100%' }}>
                                                            <FormControl isRequired isInvalid={error}>
                                                                      <Input
                                                                                placeholder='Mot de passe'
                                                                                secureTextEntry
                                                                                size='lg'
                                                                                borderRadius={10}
                                                                                mt={5}
                                                                                backgroundColor="#f1f1f1"
                                                                                value={password}
                                                                                onChangeText={n => setPassword(n)}
                                                                                returnKeyType='go'
                                                                                blurOnSubmit={false}
                                                                                onSubmitEditing={onSubmit}
                                                                                autoFocus
                                                                                // onSubmitEditing={onLogin}
                                                                      />
                                                                      {error && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                                                                {error}
                                                                      </FormControl.ErrorMessage>}
                                                            </FormControl>
                                                  </View>
                                                  <View style={styles.actions}>
                                                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#c4c4c4')} useForeground={false} onPress={onClose}>
                                                                      <View style={styles.okBtn}>
                                                                                <Text style={styles.okBtnText}>
                                                                                          Annuler
                                                                                </Text>
                                                                      </View>
                                                            </TouchableNativeFeedback>
                                                            {password.length < 8 ? <View style={{...styles.okBtn, borderLeftWidth: 1, borderLeftColor: '#ddd', opacity: 0.5}}>
                                                                                <Text style={styles.okBtnText}>
                                                                                          Ok
                                                                                </Text>
                                                                      </View> :
                                                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#c4c4c4')} useForeground={false} onPress={onSubmit}>
                                                                      <View style={{...styles.okBtn, borderLeftWidth: 1, borderLeftColor: '#ddd'}}>
                                                                                <Text style={styles.okBtnText}>
                                                                                          Ok
                                                                                </Text>
                                                                      </View>
                                                            </TouchableNativeFeedback>}
                                                  </View>
                                        </View>
                              </View>
                    </Portal>
          )
}

const styles = StyleSheet.create({
          
          loadingContainer: {
                    position: 'absolute',
                    zIndex: 1,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    justifyContent: 'center',
                    alignItems: 'center'
          },
          content: {
                    width: '90%',
                    maxWidth: 400,
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    elevation: 5,
                    shadowColor: '#c4c4c4',
                    justifyContent: 'center',
                    alignItems: 'center',
          },
          modalTitle: {
                    fontSize: 17,
                    fontWeight:'bold',
                    opacity: 0.8,
                    marginBottom: 20
          },
          okBtn: {
                    width: '50%',
                    paddingVertical: 20,
                    overflow: 'hidden'
          },
          okBtnText: {
                    fontWeight: 'bold',
                    color: '#58A0EB',
                    textAlign: 'center',
                    fontSize: 16
          },
          modalTitle: {
                    fontSize: 17,
                    fontWeight:'bold',
                    opacity: 0.8,
                    marginTop: 20
          },
          infoDesc: {
                    textAlign: 'center',
                    paddingHorizontal: 20,
                    color: '#777',
                    marginBottom: 10
          },
          actions: {
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTopColor: '#ddd',
                    borderTopWidth: 1,
                    marginTop: 20
          }
})