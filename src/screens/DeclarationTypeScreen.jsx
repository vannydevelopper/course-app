import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, TouchableNativeFeedback, ScrollView, Image, ActivityIndicator, useWindowDimensions } from 'react-native'
import { AntDesign, MaterialIcons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { setAgenceAction, setAnnulerParAction, setAutreClientAction, setAutreNumeroAction, setClientAction, setCorporateAction, setCovoiturageAction, setDestinationAction, setPickupAction, setRaisonAction, setRaisonAnnulationAction, setRouteAction, setStickyAction, setTypeAction } from '../store/actions/appActions';
import { Icon, Input, FormControl, WarningOutlineIcon } from 'native-base';
import { agenceSelector, annulerParSelector, autreClientSelector, errorsSelector, autreNumeroSelector, clientSelector, corporateSelector, covoiturageSelector, raisonAnnulationSelector, raisonSelector, routeSelector, stickyHeaderSelector, typeSelector } from '../store/selectors/appSelectors';
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
          const selectedRaison = useSelector(raisonSelector)
          const autreNumero = useSelector(autreNumeroSelector)
          const errors = useSelector(errorsSelector)
          
          const routeName = useSelector(routeSelector)

          // console.log(autreNumero)

          
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
                                        const clients = await fetchApi(`/rider_kcb/${selectedCorporate?.ID_CORPORATE}?limit=20`)
                                        setClients(clients)
                                        setLoadingClients(false)
                              }
                    })()
          }, [selectedCorporate])

          useEffect(() => {
                    if(selectedType == null) {
                              dispatch(setTypeAction(types.find(type => type.TYPE_DECLARATION_ID == 1)))
                    }
          }, [types])

          const onAutreClientChange = (autreClient) => {
                    dispatch(setAutreClientAction(autreClient))
          }

          const onAutreNumeroChange = (autreNumero) => {
               dispatch(setAutreNumeroAction(autreNumero))
          }

          const onCovoiturageChange = (cov) => {
                    dispatch(setCovoiturageAction(cov))
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
                    const [loading, setLoading] = useState(true)
                    const { height } = useWindowDimensions()
                    useEffect(() => {
                              const timer = setTimeout(() => {
                                        setLoading(false)
                              }, 50)
                              return () => {
                                        clearTimeout(timer)
                              }
                    }, [])
                    if(loading || loadingCorporates) {
                              return <View style={{ flex: 1, height: height-50, justifyContent: 'center', alignItems: 'center'}}>
                                        <ActivityIndicator animating={true} size="large" color={"#000"} />
                              </View>
                    }
                    return (
                              <View style={styles.modalContent}>
                                        <View style={styles.modalList}>
                                                  {corporates.map((corporate, index) => {
                                                            return <TouchableNativeFeedback onPress={() => onCorporateSelect(corporate)} key={index}>
                                                                      <View style={styles.modalItem}>
                                                                                {selectedCorporate?.ID_CORPORATE == corporate.ID_CORPORATE ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                                                                                          <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                                <Text numberOfLines={1} style={styles.modalText}>{corporate.DESCRIPTION}</Text>
                                                                      </View>
                                                            </TouchableNativeFeedback>
                                                  })}
                                        </View>
                              </View>
                    )
          }

          const ClientsModalize = () => {
                    const [loading, setLoading] = useState(true)
                    const { height } = useWindowDimensions()
                    const onClientSelect = (client) => {
                              clientsModRef.current.close()
                              dispatch(setClientAction(client))
                    }
                    const getDefaultQ = () => {
                              if(selectedClient) {
                                        if(selectedClient == 'autre' || selectedClient == 'covoiturage') {
                                                  return ''
                                        }
                                        return getSelectedClientLabel()
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
                                                  const clients = await fetchApi(`/rider_kcb/${selectedCorporate?.ID_CORPORATE}?limit=20&q=${q}`)
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
                    const clientsToShow = q != '' ? result : clients
                    if(loading || loadingClients) {
                              return <View style={{ flex: 1, height: height-50, justifyContent: 'center', alignItems: 'center'}}>
                                        <ActivityIndicator animating={true} size="large" color={"#000"} />
                              </View>
                    }
                    return (
                              <View style={styles.modalContent}>
                                        <View style={{ paddingHorizontal: 15 }}>
                                        <Input
                                                  placeholder="Chercher le client"
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
                                                  {selectedCorporate.ID_CORPORATE != 31 && <>
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
                                                  </>}
                                                  {clientsToShow.map((client, index) => {
                                                            return <TouchableNativeFeedback onPress={() => onClientSelect(client)} key={index}>
                                                                      <View style={styles.modalItem}>
                                                                                {selectedClient?.RIDE_KCB_ID == client.RIDE_KCB_ID ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                                                                                          <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                                <Text numberOfLines={1} style={styles.modalText}>{client.NOM}</Text>
                                                                      </View>
                                                            </TouchableNativeFeedback>
                                                  })}
                                        </View>}
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
                                                            <AntDesign name="caretdown" size={16} color="#77autre7" />
                                                  </TouchableOpacity>
                                                  {selectedClient == '' &&
                                                  <FormControl isRequired isInvalid={errors.numero}>
                                                            <Input
                                                                      placeholder="Nom et prénom de l'employé"
                                                                      size='lg'
                                                                      borderRadius={10}
                                                                      value={autreClient}
                                                                      onChangeText={onAutreClientChange}
                                                                      mt={3}
                                                                      backgroundColor="#f1f1f1"
                                                                      multiline
                                                                      maxHeight={150}
                                                            />
                                                  </FormControl>}

                                                 { selectedClient == 'autre' && 
                                                            <FormControl isRequired isInvalid={errors.numero}>
                                                                      <Input
                                                                                placeholder="Numero de l'employé"
                                                                                size="lg"
                                                                                borderRadius={10}
                                                                                value={autreNumero}
                                                                                onChangeText={onAutreNumeroChange}
                                                                                keyboardType="number-pad"
                                                                                py={3}
                                                                                mt={3}
                                                                                backgroundColor="#f1f1f1"
                                                                                multiline
                                                                                maxHeight={150}
                                                                      />
                                                                      {errors.numero && <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                                                                { errors.numero }
                                                                      </FormControl.ErrorMessage>}
                                                            </FormControl>}
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
                                        {/* {selectedClient == 'autre' && <View style={styles.formGroup}>
                                                  <Text style={styles.title}>
                                                            Agence
                                                  </Text>
                                                  <TouchableOpacity onPress={() => agenceModRef.current.open()} style={styles.openModalize}>
                                                            <Text style={styles.openModalizeLabel} numberOfLines={1}>
                                                                      {selectedAgence?.DESCRIPTION ?? "Sélectionner la réponse"}
                                                            </Text>
                                                            <AntDesign name="caretdown" size={16} color="#777" />
                                                  </TouchableOpacity>
                                        </View>} */}
                              </ScrollView>
                              <Portal>
                                        <Modalize ref={typeRef} adjustToContentHeight handleStyle={{ display: 'none' }} modalStyle={{ borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>
                                                  <TypesModalize />
                                        </Modalize>
                              </Portal>
                              <Portal>
                                        <Modalize ref={corporateRef} handleStyle={{ display: 'none' }} modalStyle={{ borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>
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