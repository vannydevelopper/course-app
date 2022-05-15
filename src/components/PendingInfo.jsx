import React, { useEffect } from 'react'
import { View, Text, StyleSheet, BackHandler, TouchableNativeFeedback } from 'react-native'
import { Portal } from 'react-native-portalize'
import LottieView from 'lottie-react-native';
import { AntDesign } from '@expo/vector-icons'; 

export default function PendingInfo({ onClose, isLoging }) {
          useEffect(() => {
                    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
                              onClose()
                              return true
                    })
                    return () => {
                              handler.remove()
                    }
          }, [])
          var title = "Compte créé avec succès"
          if(isLoging) {
                    title = "Compte non confirmé"
          }
          return (
                    <Portal>
                              <View style={styles.loadingContainer}>
                                        <View style={{...styles.content}}>
                                                  <Text style={styles.modalTitle}>
                                                            { title }
                                                  </Text>
                                                  {isLoging ? <AntDesign name="closecircle" size={60} color="#d6544d" style={{ marginVertical: 20 }} /> :
                                                  <LottieView style={{width: 150, height: 150, marginVertical: -10, marginBottom: -30}} source={require('../../assets/check.json')} autoPlay loop={false} />}
                                                  <Text style={styles.infoDesc}>
                                                            Merci d'attendre que votre compte soit confirmé
                                                  </Text>
                                                  <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#c4c4c4')} useForeground={false} onPress={onClose}>
                                                            <View style={styles.okBtn}>
                                                                      <Text style={styles.okBtnText}>
                                                                                Ok
                                                                      </Text>
                                                            </View>
                                                  </TouchableNativeFeedback>
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
                    marginBottom: 20
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
          }
})