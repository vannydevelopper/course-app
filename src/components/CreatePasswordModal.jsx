import React, { useEffect, useRef, useState } from 'react'
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
import { useForm } from '../hooks/useForm';
import { useFormErrorsHandle } from '../hooks/useFormErrorsHandle';
import { pushNotificatioTokenSelector } from '../store/selectors/appSelectors';

export default function CreatePasswordModal({ onClose, numero }) {
          const [data, handleChange, setValue, resetForm] = useForm({
                    password: '',
                    passwordConfirm: ''
          })
          const { isValidate, checkFieldData, getError, hasError, setErrors } = useFormErrorsHandle(data, {
                    password: {
                              required: true,
                              length: [8]
                    },
                    passwordConfirm: {
                              required: true,
                              match: 'password'
                    }
          }, {
                    password: {
                              required: "Le mot de passe est requis",
                              length: "Mot de passe trop court"
                    },
                    passwordConfirm: {
                              required: "Ce champ est requis",
                              match: "Les mots de passe ne correspondent pas"
                    }
          })
          const [loading, setLoading] = useState(false)

          const toast = useToast()
          const dispatch = useDispatch()
          const passwordConfirmRef = useRef(null)
          const pushNotificatonToken = useSelector(pushNotificatioTokenSelector)

          const onSubmit = async () => {
                    setLoading(true)
                    try {
                              const driver = await fetchApi('/declarations/driver/login?password=create', {
                                        method: 'POST',
                                        body: JSON.stringify({
                                                  TELEPHONE: numero.toString(),
                                                  MOT_DE_PASSE: data.password,
                                                  PUSH_NOTIFICATION_TOKEN: pushNotificatonToken,
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
                                        toast.show({
                                                  title: "Problème de connexion",
                                                  placement: "bottom",
                                                  status: 'error',
                                                  duration: 2000,
                                                  width: '90%',
                                                  minWidth: 300
                                        })
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
                                                            Créér un mot de passe
                                                  </Text>
                                                  <View style={{ paddingHorizontal: 10, width: '100%' }}>

                                                  <FormControl isRequired isInvalid={hasError('password')}>
                                                                      <Input
                                                                                placeholder='Mot de passe'
                                                                                secureTextEntry
                                                                                size='lg'
                                                                                borderRadius={10}
                                                                                mt={5}
                                                                                backgroundColor="#f1f1f1"
                                                                                value={data.password}
                                                                                onChangeText={n => handleChange('password', n)}
                                                                                onBlur={() => checkFieldData('password')}
                                                                                // // isDisabled={loading}
                                                                                returnKeyType='next'
                                                                                blurOnSubmit={false}
                                                                                onSubmitEditing={() => passwordConfirmRef?.current.focus() }
                                                                                // onSubmitEditing={onLogin}
                                                                      />
                                                                      {hasError('password') && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                                                                {getError('password')}
                                                                      </FormControl.ErrorMessage>}
                                                            </FormControl>
                                                            <FormControl isRequired isInvalid={hasError('passwordConfirm')}>
                                                                      <Input
                                                                                placeholder='Rétaper le mot de passe'
                                                                                secureTextEntry
                                                                                size='lg'
                                                                                borderRadius={10}
                                                                                mt={5}
                                                                                backgroundColor="#f1f1f1"
                                                                                value={data.passwordConfirm}
                                                                                onChangeText={n => handleChange('passwordConfirm', n)}
                                                                                onBlur={() => checkFieldData('passwordConfirm')}
                                                                                // // isDisabled={loading}
                                                                                ref={passwordConfirmRef}
                                                                                // onSubmitEditing={onLogin}
                                                                      />
                                                                      {hasError('passwordConfirm') && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                                                                {getError('passwordConfirm')}
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
                                                            {!isValidate() ? <View style={{...styles.okBtn, borderLeftWidth: 1, borderLeftColor: '#ddd', opacity: 0.5}}>
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