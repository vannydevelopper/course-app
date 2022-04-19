import React, { useCallback, useRef, useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, TouchableNativeFeedback } from 'react-native'
import { AntDesign, FontAwesome , MaterialCommunityIcons} from '@expo/vector-icons'; 
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { setRouteAction, setKilometreAction, setDureeAction, setMontantAction } from '../store/actions/appActions';
import { Input } from 'native-base';
import { kilometreSelector, dureeSelector, montantSelector, routeSelector } from '../store/selectors/appSelectors';
import Header from '../components/Header';


const Skeletons = () => {
          return (
          <View style={{alignItems:"center", paddingTop: 15}}>
                    {new Array(3).fill(0).map((fe, i) => <View key={i.toString()} style={{backgroundColor: '#e8e7e7', padding: 10, width: '100%', borderRadius: 10, flexDirection: 'row', marginTop: i > 0 ? 10 : 0}}>
                              <View style={{width:30, height: 30, borderRadius: 50, backgroundColor: '#fff'}} />
                              <View style={{borderRadius: 10, backgroundColor: '#e8e7e7', flex: 1, marginLeft: 5}}>
                                        <View style={{flex: 1, height: 20, borderRadius: 2, backgroundColor: '#fff'}} />
                                        <View style={{borderRadius: 10, backgroundColor: '#e8e7e7', width: '100%', justifyContent: 'space-between', flexDirection: 'row', marginTop: 5}}>
                                                  <View style={{width:'30%', height: 10, borderRadius: 2, backgroundColor: '#fff'}} />
                                                  <View style={{width:'30%', height: 10, borderRadius: 2, backgroundColor: '#fff'}} />
                                        </View>
                              </View>
                    </View>)}
          </View>
          )
}

export default function TrajetScreen() {
          const dispatch = useDispatch()
          const route = useRoute()
          const navigation = useNavigation()
          
          useFocusEffect(useCallback(() => {
                    dispatch(setRouteAction(route.name))
          }, []))
          const dureeInputRef = useRef(null)
          const montantInputRef = useRef(null)

          const kilometre = useSelector(kilometreSelector)
          const duree = useSelector(dureeSelector)
          const montant = useSelector(montantSelector)
          
          const routeName = useSelector(routeSelector)

          const onKilometreChange = (kilometre) => {
                    dispatch(setKilometreAction(kilometre))
          }
          const onDureeChange = (duree) => {
                    dispatch(setDureeAction(duree))
          }
          const onMontantChange = (montant) => {
                    dispatch(setMontantAction(montant))
          }
          return (
                    <>
                    <View style={styles.container}>
                              {/* {(routeName == 'Trajet' || routeName == 'Login' ) && <Header />} */}
                              <View style={styles.formGroup}>
                                        <Text style={styles.title}>
                                                  Kilomètrage
                                        </Text>
                                        <Input
                                                  placeholder='Ex: 3.35'
                                                  keyboardType="decimal-pad"
                                                  size='lg'
                                                  value={kilometre}
                                                  onChangeText={onKilometreChange}
                                                  borderRadius={10}
                                                  backgroundColor="#f1f1f1"
                                                  returnKeyType="next"
                                                  onSubmitEditing={() => dureeInputRef.current.focus()}
                                        />
                              </View>
                              <View style={styles.formGroup}>
                                        <Text style={styles.title}>
                                                  Durée du trajet
                                        </Text>
                                        <Input
                                                  placeholder='Ex: 3.35 (min)'
                                                  keyboardType="decimal-pad"
                                                  size='lg'
                                                  value={duree}
                                                  onChangeText={onDureeChange}
                                                  borderRadius={10}
                                                  backgroundColor="#f1f1f1"
                                                  ref={dureeInputRef}
                                                  returnKeyType="next"
                                                  onSubmitEditing={() => montantInputRef.current.focus()}
                                        />
                              </View>
                              <View style={styles.formGroup}>
                                        <Text style={styles.title}>
                                                  Montant
                                        </Text>
                                        <Input
                                                  keyboardType="decimal-pad"
                                                  size='lg'
                                                  value={montant}
                                                  onChangeText={onMontantChange}
                                                  borderRadius={10}
                                                  backgroundColor="#f1f1f1"
                                                  ref={montantInputRef}
                                        />
                              </View>
                    </View>
                    </>
          )
}

const styles = StyleSheet.create({
          container: {
                    flex: 1,
                    backgroundColor: '#fff',
                    paddingHorizontal: 20
          },
          title: {
                    color: '#777',
                    fontWeight: 'bold',
                    fontSize: 16,
                    marginVertical: 10,
                    marginTop: 30
          },
          
          openModalize: {
                    backgroundColor: '#dde1ed',
                    padding: 10,
                    borderRadius: 5,
                    marginTop: 5,
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'space-between'
          },
          openModalizeLabel: {
                    color: '#555',
                    fontSize: 14,
          },
          modalContent: {
                    paddingVertical: 20
          },
          modalItem: {
                    paddingVertical: 10,
                    paddingHorizontal: 25,
                    marginTop: 5,
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignContent: 'center'
          },
          modalText: {
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginLeft: 10
          },
})