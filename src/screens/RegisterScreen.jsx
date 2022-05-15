import React, { useRef, useState } from 'react'
import { Button, FormControl, Input, useToast, WarningOutlineIcon } from 'native-base'
import { StyleSheet, View, Text, TouchableWithoutFeedback, Keyboard, useWindowDimensions, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { AntDesign } from '@expo/vector-icons'; 
import { useForm } from '../hooks/useForm';
import { useFormErrorsHandle } from '../hooks/useFormErrorsHandle';
import Loading from '../components/Loading';
import fetchApi from '../helpers/fetchApi';
import PendingInfo from '../components/PendingInfo';


export default function ResgiterScreen() {
          const navigation = useNavigation()
          const [data, handleChange, setValue, resetForm] = useForm({
                    nom: '',
                    prenom: '',
                    email: '',
                    tel: '',
                    password: '',
                    passwordConfirm: ''
          })
          const prenomRef = useRef(null)
          const emailRef = useRef(null)
          const telRef = useRef(null)
          const passwordRef = useRef(null)
          const passwordConfirmRef = useRef(null)
          const toast = useToast()
          const [loading, setLoading] = useState(false)
          const [success, setSuccess] = useState(false)

          const { isValidate, checkFieldData, getError, hasError, setErrors } = useFormErrorsHandle(data, {
                    nom: 'required',
                    prenom: 'required',
                    email: 'required,email',
                    tel: {
                              required: true,
                              number: true,
                              length: [8, 8]
                    },
                    password: {
                              required: true,
                              length: [8]
                    },
                    passwordConfirm: {
                              required: true,
                              match: 'password'
                    }
          }, {
                    nom: {
                              required: 'Le nom est requis'
                    },
                    prenom: {
                              required: 'Le prénom est requis'
                    },
                    email: {
                              required: "L'email est requis",
                              email: 'Email invalide'
                    },
                    tel: {
                              required: "Le numéro est requis",
                              number: "Numéro invalide",
                              length: "Numéro invalide"
                    },
                    password: {
                              required: "Le mot de passe est requis",
                              length: "Mot de passe trop court (8 caractères au min)"
                    },
                    passwordConfirm: {
                              required: "Ce champ est requis",
                              match: "Les mots de passe ne correspondent pas"
                    }
          })

          const onGoBack = () => {
                    Keyboard.dismiss()
                    navigation.navigate('Login')
          }

          const onSubmit = async () => {
                    Keyboard.dismiss()
                    if(isValidate())  {
                              setErrors({})
                              setLoading(true)
                              try  { 
                                        const driver = await fetchApi('/declarations/driver', {
                                                  method: 'POST',
                                                  body: JSON.stringify({
                                                            NOM_CHAFFEUR: data.nom,
                                                            PRENOM_CHAUFFEUR: data.prenom,
                                                            EMAIL: data.email,
                                                            TELEPHONE: data.tel.toString(),
                                                            MOT_DE_PASSE: data.password
                                                  }),
                                                  headers: {
                                                            'Content-Type': 'application/json'
                                                  }
                                        })
                                        setSuccess(true)
                                        resetForm()
                              } catch(error) {
                                        console.log(error)
                                        if(error.errors) {
                                                  setErrors(error.errors)
                                        } else {
                                                  toast.show({
                                                            title: 'Problème de connexion',
                                                            status: 'error',
                                                            duration: 3000,
                                                            maxWidth: '95%'
                                                  })
                                        }
                              }
                              setLoading(false)
                    } else {
                              toast.show({
                                        title: 'Merci de corriger les erreurs',
                                        status: 'error',
                                        duration: 3000,
                                        maxWidth: '95%'
                              })
                    }
          }
          const { height } = useWindowDimensions()
          return (
                    <ScrollView keyboardShouldPersistTaps='always'>
                              <View style={{...styles.container, minHeight: height-40}}>
                                        {loading && <Loading simple />}
                                        {success && <PendingInfo onClose={() => setSuccess(false)} />}
                                        <TouchableWithoutFeedback onPress={onGoBack }>
                                                  <View style={styles.closeBtn}>
                                                            <AntDesign name="close" size={24} color="black" />
                                                  </View>
                                        </TouchableWithoutFeedback>
                                        <View style={styles.content}>
                                                  <Text style={styles.title}>
                                                            Création de compte
                                                  </Text>
                                                  <View style={styles.Inputs}>
                                                            <FormControl isRequired isInvalid={hasError('nom')}>
                                                                      <Input
                                                                                placeholder='Nom'
                                                                                size='lg'
                                                                                borderRadius={10}
                                                                                mt={5}
                                                                                backgroundColor="#f1f1f1"
                                                                                value={data.nom}
                                                                                onChangeText={n => handleChange('nom', n)}
                                                                                onBlur={() => checkFieldData('nom')}
                                                                                // // isDisabled={loading}
                                                                                returnKeyType='next'
                                                                                blurOnSubmit={false}
                                                                                onSubmitEditing={() => prenomRef?.current.focus() }
                                                                      />
                                                                      {hasError('nom') && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                                                                {getError('nom')}
                                                                      </FormControl.ErrorMessage>}
                                                            </FormControl>
                                                            <FormControl isRequired isInvalid={hasError('prenom')}>
                                                                      <Input
                                                                                placeholder='Prénom'
                                                                                size='lg'
                                                                                borderRadius={10}
                                                                                mt={5}
                                                                                backgroundColor="#f1f1f1"
                                                                                value={data.prenom}
                                                                                onChangeText={n => handleChange('prenom', n)}
                                                                                onBlur={() => checkFieldData('prenom')}
                                                                                ref={prenomRef}
                                                                                // // isDisabled={loading}
                                                                                returnKeyType='next'
                                                                                blurOnSubmit={false}
                                                                                onSubmitEditing={() => emailRef?.current.focus() }
                                                                                // onSubmitEditing={onLogin}
                                                                      />
                                                                      {hasError('prenom') && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                                                                {getError('prenom')}
                                                                      </FormControl.ErrorMessage>}
                                                            </FormControl>
                                                            <FormControl isRequired isInvalid={hasError('email')}>
                                                                      <Input
                                                                                placeholder='Email'
                                                                                keyboardType="email-address"
                                                                                size='lg'
                                                                                borderRadius={10}
                                                                                mt={5}
                                                                                backgroundColor="#f1f1f1"
                                                                                value={data.email}
                                                                                onChangeText={n => handleChange('email', n)}
                                                                                onBlur={() => checkFieldData('email')}
                                                                                // // isDisabled={loading}
                                                                                ref={emailRef}
                                                                                returnKeyType='next'
                                                                                blurOnSubmit={false}
                                                                                onSubmitEditing={() => telRef?.current.focus() }
                                                                                // onSubmitEditing={onLogin}
                                                                      />
                                                                      {hasError('email') && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                                                                {getError('email')}
                                                                      </FormControl.ErrorMessage>}
                                                            </FormControl>
                                                            <FormControl isRequired isInvalid={hasError('tel')}>
                                                                      <Input
                                                                                placeholder='Téléphone'
                                                                                keyboardType="number-pad"
                                                                                size='lg'
                                                                                borderRadius={10}
                                                                                mt={5}
                                                                                backgroundColor="#f1f1f1"
                                                                                value={data.tel}
                                                                                onChangeText={n => handleChange('tel', n)}
                                                                                onBlur={() => checkFieldData('tel')}
                                                                                // // isDisabled={loading}
                                                                                ref={telRef}
                                                                                returnKeyType='next'
                                                                                blurOnSubmit={false}
                                                                                onSubmitEditing={() => passwordRef?.current.focus() }
                                                                                // onSubmitEditing={onLogin}
                                                                      />
                                                                      {hasError('tel') && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                                                                {getError('tel')}
                                                                      </FormControl.ErrorMessage>}
                                                            </FormControl>
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
                                                                                ref={passwordRef}
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
                                                            <Button borderRadius={20} size="lg" marginTop={5} background={"#58A0EB"} 
                                                                      onPress={onSubmit}
                                                                      isDisabled={!isValidate()}
                                                                      >
                                                                      S'inscrire
                                                            </Button>
                                                  </View>
                                                  <TouchableWithoutFeedback onPress={onGoBack}>
                                                            <Text style={styles.loginText}>Retour à la connexion</Text>
                                                  </TouchableWithoutFeedback>
                                        </View>
                              </View>
                    </ScrollView>
          )
}


const styles = StyleSheet.create({
          container: {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#fff'
          },
          closeBtn: {
                    position: 'absolute',
                    top: 20,
                    right: 30
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
          content: {
                    width: '100%',
          },
          Inputs: {
                    paddingHorizontal: 20
          },
          loginText: {
                    color: '#58A0EB',
                    marginTop: 10,
                    textAlign: 'center',
                    fontSize: 16
          }
})