import React, { useCallback, useRef, useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, TouchableNativeFeedback } from 'react-native'
import { AntDesign, FontAwesome , MaterialCommunityIcons} from '@expo/vector-icons'; 
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setDestinationAction, setPickupAction, setRouteAction, setAutreDestinationAction, setAutrePickupAction } from '../store/actions/appActions';
import { Input } from 'native-base';
import { autreDestinationSelector, autrePickupSelector, corporateSelector, destinationSelector, pickupSelector, routeSelector } from '../store/selectors/appSelectors';
import Header from '../components/Header';
import useFetch from '../hooks/useFetch';
import Skeletons from '../components/Skeletons';


export default function PickUpScreen() {
          const pickUpRef = useRef(null)
          const destinationRef = useRef(null)

          const [loading, setLoading] = useState(false)
          const navigation = useNavigation()
          const dispatch = useDispatch()
          const route = useRoute()
          
          useFocusEffect(useCallback(() => {
                    dispatch(setRouteAction(route.name))
          }, []))

          const selectedCorporate = useSelector(corporateSelector)
          const selectedPickup = useSelector(pickupSelector)
          const selectedDestination = useSelector(destinationSelector)
          const autrePickup = useSelector(autrePickupSelector)
          const autreDestination = useSelector(autreDestinationSelector)

          const [loadingPickup, pickups] = useFetch(`/pick_up/${selectedCorporate?.ID_CORPORATE}?limit=100`)
          const [loadingDestinations, destinations] = useFetch(`/destination/${selectedCorporate?.ID_CORPORATE}?limit=100`)

          const routeName = useSelector(routeSelector)

          const onAutrePickupChange = (pickup) => {
                    dispatch(setAutrePickupAction(pickup))
          }

          const onAutreDestinationChange = (destination) => {
                    dispatch(setAutreDestinationAction(destination))
          }

          const PickUpModalize = () => {

                    const onPickUpSelect = (pickUp) => {
                              pickUpRef.current.close()
                              dispatch(setPickupAction(pickUp))
                    }
                    return (
                              <View style={styles.modalContent}>
                                        <View style={styles.modalList}>
                                                  {loadingPickup ? <Skeletons /> :
                                                            <>
                                                            <TouchableNativeFeedback onPress={() => onPickUpSelect('autre')}>
                                                                      <View style={styles.modalItem}>
                                                                                {selectedPickup == 'autre' ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                                                                                <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                                <Text numberOfLines={1} style={styles.modalText}>Autres pick up</Text>
                                                                      </View>
                                                            </TouchableNativeFeedback>
                                                            {pickups.map((pickUp, index) => {
                                                                      return <TouchableNativeFeedback onPress={() => onPickUpSelect(pickUp)} key={index}>
                                                                                          <View style={styles.modalItem}>
                                                                                                    {selectedPickup?.PICK_UP_ID == pickUp.PICK_UP_ID ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                                                                                                    <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                                                    <Text numberOfLines={1} style={styles.modalText}>{ pickUp.DESCRIPTION }</Text>
                                                                                          </View>
                                                                                </TouchableNativeFeedback>
                                                            })}
                                                            </>
                                                  }
                                        </View>
                              </View>
                    )
          }
          const DestinationModalize = () => {
                    const onDestinationSelect = (destination) => {
                              destinationRef.current.close()
                              dispatch(setDestinationAction(destination))
                    }
                    return (
                              <View style={styles.modalContent}>
                                        <View style={styles.modalList}>
                                                  {loadingDestinations ? <Skeletons /> :
                                                            <>
                                                            <TouchableNativeFeedback onPress={() => onDestinationSelect('autre')}>
                                                                      <View style={styles.modalItem}>
                                                                                {selectedDestination == 'autre' ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                                                                                <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                                <Text numberOfLines={1} style={styles.modalText}>Autres destination</Text>
                                                                      </View>
                                                            </TouchableNativeFeedback>
                                                            {destinations.map((destination, index) => {
                                                                      return <TouchableNativeFeedback onPress={() => onDestinationSelect(destination)} key={index}>
                                                                                          <View style={styles.modalItem}>
                                                                                                    {selectedDestination?.DESTINATION_ID == destination.DESTINATION_ID ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                                                                                                    <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                                                    <Text numberOfLines={1} style={styles.modalText}>{ destination?.DESCRIPTION }</Text>
                                                                                          </View>
                                                                                </TouchableNativeFeedback>
                                                            })}
                                                            </>
                                                  }
                                        </View>
                              </View>
                    )
          }

          const getPickupLabel = () => {
                    if(selectedPickup?.DESCRIPTION) {
                              return selectedPickup.DESCRIPTION
                    } else if(selectedPickup == 'autre') {
                              return 'Autre'
                    }
                    return 'Sélectionner la réponse'
          }
          const getDestinationLabel = () => {
                    if(selectedDestination?.DESCRIPTION) {
                              return selectedDestination.DESCRIPTION
                    } else if(selectedDestination == 'autre') {
                              return 'Autres destination'
                    }
                    return 'Sélectionner la réponse'
          }
          return (
                    <>
                    <View style={styles.container}>
                              {false && <Header />}
                              <View style={{ paddingHorizontal: 20}}>
                                        <View style={styles.formGroup}>
                                                  <Text style={styles.title}>
                                                            Pick up
                                                  </Text>
                                                  <TouchableOpacity onPress={() => pickUpRef.current.open()} style={styles.openModalize}>
                                                            <Text style={styles.openModalizeLabel} numberOfLines={1}>
                                                                      { getPickupLabel() }
                                                            </Text>
                                                            <AntDesign name="caretdown" size={16} color="#777" />
                                                  </TouchableOpacity>
                                                  {selectedPickup == 'autre' && <Input
                                                            placeholder="Précisez l'autre pick up"
                                                            size='lg'
                                                            value={autrePickup}
                                                            onChangeText={onAutrePickupChange}
                                                            borderRadius={10}
                                                            mt={3}
                                                            backgroundColor="#f1f1f1"
                                                            multiline
                                                            maxHeight={150}
                                                  />}
                                        </View>
                                        <View style={styles.formGroup}>
                                                  <Text style={styles.title}>
                                                            Destination
                                                  </Text>
                                                  <TouchableOpacity onPress={() => destinationRef.current.open()} style={styles.openModalize}>
                                                            <Text style={styles.openModalizeLabel} numberOfLines={1}>
                                                                      { getDestinationLabel() }
                                                            </Text>
                                                            <AntDesign name="caretdown" size={16} color="#777" />
                                                  </TouchableOpacity>
                                                  {selectedDestination == 'autre' && <Input
                                                            placeholder="Précisez l'autre destination"
                                                            size='lg'
                                                            value={autreDestination}
                                                            onChangeText={onAutreDestinationChange}
                                                            borderRadius={10}
                                                            mt={3}
                                                            backgroundColor="#f1f1f1"
                                                            multiline
                                                            maxHeight={150}
                                                  />}
                                        </View>
                              </View>
                    </View>
                    <Portal>
                              <Modalize ref={pickUpRef} handleStyle={{ display: 'none' }} modalStyle={{borderTopRightRadius: 20, borderTopLeftRadius: 20}}>
                                        <PickUpModalize />
                              </Modalize>
                    </Portal>
                    <Portal>
                              <Modalize ref={destinationRef} handleStyle={{ display: 'none' }} modalStyle={{borderTopRightRadius: 20, borderTopLeftRadius: 20}}>
                                        <DestinationModalize />
                              </Modalize>
                    </Portal>
                    </>
          )
}

const styles = StyleSheet.create({
          container: {
                    flex: 1,
                    backgroundColor: '#fff',
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
                    paddingBottom: 20
          },
          modalItem: {
                    paddingVertical: 10,
                    paddingHorizontal: 15,
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