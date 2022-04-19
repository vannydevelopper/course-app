import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, TouchableNativeFeedback, ScrollView, Image } from 'react-native'
import { AntDesign, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { setAgenceAction, setAnnulerParAction, setAutreClientAction, setClientAction, setCorporateAction, setCovoiturageAction, setDestinationAction, setPickupAction, setRaisonAnnulationAction, setRouteAction, setStickyAction, setTypeAction } from '../store/actions/appActions';
import { Input } from 'native-base';
import { agenceSelector, annulerParSelector, autreClientSelector, clientSelector, corporateSelector, covoiturageSelector, raisonAnnulationSelector, routeSelector, stickyHeaderSelector, typeSelector } from '../store/selectors/appSelectors';
import Header from '../components/Header';
import useFetch from '../hooks/useFetch';
import Skeletons from '../components/Skeletons';
import fetchApi from '../helpers/fetchApi';

export default function DeclarationTypeScreen() {
          const [loading, setLoading] = useState(false)
          const typeRef = useRef(null)
          const corporateRef = useRef(null)
          const clientsModRef = useRef(null)
          const agenceModRef = useRef(null)
          const annulerParRef = useRef(null)

          const dispatch = useDispatch()
          const route = useRoute()
          const navigation = useNavigation()

          const selectedType = useSelector(typeSelector)
          const selectedCorporate = useSelector(corporateSelector)
          const selectedClient = useSelector(clientSelector)
          const selectedAgence = useSelector(agenceSelector)
          const autreClient = useSelector(autreClientSelector)
          const covoiturage = useSelector(covoiturageSelector)
          const annulerPar = useSelector(annulerParSelector)
          const raisonAnnulation = useSelector(raisonAnnulationSelector)

          const routeName = useSelector(routeSelector)
          
          useFocusEffect(useCallback(() => {
                    dispatch(setRouteAction(route.name))
          }, []))

          // fetches from api
          const [loadingTypes, types] = useFetch('/type_declaration') // get types
          const [loadingCorporates, corporates] = useFetch('/corporate?limit=100') // get corporates
          const [loadingAgances, agences] = useFetch('/declarations/agences?limit=100')
          const [loadingClients, setLoadingClients] = useState(false)
          const [clients, setClients] = useState([])
          useEffect(() => {
                    (async () => {
                              if (selectedCorporate) {
                                        setLoadingClients(true)
                                        const clients = await fetchApi(`/rider_kcb/${selectedCorporate?.ID_CORPORATE}?limit=100`)
                                        setClients(clients)
                                        setLoadingClients(false)
                              }
                    })()
          }, [selectedCorporate])

          const onAutreClientChange = (autreClient) => {
                    dispatch(setAutreClientAction(autreClient))
          }

          const onCovoiturageChange = (cov) => {
                    dispatch(setCovoiturageAction(cov))
          }

          const onRaisonChange = (raison) => {
                    dispatch(setRaisonAnnulationAction(raison))
          }

          const TypesModalize = () => {
                    const dispatch = useDispatch()
                    const onTypeSelect = (type) => {
                              typeRef.current.close()
                              dispatch(setTypeAction(type))
                    }
                    return (
                              <View style={styles.modalContent}>
                                        <View style={styles.modalList}>
                                                  {loadingTypes ? <Skeletons /> :
                                                            <>
                                                                      {types.map(type => <TouchableNativeFeedback onPress={() => onTypeSelect(type)} key={type.TYPE_DECLARATION_ID.toString()}>
                                                                                <View style={styles.modalItem}>
                                                                                          {selectedType?.TYPE_DECLARATION_ID == type.TYPE_DECLARATION_ID ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                                                                                                    <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                                          <Text numberOfLines={1} style={styles.modalText}>{type.DESCRIPTION}</Text>
                                                                                </View>
                                                                      </TouchableNativeFeedback>)}
                                                            </>
                                                  }
                                        </View>
                              </View>
                    )
          }

          const CorporatesModalize = () => {
                    const onCorporateSelect = (corporate) => {
                              corporateRef.current.close()
                              dispatch(setClientAction(null))
                              dispatch(setPickupAction(null))
                              dispatch(setDestinationAction(null))
                              dispatch(setCorporateAction(corporate))
                    }
                    return (
                              <View style={styles.modalContent}>
                                        <View style={styles.modalList}>
                                                  {loadingCorporates ? <Skeletons /> :
                                                            <>
                                                                      {corporates.map((corporate, index) => {
                                                                                return <TouchableNativeFeedback onPress={() => onCorporateSelect(corporate)} key={index}>
                                                                                          <View style={styles.modalItem}>
                                                                                                    {selectedCorporate?.ID_CORPORATE == corporate.ID_CORPORATE ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                                                                                                              <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                                                    <Text numberOfLines={1} style={styles.modalText}>{corporate.DESCRIPTION}</Text>
                                                                                          </View>
                                                                                </TouchableNativeFeedback>
                                                                      })}
                                                            </>
                                                  }
                                        </View>
                              </View>
                    )
          }

          const ClientsModalize = () => {
                    const onClientSelect = (client) => {
                              clientsModRef.current.close()
                              dispatch(setClientAction(client))
                    }
                    return (
                              <View style={styles.modalContent}>
                                        <View style={styles.modalList}>
                                                  {loadingClients ? <Skeletons /> :
                                                            <>
                                                                      <TouchableNativeFeedback onPress={() => onClientSelect('autre')}>
                                                                                <View style={styles.modalItem}>
                                                                                          {selectedClient == 'autre' ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                                                                                                    <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                                          <Text numberOfLines={1} style={styles.modalText}>Autre</Text>
                                                                                </View>
                                                                      </TouchableNativeFeedback>
                                                                      <TouchableNativeFeedback onPress={() => onClientSelect('covoiturage')}>
                                                                                <View style={styles.modalItem}>
                                                                                          {selectedClient == 'covoiturage' ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                                                                                                    <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                                          <Text numberOfLines={1} style={styles.modalText}>Covoiturage</Text>
                                                                                </View>
                                                                      </TouchableNativeFeedback>
                                                                      {clients.map((client, index) => {
                                                                                return <TouchableNativeFeedback onPress={() => onClientSelect(client)} key={index}>
                                                                                          <View style={styles.modalItem}>
                                                                                                    {selectedClient?.RIDE_KCB_ID == client.RIDE_KCB_ID ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                                                                                                              <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                                                    <Text numberOfLines={1} style={styles.modalText}>{client.NOM}</Text>
                                                                                          </View>
                                                                                </TouchableNativeFeedback>
                                                                      })}
                                                            </>
                                                  }
                                        </View>
                              </View>
                    )
          }


          const AgencesModalize = () => {
                    const onAgenceSelect = (agence) => {
                              agenceModRef.current.close()
                              dispatch(setAgenceAction(agence))
                    }
                    return (
                              <View style={styles.modalContent}>
                                        <View style={styles.modalList}>
                                                  {loadingAgances ? <Skeletons /> :
                                                            agences.map((agence, index) => {
                                                                      return <TouchableNativeFeedback onPress={() => onAgenceSelect(agence)} key={index}>
                                                                                <View style={styles.modalItem}>
                                                                                          {selectedAgence?.AGENCE_ID == agence.AGENCE_ID ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                                                                                                    <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                                          <Text numberOfLines={1} style={styles.modalText}>{agence.DESCRIPTION}</Text>
                                                                                </View>
                                                                      </TouchableNativeFeedback>
                                                            })
                                                  }
                                        </View>
                              </View>
                    )
          }

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

          const getSelectedClientLabel = () => {
                    if (selectedClient?.NOM) {
                              return selectedClient?.NOM
                    } else if (selectedClient == 'autre') {
                              return 'Autre'
                    } else if (selectedClient == 'covoiturage') {
                              return 'Covoiturage'
                    }
                    return 'Sélectionner la réponse'
          }

          const getAnnulerLabel = () => {
                    if (annulerPar == 1) {
                              return 'Employé'
                    } else if (annulerPar == 2) {
                              return 'Driver'
                    }
                    return "Sélectionner la réponse"
          }
          return (
                    <View style={styles.container}>
                              {(routeName == 'DeclarationType' || routeName == 'Login') && <Header />}
                              <ScrollView keyboardShouldPersistTaps="always" style={{ paddingHorizontal: 20 }}>
                                        <View style={styles.formGroup}>
                                                  <Text style={styles.title}>
                                                            Que ce que vous voulez déclarer ?
                                                  </Text>
                                                  <TouchableOpacity onPress={() => typeRef.current.open()} style={styles.openModalize}>
                                                            <Text style={styles.openModalizeLabel} numberOfLines={1}>
                                                                      {selectedType?.DESCRIPTION ?? 'Sélectionner la réponse'}
                                                            </Text>
                                                            <AntDesign name="caretdown" size={16} color="#777" />
                                                  </TouchableOpacity>
                                        </View>
                                        {selectedType && <View style={styles.formGroup}>
                                                  <Text style={styles.title}>
                                                            Quel est le corporate ?
                                                  </Text>
                                                  <TouchableOpacity onPress={() => corporateRef.current.open()} style={styles.openModalize}>
                                                            <Text style={styles.openModalizeLabel} numberOfLines={1}>
                                                                      {selectedCorporate?.DESCRIPTION ?? "Sélectionner la réponse"}
                                                            </Text>
                                                            <AntDesign name="caretdown" size={16} color="#777" />
                                                  </TouchableOpacity>
                                        </View>}
                                        {selectedCorporate && <View style={styles.formGroup}>
                                                  <Text style={styles.title}>
                                                            Clients
                                                  </Text>
                                                  <TouchableOpacity onPress={() => clientsModRef.current.open()} style={styles.openModalize}>
                                                            <Text style={styles.openModalizeLabel} numberOfLines={1}>
                                                                      {getSelectedClientLabel()}
                                                            </Text>
                                                            <AntDesign name="caretdown" size={16} color="#777" />
                                                  </TouchableOpacity>
                                                  {selectedClient == 'autre' && <Input
                                                            placeholder="Nom et prénom de l'employé"
                                                            size='lg'
                                                            borderRadius={10}
                                                            value={autreClient}
                                                            onChangeText={onAutreClientChange}
                                                            mt={3}
                                                            backgroundColor="#f1f1f1"
                                                            multiline
                                                            maxHeight={150}
                                                  />}
                                                  {selectedClient == 'covoiturage' && <Input
                                                            placeholder="Précisez leurs noms"
                                                            size='lg'
                                                            borderRadius={10}
                                                            value={covoiturage}
                                                            onChangeText={onCovoiturageChange}
                                                            mt={3}
                                                            backgroundColor="#f1f1f1"
                                                            multiline
                                                            maxHeight={150}
                                                  />}
                                        </View>}

                                        {selectedType && selectedType?.TYPE_DECLARATION_ID == 2 && <View style={styles.formGroup}>
                                                  <Text style={styles.title}>
                                                            Annulée par
                                                  </Text>
                                                  <TouchableOpacity onPress={() => annulerParRef.current.open()} style={styles.openModalize}>
                                                            <Text style={styles.openModalizeLabel} numberOfLines={1}>
                                                                      {getAnnulerLabel()}
                                                            </Text>
                                                            <AntDesign name="caretdown" size={16} color="#777" />
                                                  </TouchableOpacity>
                                                  <Input
                                                            placeholder="Raison de l'annulation"
                                                            size='lg'
                                                            borderRadius={10}
                                                            value={raisonAnnulation}
                                                            onChangeText={onRaisonChange}
                                                            mt={3}
                                                            backgroundColor="#f1f1f1"
                                                            multiline
                                                            maxHeight={150}
                                                  />
                                        </View>}
                                        {selectedClient == 'autre' && <View style={styles.formGroup}>
                                                  <Text style={styles.title}>
                                                            Agence
                                                  </Text>
                                                  <TouchableOpacity onPress={() => agenceModRef.current.open()} style={styles.openModalize}>
                                                            <Text style={styles.openModalizeLabel} numberOfLines={1}>
                                                                      {selectedAgence?.DESCRIPTION ?? "Sélectionner la réponse"}
                                                            </Text>
                                                            <AntDesign name="caretdown" size={16} color="#777" />
                                                  </TouchableOpacity>
                                        </View>}
                              </ScrollView>
                              <Portal>
                                        <Modalize ref={typeRef} adjustToContentHeight handleStyle={{ display: 'none' }} modalStyle={{ borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>
                                                  <TypesModalize />
                                        </Modalize>
                              </Portal>
                              <Portal>
                                        <Modalize ref={corporateRef} adjustToContentHeight handleStyle={{ display: 'none' }} modalStyle={{ borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>
                                                  <CorporatesModalize />
                                        </Modalize>
                              </Portal>
                              <Portal>
                                        <Modalize ref={clientsModRef} handleStyle={{ display: 'none' }} modalStyle={{ borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>
                                                  <ClientsModalize />
                                        </Modalize>
                              </Portal>
                              <Portal>
                                        <Modalize ref={agenceModRef} adjustToContentHeight handleStyle={{ display: 'none' }} modalStyle={{ borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>
                                                  <AgencesModalize />
                                        </Modalize>
                              </Portal>
                              <Portal>
                                        <Modalize ref={annulerParRef} adjustToContentHeight handleStyle={{ display: 'none' }} modalStyle={{ borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>
                                                  <AnnulerParModalize />
                                        </Modalize>
                              </Portal>
                    </View>
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