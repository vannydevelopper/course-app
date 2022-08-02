import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, TouchableNativeFeedback, ActivityIndicator, useWindowDimensions } from 'react-native'
import { AntDesign, Feather , MaterialCommunityIcons} from '@expo/vector-icons'; 
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setDestinationAction, setPickupAction, setRouteAction, setAutreDestinationAction, setAutrePickupAction, setModeAction } from '../store/actions/appActions';
import { Icon, Input } from 'native-base';
import { autreDestinationSelector, autrePickupSelector, corporateSelector, destinationSelector, modeSelector, pickupSelector, routeSelector } from '../store/selectors/appSelectors';
import Header from '../components/Header';
import useFetch from '../hooks/useFetch';
import Skeletons from '../components/Skeletons';
import fetchApi from '../helpers/fetchApi';


export default function PickUpScreen() {
          const pickUpRef = useRef(null)
          const destinationRef = useRef(null)
          const typeRef = useRef(null)

          const [loading, setLoading] = useState(false)
          const navigation = useNavigation()
          const dispatch = useDispatch()
          const route = useRoute()
          const selectedMode = useSelector(modeSelector)
          
          useFocusEffect(useCallback(() => {
                    dispatch(setRouteAction(route.name))
          }, []))

          const selectedCorporate = useSelector(corporateSelector)
          const selectedPickup = useSelector(pickupSelector)
          const selectedDestination = useSelector(destinationSelector)
          const autrePickup = useSelector(autrePickupSelector)
          const autreDestination = useSelector(autreDestinationSelector)

          const [loadingPickup, pickups] = useFetch(`/pick_up/${selectedCorporate?.ID_CORPORATE}?limit=20`)
          const [loadingDestinations, destinations] = useFetch(`/destination/${selectedCorporate?.ID_CORPORATE}?limit=20`)
          const [loadingMode, modes] = useFetch("/mode")

          const routeName = useSelector(routeSelector)

          // useEffect(() => {
          //      if(selectedMode == null) {
          //                dispatch(setModeAction(modes.find(mode => mode.ID_MODE == 1)))
          //      }
          // }, [modes])

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
                    const [loading, setLoading] = useState(true)
                    const { height } = useWindowDimensions()
                    const getDefaultQ = () => {
                              if(selectedPickup) {
                                        if(selectedPickup == 'autre') {
                                                  return ''
                                        }
                                        return getPickupLabel()
                              } else {
                                        return ''
                              }
                    }
                    const [q, setQ] = useState(getDefaultQ())
                    const [result, setResult] = useState([])
                    const [loadingQ, setLoadingQ] = useState(false)
                    useEffect(() => {
                              (async () => {
                                        if(q != '') {
                                                  const clients = await fetchApi(`/pick_up/${selectedCorporate?.ID_CORPORATE}?limit=20&q=${q}`)
                                                  setResult(clients)
                                        }
                                        setLoadingQ(false)
                              })()
                    }, [q])
                    useEffect(() => {
                              const timer = setTimeout(() => {
                                        setLoading(false)
                              })
                              return () => {
                                        clearTimeout(timer)
                              }
                    }, [])
                    const pickupsToShow = q != '' ? result : pickups
                    if(loading || loadingPickup) {
                              return <ActivityIndicator animating={true} size="large" color={"#000"} style={{ marginTop: (height-50) / 2}} />
                    }
                    return (
                              <View style={styles.modalContent}>
                                        <View style={{ paddingHorizontal: 15 }}>
                                        <Input
                                                  placeholder="Chercher le pickup"
                                                  size='lg'
                                                  borderRadius={10}
                                                  value={q}
                                                  onChangeText={n => setQ(n)}
                                                  onChange={() => setLoadingQ(true)}
                                                  mt={3}
                                                  backgroundColor="#f1f1f1"
                                                  InputLeftElement={
                                                            <Icon
                                                                      as={<Feather name="search" size={24} color="black" />}
                                                                      size={5}
                                                                      ml="2"
                                                                      color="muted.400"
                                                            />}
                                        />
                                        </View>
                                        {loadingQ ? <View style={{ flexDirection: 'row', alignItems: 'center', margin: 15}}>
                                                  <Text style={{ color: '#777'}}>Recherche...</Text>
                                                  <ActivityIndicator animating={true} size="small" color={"#777"} style={{ marginLeft: 5 }} />
                                        </View> :
                                        <View style={styles.modalList}>
                                                  <TouchableNativeFeedback onPress={() => onPickUpSelect('autre')}>
                                                            <View style={styles.modalItem}>
                                                                      {selectedPickup == 'autre' ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                                                                      <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                      <Text numberOfLines={1} style={styles.modalText}>Autres pick up</Text>
                                                            </View>
                                                  </TouchableNativeFeedback>
                                                  {pickupsToShow.map((pickUp, index) => {
                                                            return <TouchableNativeFeedback onPress={() => onPickUpSelect(pickUp)} key={index}>
                                                                                <View style={styles.modalItem}>
                                                                                          {selectedPickup?.PICK_UP_ID == pickUp.PICK_UP_ID ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                                                                                          <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                                          <Text numberOfLines={1} style={styles.modalText}>{ pickUp.DESCRIPTION }</Text>
                                                                                </View>
                                                                      </TouchableNativeFeedback>
                                                  })}
                                        </View>}
                              </View>
                    )
          }
          const DestinationModalize = () => {
                    const onDestinationSelect = (destination) => {
                              destinationRef.current.close()
                              dispatch(setDestinationAction(destination))
                    }
                    const [loading, setLoading] = useState(true)
                    const { height } = useWindowDimensions()
                    const getDefaultQ = () => {
                              if(selectedDestination) {
                                        if(selectedDestination == 'autre') {
                                                  return ''
                                        }
                                        return getDestinationLabel()
                              } else {
                                        return ''
                              }
                    }
                    const [q, setQ] = useState(getDefaultQ())
                    const [result, setResult] = useState([])
                    const [loadingQ, setLoadingQ] = useState(false)
                    useEffect(() => {
                              (async () => {
                                        if(q != '') {
                                                  const clients = await fetchApi(`/destination/${selectedCorporate?.ID_CORPORATE}?limit=20&q=${q}`)
                                                  setResult(clients)
                                        }
                                        setLoadingQ(false)
                              })()
                    }, [q])
                    useEffect(() => {
                              const timer = setTimeout(() => {
                                        setLoading(false)
                              })
                              return () => {
                                        clearTimeout(timer)
                              }
                    }, [])
                    const destinationsToShow = q != '' ? result : destinations
                    if(loading || loadingDestinations) {
                              return <ActivityIndicator animating={true} size="large" color={"#000"} style={{ marginTop: (height-50) / 2}} />
                    }
                    return (
                              <View style={styles.modalContent}>
                                        <View style={{ paddingHorizontal: 15 }}>
                                        <Input
                                                  placeholder="Chercher la destination"
                                                  size='lg'
                                                  borderRadius={10}
                                                  value={q}
                                                  onChangeText={n => setQ(n)}
                                                  onChange={() => setLoadingQ(true)}
                                                  mt={3}
                                                  backgroundColor="#f1f1f1"
                                                  InputLeftElement={
                                                            <Icon
                                                                      as={<Feather name="search" size={24} color="black" />}
                                                                      size={5}
                                                                      ml="2"
                                                                      color="muted.400"
                                                            />}
                                        />
                                        </View>
                                        {loadingQ ? <View style={{ flexDirection: 'row', alignItems: 'center', margin: 15}}>
                                                  <Text style={{ color: '#777'}}>Recherche...</Text>
                                                  <ActivityIndicator animating={true} size="small" color={"#777"} style={{ marginLeft: 5 }} />
                                        </View> :
                                        <View style={styles.modalList}>
                                                  <TouchableNativeFeedback onPress={() => onDestinationSelect('autre')}>
                                                            <View style={styles.modalItem}>
                                                                      {selectedDestination == 'autre' ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                                                                      <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                      <Text numberOfLines={1} style={styles.modalText}>Autres destination</Text>
                                                            </View>
                                                  </TouchableNativeFeedback>
                                                  {destinationsToShow.map((destination, index) => {
                                                            return <TouchableNativeFeedback onPress={() => onDestinationSelect(destination)} key={index}>
                                                                                <View style={styles.modalItem}>
                                                                                          {selectedDestination?.DESTINATION_ID == destination.DESTINATION_ID ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                                                                                          <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                                          <Text numberOfLines={1} style={styles.modalText}>{ destination?.DESCRIPTION }</Text>
                                                                                </View>
                                                                      </TouchableNativeFeedback>
                                                  })}
                                        </View>}
                              </View>
                    )
          }

          const ModeModalaze = () =>{
               const dispatch = useDispatch()
               const onTypeSelect = (mode) => {
                    typeRef.current.close()
                    dispatch(setModeAction(mode))
               }

               return(
                    <View style={styles.modalContent}>
                         <View style={styles.modalList}>
                             {modes.map(mode => <TouchableNativeFeedback onPress={() => onTypeSelect(mode)} key={mode.ID_MODE.toString()}>
                                   <View style={styles.modalItem}>
                                       {selectedMode?.ID_MODE == mode.ID_MODE ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" />:
                                        <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                        <Text numberOfLines={1} style={styles.modalText}>{mode.MODE_COURSE}</Text>
                                   </View>
                              </TouchableNativeFeedback>)}
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
                                        <View style={styles.formGroup}>
                                                  <Text style={styles.title}>
                                                            Mode
                                                  </Text>
                                             <TouchableOpacity onPress={() => typeRef.current.open()} style={styles.openModalize}>
                                                  <Text style={styles.openModalizeLabel} numberOfLines={1}>
                                                       {selectedMode?.MODE_COURSE ?? "Sélectionner la réponse"}
                                                  </Text>
                                                  <AntDesign name="caretdown" size={16} color="#777" />
                                             </TouchableOpacity>
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
                    <Portal>
                         <Modalize ref={typeRef} handleStyle={{ display: 'none' }} modalStyle={{borderTopRightRadius: 20, borderTopLeftRadius: 20}}>
                              <ModeModalaze/>
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