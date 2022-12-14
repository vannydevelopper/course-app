import React from "react";
import { View, StyleSheet, Text, TouchableNativeFeedback, Image } from 'react-native'
import { SharedElement } from 'react-navigation-shared-element'
import { MaterialIcons, Feather } from '@expo/vector-icons'; 
import { useDispatch, useSelector } from "react-redux";
import { unsetUserAction } from "../store/actions/userActions";
import { userSelector } from "../store/selectors/userSelector";
import { resetAction } from "../store/actions/appActions";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Header() {
          const dispatch = useDispatch()
          const navigation = useNavigation()
          const onExit = async () => {
                    await AsyncStorage.removeItem('user')
                    dispatch(resetAction())
                    dispatch(unsetUserAction())
          }
          const user = useSelector(userSelector)
          return (
                    <SharedElement  id={"header"} style={{ height: 70 }}>
                              <View style={styles.header}>
                                        <Image source={require('../../assets/wasili-icon.png')} style={{width: 100, height: 60, marginHorizontal: -20, marginVertical: 0, marginTop: 20, marginLeft: -30}} />
                                        <View style={styles.headerDesc}>
                                                  <Text style={styles.headerTitle} numberOfLines={1}>
                                                            {user ? user?.NOM_CHAFFEUR +' '+ user?.PRENOM_CHAUFFEUR : 'Connexion' }
                                                  </Text>
                                                  <Text style={styles.headerSecTitle} numberOfLines={1}>Déclaration de course</Text>
                                        </View>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                  {user?.ID_DRIVER_KCB && <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#c4c4c4')} useForeground={true} onPress={() => navigation.navigate('Notifications')}>
                                                            <View style={styles.exitButton}>
                                                                      <Feather name="bell" size={24} color="#777" />
                                                            </View>
                                                  </TouchableNativeFeedback>}
                                                  <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#c4c4c4')} useForeground={true} onPress={() => navigation.navigate('History')}>
                                                            <View style={styles.exitButton}>
                                                                      <Feather name="list" size={24} color="#777" />
                                                            </View>
                                                  </TouchableNativeFeedback>
                                                  <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#c4c4c4')} useForeground={true} onPress={onExit}>
                                                            <View style={styles.exitButton}>
                                                                      <MaterialIcons name="logout" size={24} color="#777" />
                                                            </View>
                                                  </TouchableNativeFeedback>
                                        </View>
                              </View>
                    </SharedElement>
          )
}

const styles = StyleSheet.create({
          
          header: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: '100%',
                    maxHeight: 60,
                    resizeMode: 'contain',
                    backgroundColor: '#fff',
                    width: '100%',
                    paddingVertical: 10,
                    paddingHorizontal: 20
          },
          headerDesc: {
                    flex :1,
                    height: '100%',
                    justifyContent: 'space-between',
          },
          headerTitle: {
                    fontWeight: 'bold',
                    fontSize: 16,
                    width: '90%'
          },
          headerSecTitle: {
                    fontWeight: 'bold',
                    color: '#777',
                    fontSize: 16
          },
          exitButton: {
                    padding: 10,
                    borderRadius: 10,
                    overflow: 'hidden'
          }
})