
import { View, Text, ScrollView, TouchableOpacity, TouchableNativeFeedback, StyleSheet, useWindowDimensions, ActivityIndicator, Platform } from 'react-native'
import { AntDesign, MaterialIcons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { annulerParSelector, raisonAnnulationSelector, raisonSelector, typeSelector, demandeDateSelector, demandeTimeSelector, annulerDateSelector, annulerTimeSelector } from '../store/selectors/appSelectors';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import fetchApi from '../helpers/fetchApi';
import { setAnnulerParAction, setDemandeDate, setDemandeTime, setRaisonAction, setRaisonAnnulationAction, setRouteAction, setAnnulerDate, setAnnulerTime } from '../store/actions/appActions';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Icon } from 'native-base';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';


export default function AnnulerScreen() {
          const route = useRoute()
          const navigation = useNavigation()
          const dispatch = useDispatch()
          const [showCalendar, setShowCalendar] = useState(false)
          const [showTime, setShowTime] = useState(false)
          const [showAnnulerCalendar, setShowAnnulerCalendar] = useState(false)
          const [showAnnulerTime, setShowAnnulerTime] = useState(false)
          
          useFocusEffect(useCallback(() => {
                    dispatch(setRouteAction(route.name))
          }, []))

          
          const dateDebut= useSelector(demandeDateSelector)
          const time = useSelector(demandeTimeSelector)

          const annulerDate= useSelector(annulerDateSelector)
          const annulerTime = useSelector(annulerTimeSelector)
          
          const annulerParRef = useRef(null)
          const raisonRef = useRef(null)
          
          const selectedType = useSelector(typeSelector)
          const annulerPar = useSelector(annulerParSelector)
          const raisonAnnulation = useSelector(raisonAnnulationSelector)
          const selectedRaison = useSelector(raisonSelector)

          const [loadingRaisons, setLoadingRaisons] = useState(false)
          const [raisons, setRaisons] = useState([])

          useEffect(() => {
                    (async () => {
                              if (selectedType && selectedType?.TYPE_DECLARATION_ID == 2) {
                                        setLoadingRaisons(true)
                                        const raisons = await fetchApi(`/declarations/raisons?limit=20`)
                                        setRaisons(raisons)
                                        setLoadingRaisons(false)
                              }
                    })()
          }, [selectedType])
          
          const AnnulerParModalize = () => {
                    const onAnnuleSelect = (per) => {
                              annulerParRef.current.close()
                              dispatch(setAnnulerParAction(per))
                    }
                    return (
                              <View style={styles.modalContent}>
                                        <View style={styles.modalList}>
                                                  <TouchableNativeFeedback onPress={() => onAnnuleSelect(1)}>
                                                            <View style={styles.modalItem}>
                                                                      {annulerPar == 1 ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                                                                                <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                      <Text numberOfLines={1} style={styles.modalText}>Employé</Text>
                                                            </View>
                                                  </TouchableNativeFeedback>
                                                  <TouchableNativeFeedback onPress={() => onAnnuleSelect(2)}>
                                                            <View style={styles.modalItem}>
                                                                      {annulerPar == 2 ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                                                                                <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                      <Text numberOfLines={1} style={styles.modalText}>Driver</Text>
                                                            </View>
                                                  </TouchableNativeFeedback>
                                        </View>
                              </View>
                    )
          }

          const RaisonsModalize = () => {
                    const [loading, setLoading] = useState(true)
                    const { height } = useWindowDimensions()
                    const onRaisonSelect = (raison) => {
                              raisonRef.current.close()
                              dispatch(setRaisonAction(raison))
                    }
                    const getDefaultQ = () => {
                              if(selectedRaison) {
                                        if(selectedRaison == 'autre') {
                                                  return ''
                                        }
                                        return getSelectedRaisonLabel()
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
                                                  const clients = await fetchApi(`/declarations/raisons?limit=20&q=${q}`)
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
                    const raisonsToShow = q != '' ? result : raisons
                    if(loading || loadingRaisons) {
                              return <View style={{ flex: 1, height: height-50, justifyContent: 'center', alignItems: 'center'}}>
                                        <ActivityIndicator animating={true} size="large" color={"#000"} />
                              </View>
                    }
                    return (
                              <View style={styles.modalContent}>
                                        <View style={{ paddingHorizontal: 15 }}>
                                        <Input
                                                  placeholder="Chercher la raison"
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
                                        </View>
                                         :<View style={styles.modalList}>
                                                  <TouchableNativeFeedback onPress={() => onRaisonSelect('autre')}>
                                                            <View style={styles.modalItem}>
                                                                      {selectedRaison == 'autre' ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                                                                                <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                      <Text numberOfLines={1} style={styles.modalText}>Autre</Text>
                                                            </View>
                                                  </TouchableNativeFeedback>
                                                  {raisonsToShow.map((raison, index) => {
                                                            return <TouchableNativeFeedback onPress={() => onRaisonSelect(raison)} key={index}>
                                                                      <View style={styles.modalItem}>
                                                                                {selectedRaison?.ID_RAISON_ANNULATION == raison.ID_RAISON_ANNULATION ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                                                                                          <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                                <Text numberOfLines={1} style={styles.modalText}>{raison.DESCRIPTION}</Text>
                                                                      </View>
                                                            </TouchableNativeFeedback>
                                                  })}
                                        </View>}
                              </View>
                    )
          }

          const onRaisonChange = (raison) => {
                    dispatch(setRaisonAnnulationAction(raison))
          }

          const onChangeDateDebut = (event, selectedDate) => {
                    const currentDate = selectedDate || new Date();
                    setShowCalendar(Platform.OS === "ios");
                    dispatch(setDemandeDate(currentDate));
          };

          const onChangeTime = (event, time) => {
                    setShowTime(Platform.OS === "ios");
                    dispatch(setDemandeTime(time));
          };


          const onAnnulerDateChange = (event, selectedDate) => {
                    const currentDate = selectedDate || new Date();
                    setShowAnnulerCalendar(Platform.OS === "ios");
                    dispatch(setAnnulerDate(currentDate));
          };

          const onAnnulerTimeChange = (event, time) => {
                    setShowAnnulerTime(Platform.OS === "ios");
                    dispatch(setAnnulerTime(time));
          };
          
          const getAnnulerLabel = () => {
                    if (annulerPar == 1) {
                              return 'Employé'
                    } else if (annulerPar == 2) {
                              return 'Driver'
                    }
                    return "Sélectionner la réponse"
          }
          const getSelectedRaisonLabel = () => {
                    if (selectedRaison?.DESCRIPTION) {
                              return selectedRaison?.DESCRIPTION
                    } else if (selectedRaison == 'autre') {
                              return 'Autre'
                    }
                    return 'Sélectionner la réponse'
          }

          return (
                    <>
                    {showCalendar && (
                              <DateTimePicker
                                        testID="dateTimePicker"
                                        value={dateDebut || new Date()}
                                        mode='date'
                                        is24Hour={true}
                                        display="default"
                                        onChange={onChangeDateDebut}
                                        maximumDate={new Date()}
                              />
                    )}
                    {showTime && (
                              <DateTimePicker
                                        testID="dateTimePicker"
                                        value={time || new Date()}
                                        mode='time'
                                        is24Hour={true}
                                        display="default"
                                        onChange={onChangeTime}
                                        maximumDate={new Date()}
                              />
                    )}


                    {showAnnulerCalendar && (
                              <DateTimePicker
                                        testID="dateTimePicker"
                                        value={annulerDate || new Date()}
                                        mode='date'
                                        is24Hour={true}
                                        display="default"
                                        onChange={onAnnulerDateChange}
                                        maximumDate={new Date()}
                              />
                    )}
                    {showAnnulerTime && (
                              <DateTimePicker
                                        testID="dateTimePicker"
                                        value={annulerTime || new Date()}
                                        mode='time'
                                        is24Hour={true}
                                        display="default"
                                        onChange={onAnnulerTimeChange}
                                        maximumDate={new Date()}
                              />
                    )}
                    <View style={styles.container}>
                              <ScrollView keyboardShouldPersistTaps="always" style={{ paddingHorizontal: 20 }}>
                                        <View style={styles.formGroup}>
                                                  <Text style={styles.title}>
                                                            Course annulée par
                                                  </Text>
                                                  <TouchableOpacity onPress={() => annulerParRef.current.open()} style={styles.openModalize}>
                                                            <Text style={styles.openModalizeLabel} numberOfLines={1}>
                                                                      {getAnnulerLabel()}
                                                            </Text>
                                                            <AntDesign name="caretdown" size={16} color="#777" />
                                                  </TouchableOpacity>
                                                  <Text style={styles.title}>
                                                            Raison de l'annulation
                                                  </Text>
                                                  <TouchableOpacity onPress={() => raisonRef.current.open()} style={styles.openModalize}>
                                                            <Text style={styles.openModalizeLabel} numberOfLines={1}>
                                                                      {getSelectedRaisonLabel()}
                                                            </Text>
                                                            <AntDesign name="caretdown" size={16} color="#777" />
                                                  </TouchableOpacity>
                                                  {selectedRaison == 'autre' && <Input
                                                            placeholder="Autre raison"
                                                            size='lg'
                                                            borderRadius={10}
                                                            value={raisonAnnulation}
                                                            onChangeText={onRaisonChange}
                                                            mt={3}
                                                            backgroundColor="#f1f1f1"
                                                            multiline
                                                            maxHeight={150}
                                                  />}
                                        </View>
                                        <View style={{...styles.formGroup, paddingHorizontal: 0}}>
                                                  <Text style={{...styles.title, paddingHorizontal: 0}}>
                                                            Date de demande de la course
                                                  </Text>
                                                  <TouchableOpacity onPress={() => setShowCalendar(true)} style={styles.openModalize}>
                                                            <Text style={styles.openModalizeLabel} numberOfLines={1}>
                                                                      { dateDebut ? moment(dateDebut).format('DD-MM-Y') : 'Sélectionner la date' }
                                                            </Text>
                                                            <MaterialIcons name="calendar-today"  size={20} color="#777" style={styles.icon} />
                                                  </TouchableOpacity>
                                                  <TouchableOpacity onPress={() => setShowTime(true)} style={styles.openModalize}>
                                                            <Text style={styles.openModalizeLabel} numberOfLines={1}>
                                                                      { time ? moment(time).format('H:mm') : "Sélectionner l'heure" }
                                                            </Text>
                                                            <AntDesign name="clockcircleo" size={20} color="#777" />
                                                  </TouchableOpacity>
                                        </View>
                                        <View style={{...styles.formGroup, paddingHorizontal: 0}}>
                                                  <Text style={{...styles.title, paddingHorizontal: 0}}>
                                                            Date d'annulation de la course
                                                  </Text>
                                                  <TouchableOpacity onPress={() => setShowAnnulerCalendar(true)} style={styles.openModalize}>
                                                            <Text style={styles.openModalizeLabel} numberOfLines={1}>
                                                                      { annulerDate ? moment(annulerDate).format('DD-MM-Y') : 'Sélectionner la date' }
                                                            </Text>
                                                            <MaterialIcons name="calendar-today"  size={20} color="#777" style={styles.icon} />
                                                  </TouchableOpacity>
                                                  <TouchableOpacity onPress={() => setShowAnnulerTime(true)} style={styles.openModalize}>
                                                            <Text style={styles.openModalizeLabel} numberOfLines={1}>
                                                                      { annulerTime ? moment(annulerTime).format('H:mm') : "Sélectionner l'heure" }
                                                            </Text>
                                                            <AntDesign name="clockcircleo" size={20} color="#777" />
                                                  </TouchableOpacity>
                                        </View>
                              </ScrollView>
                              <Portal>
                                        <Modalize ref={annulerParRef} adjustToContentHeight handleStyle={{ display: 'none' }} modalStyle={{ borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>
                                                  <AnnulerParModalize />
                                        </Modalize>
                              </Portal>
                              <Portal>
                                        <Modalize ref={raisonRef} handleStyle={{ display: 'none' }} modalStyle={{ borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>
                                                  <RaisonsModalize />
                                        </Modalize>
                              </Portal>
                    </View>
                    </>
          )
}

const styles = StyleSheet.create({
          container: {
                    flex: 1,
                    backgroundColor: '#fff',
                    // paddingHorizontal: 20
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