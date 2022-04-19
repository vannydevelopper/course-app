import React, { useEffect } from 'react'
import { View, Text, StyleSheet, BackHandler } from 'react-native'
import { Portal } from 'react-native-portalize'
import LottieView from 'lottie-react-native';

export default function Loading() {
          useEffect(() => {
                    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
                              return true
                    })
                    return () => {
                              handler.remove()
                    }
          }, [])
          return (
                    <Portal>
                              <View style={styles.loadingContainer}>
                                        <View style={styles.content}>
                                                  <LottieView style={{width: 150, height: 150}} source={require('../../assets/loading.json')} autoPlay speed={1.5} />
                                                  <Text style={styles.modalTitle}>
                                                            Veuillez patienter...
                                                  </Text>
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
})