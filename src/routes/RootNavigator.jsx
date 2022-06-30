
import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableNativeFeedback, Image } from 'react-native'
import { NavigationContainer, useNavigation, } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import DeclarationTypeScreen from '../screens/DeclarationTypeScreen';
import { MaterialIcons } from '@expo/vector-icons';
import PickUpScreen from '../screens/PickUpScreen';
import TrajetScreen from '../screens/TrajetScreen';
import { useDispatch, useSelector } from 'react-redux';
import * as Location from 'expo-location';
import { SharedElement, createSharedElementStackNavigator } from 'react-navigation-shared-element'
import moment from 'moment'
moment.locale('fr')
import {
          agenceSelector,
          annulerDateSelector,
          annulerParSelector,
          annulerTimeSelector,
          autreClientSelector,
          autreDestinationSelector,
          autreIncidentSelector,
          autrePickupSelector,
          clientSelector,
          commentaireSelector,
          corporateSelector,
          covoiturageSelector,
          dateDebutSelector,
          demandeDateSelector,
          demandeTimeSelector,
          destinationSelector,
          dureeSelector,
          incidentSelector,
          kilometreSelector,
          montantSelector,
          numeroCourseSelector,
          pickupSelector,
          raisonAnnulationSelector,
          raisonSelector,
          routeSelector,
          stickyHeaderSelector,
          timeSelector,
          typeIncidentSelector,
          typeSelector,
          modeSelector,
          autreNumeroSelector
} from '../store/selectors/appSelectors';
import ConfirmScreen from '../screens/ConfirmScreen';
import { Button, useToast } from 'native-base';
import SuccessModal from '../screens/SuccessModal';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { userSelector } from '../store/selectors/userSelector';
import { unsetUserAction } from '../store/actions/userActions';
import Header from '../components/Header';
import IncidentScreen from '../screens/IncidentScreen';
import { resetAction, setErrorsAcion, setLoadingAction } from '../store/actions/appActions';
import fetchApi from '../helpers/fetchApi';
import HistoryScreen from '../screens/HistoryScreen';
import AnnulerScreen from '../screens/AnnulerScreen';
import NotificationScreen from '../screens/NotificationScreen';
import NotificationsDetailScreen from '../screens/NotificationsDetailScreen';


// const Stack = createStackNavigator()
const Stack = createSharedElementStackNavigator()
export default function RootNavigator() {

          const navigation = useNavigation()
          const route = useSelector(routeSelector)
          const user = useSelector(userSelector)
          const dispatch = useDispatch()
          const stickyHeader = useSelector(stickyHeaderSelector)
          const [location, setLocation] = useState(null)

          useEffect(() => {
                    (async () => {
                              dispatch(setLoadingAction(false))
                              let { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
                              if (locationStatus !== 'granted') {
                                        console.log('Permission to access location was denied');
                                        setLocation(false)
                                        return;
                              }
                              var location = await Location.getCurrentPositionAsync({});
                              setLocation(location)

                    })()
          }, [])

          const selectedType = useSelector(typeSelector)
          const selectedCorporate = useSelector(corporateSelector)
          const selectedClient = useSelector(clientSelector)
          const selectedAgence = useSelector(agenceSelector)
          const autreClient = useSelector(autreClientSelector)
          const covoiturage = useSelector(covoiturageSelector)
          const annulerPar = useSelector(annulerParSelector)
          const raisonAnnulation = useSelector(raisonAnnulationSelector)
          const selectedRaison = useSelector(raisonSelector)
          const demandeDate = useSelector(demandeDateSelector)
          const demandeTime = useSelector(demandeTimeSelector)
          const annulerDate = useSelector(annulerDateSelector)
          const annulerTime = useSelector(annulerTimeSelector)

          const selectedPickup = useSelector(pickupSelector)
          const selectedDestination = useSelector(destinationSelector)
          const autrePickup = useSelector(autrePickupSelector)
          const autreDestination = useSelector(autreDestinationSelector)


          const kilometre = useSelector(kilometreSelector)
          const duree = useSelector(dureeSelector)
          const montant = useSelector(montantSelector)

          const selectedIncident = useSelector(incidentSelector)
          const typeIncident = useSelector(typeIncidentSelector)
          const autreIncident = useSelector(autreIncidentSelector)
          const commentaire = useSelector(commentaireSelector)
          const dateDebut = useSelector(dateDebutSelector)
          const time = useSelector(timeSelector)
          const numeroCourse = useSelector(numeroCourseSelector)
          const selectedMode = useSelector(modeSelector)
          const autreNumero = useSelector(autreNumeroSelector)
          const toast = useToast()

          const onNextPress = async () => {
                    if (route == 'DeclarationType') {
                              if (selectedType?.TYPE_DECLARATION_ID == 2) {
                                        navigation.navigate('Annuler')
                              } else {
                                        navigation.navigate('PickUp')
                              }
                    } else if (route == 'Annuler') {
                              navigation.navigate('PickUp')
                    } else if (route == 'PickUp') {
                              if (selectedType?.TYPE_DECLARATION_ID == 2) {
                                        navigation.navigate('Confirm')
                              } else {
                                        navigation.navigate('Trajet')
                              }
                    } else if (route == 'Trajet') {
                              navigation.navigate('Incident')
                    } else if (route == 'Incident') {
                              navigation.navigate('Confirm')
                    } else if (route == 'Confirm') {
                              dispatch(setLoadingAction(true))
                              if (!location) {
                                        let { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
                                        if (locationStatus !== 'granted') {
                                                  console.log('Permission to access location was denied');
                                                  setLocation(false)
                                                  return;
                                        }
                                        var location = await Location.getCurrentPositionAsync({
                                                  accuracy: Location.Accuracy.Highest

                                        });
                                        setLocation(location)

                              }

                              const getClientId = () => {
                                        if (selectedClient == 'covoiturage') {
                                                  return 458
                                        } else if (selectedClient == 'autre') {
                                                  return 'autre'
                                        } else {
                                                  return selectedClient.RIDE_KCB_ID
                                        }
                              }

                              const getIncidentId = () => {
                                        if (selectedIncident != true) {
                                                  return null
                                        } else {
                                                  if (typeIncident == 'autre') {
                                                            return typeIncident
                                                  } else {
                                                            return typeIncident.TYPE_INCIDENT_ID
                                                  }
                                        }
                              }
                              try {

                                        const newDeclaration = await fetchApi('/declarations', {
                                                  method: 'POST',
                                                  body: JSON.stringify({
                                                            ID_CORPORATE: selectedCorporate.ID_CORPORATE,
                                                            TYPE_DECLARATION_ID: selectedType.TYPE_DECLARATION_ID,
                                                            iS_COVOITURAGE: selectedClient == 'covoiturage',
                                                            // CLIENT_ID: selectedClient != 'autre' && selectedType == 'covoiturage' ? selectedClient.RIDE_KCB_ID : null,
                                                            RIDER_ID: user.DRIVER_ID,
                                                            CLIENT_ID: getClientId(),
                                                            AUTRE_CLIENT: selectedClient == 'autre' ? autreClient : null,
                                                            // AGENCE_ID: selectedClient == 'autre' ? selectedAgence.AGENCE_ID : null,
                                                            PICK_UP_ID: selectedPickup != 'autre' ? selectedPickup.PICK_UP_ID : selectedPickup,
                                                            AUTRE_PICKUP: selectedPickup == 'autre' ? autrePickup : null,
                                                            DESTINATION_ID: selectedDestination != 'autre' ? selectedDestination.DESTINATION_ID : selectedDestination,
                                                            AUTRE_DESTINATION: selectedDestination == 'autre' ? autreDestination : null,
                                                            ID_MODE: selectedMode.ID_MODE,
                                                            IS_INCIDENT: selectedIncident == true,
                                                            TYPE_INCIDENT_ID: getIncidentId(),
                                                            AUTRE_INCIDENT: typeIncident == 'autre' ? autreIncident : null,
                                                            COMMENTAIRES: selectedIncident == true ? commentaire : null,
                                                            NOMS_COVOITURAGES: selectedClient == 'covoiturage' ? covoiturage : null,
                                                            // COMMENTAIRE_COVOITURAGE: selectedClient == 'covoiturage' ? covoiturage : null,
                                                            ID_RAISON_ANNULATION: selectedType.TYPE_DECLARATION_ID == 2 ? (selectedRaison != 'autre' ? selectedRaison.ID_RAISON_ANNULATION : selectedRaison) : null,
                                                            DATE_DEMANDE_COURSE: selectedType.TYPE_DECLARATION_ID == 2 ?
                                                                      (moment(demandeDate).set({
                                                                                hour: moment(demandeTime).get('hour'),
                                                                                minute: moment(demandeTime).get('minute')
                                                                      }).format('YYYY/MM/DD HH:mm:ss')) : null,
                                                            DATE_ANNULATION_COURSE: selectedType.TYPE_DECLARATION_ID == 2 ?
                                                                      (moment(annulerDate).set({
                                                                                hour: moment(annulerTime).get('hour'),
                                                                                minute: moment(annulerTime).get('minute')
                                                                      }).format('YYYY/MM/DD HH:mm:ss')) : null,
                                                            RAISON_ANNULATION: selectedType.TYPE_DECLARATION_ID == 2 ? raisonAnnulation : null,
                                                            ANNULE_PAR: selectedType.TYPE_DECLARATION_ID == 2 ? annulerPar : null,
                                                            TIME_SPENT: duree,
                                                            KM_SPENT: kilometre,
                                                            NUM_EMPLOYE: autreNumero,
                                                            MONTANT: montant,
                                                            NUMERO_COURSE: selectedType.TYPE_DECLARATION_ID == 2 ? null : numeroCourse,
                                                            LATITUDE: location.coords.latitude,
                                                            LONGITUDE: location.coords.longitude,
                                                            // DATE_DEBUT_COURSE: moment().format('YYYY/MM/DD HH:mm:ss'),
                                                            DATE_DEBUT_COURSE: selectedType.TYPE_DECLARATION_ID == 2 ? null :
                                                                      (moment(dateDebut).set({
                                                                                hour: moment(time).get('hour'),
                                                                                minute: moment(time).get('minute')
                                                                      }).format('YYYY/MM/DD HH:mm:ss'))
                                                  }),
                                                  headers: {
                                                            'Content-Type': 'application/json'
                                                  }
                                        })
                                        dispatch(resetAction())
                                        navigation.navigate('Success')
                              } catch (error) {
                                        console.log(error)
                                        if(error.errors) {
                                                  dispatch(setErrorsAcion(error.errors))
                                        }
                                        toast.show({
                                                  title: error.errors ? 'Client existe déjà' : "Course non ajoutée, réessayer",
                                                  placement: "bottom",
                                                  status: 'error',
                                                  duration: 2000,
                                                  width: '90%',
                                                  minWidth: 300
                                        })
                              }
                              dispatch(setLoadingAction(false))
                    }
          }

          const onPrevPress = () => {
                    navigation.goBack()
          }

          const onExit = () => {
                    dispatch(unsetUserAction())
          }

          const canNext = () => {

                    const passDecType = () => {
                              if (selectedType && selectedCorporate) {
                                        if (selectedClient && selectedClient != 'autre' && selectedClient != 'covoiturage') {
                                                  return true
                                        } else {
                                                  if (selectedClient == 'autre') {
                                                            if (autreClient && autreClient != '' && autreNumero != '' /* && selectedAgence */) {
                                                                      return true
                                                            }
                                                  } else if (selectedClient == 'covoiturage') {
                                                            if (covoiturage && covoiturage != '') {
                                                                      return true
                                                            }
                                                  }
                                        }
                              }
                    }

                    const passAnnuler = () => {
                              const passDates = demandeDate && demandeTime && annulerDate && annulerTime
                              const passAnnulerRaison = selectedRaison == 'autre' ? (annulerPar && raisonAnnulation && raisonAnnulation != '') : selectedRaison
                              return passAnnulerRaison && passDates
                    }

                    const passPickUps = () => {
                              const passPickup = selectedPickup == 'autre' ? autrePickup && autrePickup != '' : selectedPickup
                              const passDestination = selectedDestination == 'autre' ? autreDestination && autreDestination != '' : selectedDestination
                              return passPickup && passDestination
                    }

                    const passTrajet = () => {
                              return kilometre && kilometre != '' && duree && duree != "" && montant && montant != ""
                    }

                    const passIncident = () => {
                              const datesChecked = dateDebut && time
                              const numeroChecked = numeroCourse
                              if (selectedIncident == true) {
                                        if (typeIncident == 'autre') {
                                                  return autreIncident && autreIncident != '' && commentaire && commentaire != "" && datesChecked && numeroChecked
                                        } else {
                                                  return typeIncident && commentaire && commentaire != "" && datesChecked && numeroChecked
                                        }
                              } else {
                                        return datesChecked && numeroChecked
                              }
                    }
                    if (route == 'DeclarationType') {
                              return passDecType()
                    } else if (route == 'Annuler') {
                              return passAnnuler()
                    } else if (route == 'PickUp') {
                              return passPickUps()
                    } else if (route == 'Trajet') {
                              return passTrajet()
                    } else if (route == 'Incident') {
                              return passIncident()
                    } else if (route == 'Confirm') {
                              if (selectedType?.TYPE_DECLARATION_ID == 2) {
                                        return passDecType() && passPickUps()
                              }
                              return passDecType() && passPickUps() && passTrajet() && passIncident()
                    }
                    return false
          }
          return (
                    <>
                              {/* {route != 'Login' && stickyHeader && <View style={{paddingHorizontal: 20}}><Header /></View>} */}
                              <Stack.Navigator screenOptions={{
                                        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
                                        gestureEnabled: true,
                                        gestureDirection: 'horizontal',
                                        headerShown: false
                              }}>
                                        {!user ?
                                                  <>
                                                            <Stack.Screen name="Login" component={LoginScreen} />
                                                            <Stack.Screen name="Register" component={RegisterScreen} options={{
                                                                      cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
                                                            }} />
                                                  </> :
                                                  <>
                                                            <Stack.Screen name="DeclarationType" component={DeclarationTypeScreen} sharedElements={route => {
                                                                      return ['header']
                                                            }} />
                                                            <Stack.Screen name="Annuler" component={AnnulerScreen} sharedElements={route => {
                                                                      return ['header']
                                                            }} />
                                                            <Stack.Screen name="PickUp" component={PickUpScreen} sharedElements={route => {
                                                                      return ['header']
                                                            }} />
                                                            <Stack.Screen name="Trajet" component={TrajetScreen} sharedElements={route => {
                                                                      return ['header']
                                                            }} />
                                                            <Stack.Screen name="Incident" component={IncidentScreen} sharedElements={route => {
                                                                      return ['header']
                                                            }} />
                                                            <Stack.Screen name="Confirm" component={ConfirmScreen} sharedElements={route => {
                                                                      return ['header']
                                                            }} />
                                                            <Stack.Screen name="Success" component={SuccessModal} sharedElements={route => {
                                                                      return ['header']
                                                            }} options={{
                                                                      presentation: 'transparentModal',
                                                                      contentStyle: { backgroundColor: "#40404040" },
                                                                      cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid
                                                            }} />
                                                            <Stack.Screen name="History" component={HistoryScreen} sharedElements={route => {
                                                                      return ['header']
                                                            }} options={{ headerShown: true, title: 'Courses déclarées', headerStyle: { elevation: 0, backgroundColor: '#F3F7F7' } }}
                                                            />
                                                            <Stack.Screen name="Notifications" component={NotificationScreen} sharedElements={route => {
                                                                      return ['header']
                                                            }} options={{ headerShown: true, title: 'Notifications courses', headerStyle: { elevation: 0, backgroundColor: '#F3F7F7' } }}
                                                            />
                                                            <Stack.Screen name="NotificationsDetail" component={NotificationsDetailScreen} sharedElements={route => {
                                                                      return ['header']
                                                            }} options={{ headerShown: true, title: 'Course', headerStyle: { elevation: 0, backgroundColor: '#F3F7F7' } }}
                                                            />
                                                  </>}
                              </Stack.Navigator>
                              {route != "Success" && route != 'Login' && route != 'History' && route != 'Notifications' && <View style={styles.bottomNavigations}>
                                        {route == 'DeclarationType' ?
                                                  <View style={{ opacity: 0.5 }}>
                                                            <View style={styles.navigationButton}>
                                                                      <MaterialIcons name="navigate-before" size={24} color="black" />
                                                                      <Text style={styles.navigationButtonText}>Précedent</Text>
                                                            </View>
                                                  </View> :
                                                  <TouchableNativeFeedback useForeground={true} background={TouchableNativeFeedback.Ripple('#c4c4c4')} onPress={onPrevPress}>
                                                            <View style={styles.navigationButton}>
                                                                      <MaterialIcons name="navigate-before" size={24} color="black" />
                                                                      <Text style={styles.navigationButtonText}>Précedent</Text>
                                                            </View>
                                                  </TouchableNativeFeedback>}
                                        {canNext() ?
                                                  <TouchableNativeFeedback useForeground={true} background={TouchableNativeFeedback.Ripple('#c4c4c4')} onPress={onNextPress}>
                                                            <View style={{ ...styles.navigationButton, backgroundColor: route == 'Confirm' ? '#58A0EB' : '#fff' }}>
                                                                      <Text style={{ ...styles.navigationButtonText, color: route == 'Confirm' ? '#fff' : '#000' }}>
                                                                                {route == 'Confirm' ? 'Envoyer' : 'Suivant'}
                                                                      </Text>
                                                                      <MaterialIcons name="navigate-next" size={24} color={route == 'Confirm' ? '#fff' : "black"} style={{ opacity: 0.8 }} />
                                                            </View>
                                                  </TouchableNativeFeedback>
                                                  :
                                                  <View style={{ opacity: 0.5 }}>
                                                            <View style={{ ...styles.navigationButton, backgroundColor: route == 'Confirm' ? '#58A0EB' : '#fff' }}>
                                                                      <Text style={{ ...styles.navigationButtonText, color: route == 'Confirm' ? '#fff' : '#000' }}>
                                                                                {route == 'Confirm' ? 'Envoyer' : 'Suivant'}
                                                                      </Text>
                                                                      <MaterialIcons name="navigate-next" size={24} color={route == 'Confirm' ? '#fff' : "black"} style={{ opacity: 0.8 }} />
                                                            </View>
                                                  </View>}
                              </View>}
                    </>
          )
}

const styles = StyleSheet.create({
          container: {
                    flex: 1,
                    justifyContent: 'center',
                    backgroundColor: '#fff'
          },
          bottomNavigations: {
                    flexDirection: 'row',
                    paddingHorizontal: 10,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: 10
          },
          navigationButton: {
                    paddingVertical: 15,
                    paddingHorizontal: 30,
                    borderRadius: 10,
                    overflow: 'hidden',
                    flexDirection: 'row',
                    alignItems: 'center'
          },
          navigationButtonText: {
                    fontWeight: 'bold',
                    opacity: 0.8,
          },
          header: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 75,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    backgroundColor: '#fff',
                    elevation: 1,
                    shadowColor: '#f1f1f1',
          },
          headerDesc: {
                    flex: 1,
                    height: '100%',
                    justifyContent: 'space-between',
          },
          headerTitle: {
                    fontWeight: 'bold',
                    fontSize: 16
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