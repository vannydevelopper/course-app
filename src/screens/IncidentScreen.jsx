import React, { useCallback, useRef, useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, TouchableNativeFeedback, Platform, ScrollView } from 'react-native'
import { AntDesign, MaterialIcons , MaterialCommunityIcons} from '@expo/vector-icons'; 
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setDestinationAction, setPickupAction, setRouteAction, setAutreDestinationAction, setAutrePickupAction, setIncidentAction, setAutreIncidentAction, setCommentAction, setIncidentTypeAction, setDateDebutAction, setTimeAction } from '../store/actions/appActions';
import { Input } from 'native-base';
import { autreDestinationSelector, autreIncidentSelector, autrePickupSelector, commentaireSelector, corporateSelector, dateDebutSelector, destinationSelector, incidentSelector, pickupSelector, routeSelector, timeSelector, typeIncidentSelector } from '../store/selectors/appSelectors';
import Header from '../components/Header';
import useFetch from '../hooks/useFetch';
import Skeletons from '../components/Skeletons';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'
moment.locale('fr')

export default function IncidentScreen() {
          const incidentsTypesRef = useRef(null)

          const [loading, setLoading] = useState(false)
          const navigation = useNavigation()
          const dispatch = useDispatch()
          const route = useRoute()
          
          useFocusEffect(useCallback(() => {
                    dispatch(setRouteAction(route.name))
          }, []))

          const [showCalendar, setShowCalendar] = useState(false)
          const [showTime, setShowTime] = useState(false)

          const selectedIncident = useSelector(incidentSelector)
          const typeIncident = useSelector(typeIncidentSelector)
          const autreIncident = useSelector(autreIncidentSelector)
          const commentaire  = useSelector(commentaireSelector)
          const dateDebut= useSelector(dateDebutSelector)
          const time = useSelector(timeSelector)

          const [loadingIncidents, incidents] = useFetch('/type_incident?limit=100')

          const routeName = useSelector(routeSelector)

          const onAutreIncidentChange = (incident) => {
                    dispatch(setAutreIncidentAction(incident))
          }

          const onCommentaireChange = (commentaire) => {
                    dispatch(setCommentAction(commentaire))
          }

          const onChangeDateDebut = (event, selectedDate) => {
                    const currentDate = selectedDate || new Date();
                    setShowCalendar(Platform.OS === "ios");
                    dispatch(setDateDebutAction(currentDate));
          };

          const onChangeTime = (event, time) => {
                    setShowTime(Platform.OS === "ios");
                    dispatch(setTimeAction(time));
          };

          const IncidentsTypesModalize = () => {

                    const onIncidentSelect = (incident) => {
                              incidentsTypesRef.current.close()
                              dispatch(setIncidentTypeAction(incident))
                    }
                    return (
                              <View style={styles.modalContent}>
                                        <View style={styles.modalList}>
                                                  {loadingIncidents ? <Skeletons /> :
                                                            <>
                                                            <TouchableNativeFeedback onPress={() => onIncidentSelect('autre')}>
                                                                      <View style={styles.modalItem}>
                                                                                {typeIncident == 'autre' ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                                                                                <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                                <Text numberOfLines={1} style={styles.modalText}>Autre</Text>
                                                                      </View>
                                                            </TouchableNativeFeedback>
                                                            {incidents.map((incident, index) => {
                                                                      return <TouchableNativeFeedback onPress={() => onIncidentSelect(incident)} key={index}>
                                                                                          <View style={styles.modalItem}>
                                                                                                    {typeIncident?.TYPE_INCIDENT_ID == incident.TYPE_INCIDENT_ID ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                                                                                                    <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                                                    <Text numberOfLines={2} style={styles.modalText}>{ incident.DESCRIPTION }</Text>
                                                                                          </View>
                                                                                </TouchableNativeFeedback>
                                                            })}
                                                            </>
                                                  }
                                        </View>
                              </View>
                    )
          }

          const getIncidentLabel = () => {
                    if(typeIncident?.DESCRIPTION) {
                              return typeIncident.DESCRIPTION
                    } else if(typeIncident == 'autre') {
                              return 'Autre'
                    }
                    return 'Sélectionner la réponse'
          }
          return (
                    <>
                    <ScrollView style={styles.container}>
                              {/* {(routeName == 'PickUp' || routeName == 'Login') && <Header />} */}
                              <View style={styles.formGroup}>
                                        <Text style={styles.title}>
                                                  Y a-t-il un incident à déclarer ?
                                        </Text>
                                        
                                        <TouchableNativeFeedback onPress={() => dispatch(setIncidentAction(true))}>
                                                  <View style={{...styles.modalItem, paddingHorizontal: 20}}>
                                                            {selectedIncident == true ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                                                            <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                            <Text numberOfLines={1} style={styles.modalText}>Oui</Text>
                                                  </View>
                                        </TouchableNativeFeedback>
                                        
                                        <TouchableNativeFeedback onPress={() => dispatch(setIncidentAction(false))}>
                                                  <View style={{...styles.modalItem, paddingHorizontal: 20}}>
                                                            {selectedIncident == false ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                                                            <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                            <Text numberOfLines={1} style={styles.modalText}>Non</Text>
                                                  </View>
                                        </TouchableNativeFeedback>
                              </View>
                              {selectedIncident == true && <View style={{...styles.formGroup, paddingHorizontal: 20}}>
                                        <Text style={{...styles.title, paddingHorizontal: 0}}>
                                                  Type d'incident
                                        </Text>
                                        <TouchableOpacity onPress={() => incidentsTypesRef.current.open()} style={styles.openModalize}>
                                                  <Text style={styles.openModalizeLabel} numberOfLines={1}>
                                                            { getIncidentLabel() }
                                                  </Text>
                                                  <AntDesign name="caretdown" size={16} color="#777" />
                                        </TouchableOpacity>
                                        {typeIncident == 'autre' && <Input
                                                  placeholder="Autre incident"
                                                  size='lg'
                                                  value={autreIncident}
                                                  onChangeText={onAutreIncidentChange}
                                                  borderRadius={10}
                                                  mt={3}
                                                  backgroundColor="#f1f1f1"
                                                  multiline
                                                  maxHeight={150}
                                        />}
                                        <Input
                                                  placeholder="Commentaire"
                                                  size='lg'
                                                  value={commentaire}
                                                  onChangeText={onCommentaireChange}
                                                  borderRadius={10}
                                                  mt={3}
                                                  backgroundColor="#f1f1f1"
                                                  multiline
                                                  maxHeight={150}
                                        />
                              </View>}
                              <View style={{...styles.formGroup, paddingHorizontal: 20}}>
                                        <Text style={{...styles.title, paddingHorizontal: 0}}>
                                                  Date début de la course
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
                    </ScrollView>
                    <Portal>
                              <Modalize ref={incidentsTypesRef} handleStyle={{ display: 'none' }} modalStyle={{borderTopRightRadius: 20, borderTopLeftRadius: 20}}>
                                        <IncidentsTypesModalize />
                              </Modalize>
                    </Portal>
                    {showCalendar && (
                              <DateTimePicker
                                        testID="dateTimePicker"
                                        value={dateDebut || new Date()}
                                        mode='date'
                                        is24Hour={true}
                                        display="default"
                                        onChange={onChangeDateDebut}
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
                              />
                    )}
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
                    marginTop: 30,
                    paddingHorizontal: 20
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
                    width: '90%'
          },
          modalContent: {
                    paddingBottom: 20
          },
          modalItem: {
                    paddingVertical: 10,
                    paddingHorizontal: 20,
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