import React from "react";
import { View, StyleSheet, Text, TouchableNativeFeedback, Image } from 'react-native'
import { SharedElement } from 'react-navigation-shared-element'
import { MaterialIcons} from '@expo/vector-icons'; 
import { useDispatch, useSelector } from "react-redux";
import { unsetUserAction } from "../store/actions/userActions";
import { userSelector } from "../store/selectors/userSelector";

export default function Header() {
          const dispatch = useDispatch()
          const onExit = () => {
                    dispatch(unsetUserAction())
          }
          const user = useSelector(userSelector)
          return (
                    <SharedElement  id={"header"} style={{height: 80}}>
                              <View style={styles.header}>
                                        <Image source={require('../../assets/wasili.png')} style={{width: 85, height: 60, marginHorizontal: -10, marginVertical: -16, marginLeft: -20}} />
                                        <View style={styles.headerDesc}>
                                                  <Text style={styles.headerTitle} numberOfLines={1}>
                                                            {user ? user?.NOM_CHAFFEUR +' '+ user?.PRENOM_CHAUFFEUR : 'Connexion' }
                                                  </Text>
                                                  <Text style={styles.headerSecTitle}>Déclaration de course</Text>
                                        </View>
                                        <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#c4c4c4')} useForeground={true} onPress={onExit}>
                                                  <View style={styles.exitButton}>
                                                            <MaterialIcons name="logout" size={24} color="#777" />
                                                  </View>
                                        </TouchableNativeFeedback>
                              </View>
                    </SharedElement>
          )
}

const styles = StyleSheet.create({
          
          header: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: '100%',
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
                    padding: 15,
                    borderRadius: 10,
                    overflow: 'hidden'
          }
})