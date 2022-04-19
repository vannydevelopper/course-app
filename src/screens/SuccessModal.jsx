import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { View, StyleSheet, Text, TouchableNativeFeedback, BackHandler } from 'react-native'
import { useDispatch } from 'react-redux'
import { setRouteAction } from '../store/actions/appActions'
import LottieView from 'lottie-react-native';

export default function SuccessModal() {
          const navigation = useNavigation()
          const dispatch = useDispatch()
          const route = useRoute()
          navigation.addListener('focus', () => {
                    dispatch(setRouteAction(route.name))
          })
          const onExit = () => {
                    navigation.navigate("DeclarationType")
          }
          useEffect(() => {
                    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
                              return onExit()
                    })
                    return () => {
                              handler.remove()
                    }
          }, [])
          return (
                    <View intensity={100} tint="dark" style={styles.modal}>
                              <View style={styles.content}>
                                        <Text style={styles.modalTitle}>
                                                  Course déclarée
                                        </Text>
                                        <LottieView style={{width: 150, height: 150, marginVertical: -10}} source={require('../../assets/check.json')} autoPlay loop={false} />
                                        <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#c4c4c4')} useForeground={false} onPress={() => onExit()}>
                                                  <View style={styles.okBtn}>
                                                            <Text style={styles.okBtnText}>
                                                                      Ok
                                                            </Text>
                                                  </View>
                                        </TouchableNativeFeedback>
                              </View>
                    </View>
          )
}

const styles = StyleSheet.create({
          modal: {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
                    width: '80%',
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
                    marginTop: 20
          },
          okBtn: {
                    width: '100%',
                    paddingVertical: 20,
                    borderTopColor: '#ddd',
                    borderTopWidth: 1,
                    overflow: 'hidden'
          },
          okBtnText: {
                    fontWeight: 'bold',
                    color: '#58A0EB',
                    textAlign: 'center',
                    fontSize: 17
          }
})