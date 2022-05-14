import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setRouteAction } from '../store/actions/appActions'
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, TouchableNativeFeedback, RefreshControl, ScrollView } from 'react-native'
import moment from 'moment'
import { Ionicons, AntDesign, Entypo, MaterialCommunityIcons } from '@expo/vector-icons'; 
import fetchApi from '../helpers/fetchApi'
import { userSelector } from '../store/selectors/userSelector'
import useFetch from '../hooks/useFetch'
import Skeletons from '../components/Skeletons'
import { corporateSelector } from '../store/selectors/appSelectors'
import { Portal } from 'react-native-portalize'
import { Modalize } from 'react-native-modalize'
import subText from '../helpers/subText'

const Course = ({ course, index }) => {
          return (
                    <View style={styles.course}>
                              <View style={styles.courseDesc}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                  <Text style={{...styles.courseTitle, width: '50%', color: '#000', opacity: 0.8, fontWeight: 'bold' }}>{ course.CORPORATE_DESCRIPTION }</Text>
                                                  <Text style={styles.courseTitle}>{ moment(course.DATE_INSERTION).format('DD-MM-YYYY H:mm')}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                                                  <Entypo name="location-pin" size={20} color="blue" />
                                                  <Text style={styles.courseTitle}>{ course.PICKUP }</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                                                  <Entypo name="location-pin" size={20} color="green" />
                                                  <Text style={styles.courseTitle}>{ course.DESTINATION }</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                                                  <AntDesign name="user" size={20} color="black" />
                                                  <Text style={styles.courseTitle}>{ course.NOM }</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                                  <Text style={{...styles.courseTitle, color: '#000', fontSize: 18, opacity: 0.8}}>{ course.MONTANT.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") } Fbu</Text>
                                                  {course.STATUS_PAYE == 1 && <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                                            <Text style={styles.courseTitle}>payé</Text>
                                                            <AntDesign name="checkcircle" size={20} color="green" style={{marginLeft: 5}} />
                                                  </View>}
                                        </View>
                              </View>
                    </View>
          )
}

export default function HistoryScreen() {
          const route = useRoute()
          const dispatch = useDispatch()
          const navigation = useNavigation()
          const corporateRef = useRef(null)
          const monthsRef = useRef(null)
          const yearsRef = useRef(null)
          
          useFocusEffect(useCallback(() => {
                    dispatch(setRouteAction(route.name))
          }, []))

          const [initiialLoading, setInitialLoading] = useState(true)
          const [histories, setHistories] = useState([])
          const user = useSelector(userSelector)

          const [l, lastCorporate] = useFetch(`/declarations/last_course/${user.DRIVER_ID}`)
          const [loadingCorporates, corporates] = useFetch('/corporate?limit=100') // get corporates
          const [refreshing, setRefreshing] = useState(false)
          const [selectedCorporate, setCoporate] = useState({})

          const [months] = useState(['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'])
          const [selectedMonth, setSelectedMonth] = useState(moment().get('month'))
          const [years, setYears] = useState([])
          const [selectedYear, setSelectedYear] = useState(moment().get('year'))

          useEffect(() => {
                    setCoporate(lastCorporate)
          },[lastCorporate])

          const onRefresh = async () => {
                    setRefreshing(true)
                    const histories = await fetchApi(`/declarations/${user.DRIVER_ID}?corporate=${selectedCorporate.ID_CORPORATE}&month=${selectedMonth+1}&year=${selectedYear}`)
                    setHistories(histories)
                    setRefreshing(false)
          }

          useEffect(() => {
                    (async () => {
                              if(selectedCorporate.ID_CORPORATE) {
                                        setInitialLoading(true)
                                        const histories = await fetchApi(`/declarations/${user.DRIVER_ID}?corporate=${selectedCorporate.ID_CORPORATE}&month=${selectedMonth+1}&year=${selectedYear}`)
                                        setHistories(histories)
                                        setInitialLoading(false)
                              }
                    })()
          }, [selectedCorporate, selectedMonth, selectedYear])

          useEffect(() => {
                    const initYear = 2017
                    const currentYear = moment().get('year')
                    const years = []
                    for(let i = currentYear; i >=  initYear; i--) {
                              years.push(i)
                    }
                    setYears(years)
          }, [])
          

          
          const CorporatesModalize = () => {
                    const onCorporateSelect = (corporate) => {
                              corporateRef.current.close()
                              setCoporate(corporate)
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

          const MonthsModalize = () => {
                    const onMonthSelect = (index) => {
                              monthsRef.current.close()
                              setSelectedMonth(index)
                    }
                    return (
                              <View style={styles.modalContent}>
                                        <View style={styles.modalList}>
                                                  {months.map((month, index) => {
                                                            return <TouchableNativeFeedback onPress={() => onMonthSelect(index)} key={index}>
                                                                      <View style={styles.modalItem}>
                                                                                {index == selectedMonth ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                                                                                          <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                                <Text numberOfLines={1} style={styles.modalText}>{ month }</Text>
                                                                      </View>
                                                            </TouchableNativeFeedback>
                                                  })}
                                        </View>
                              </View>
                    )
          }

          const YearsModalize = () => {
                    const onYearSelect = (year) => {
                              yearsRef.current.close()
                              setSelectedYear(year)
                    }
                    return (
                              <View style={styles.modalContent}>
                                        <View style={styles.modalList}>
                                                  {years.map((year, index) => {
                                                            return <TouchableNativeFeedback onPress={() => onYearSelect(year)} key={index}>
                                                                      <View style={styles.modalItem}>
                                                                                {selectedYear == year ? <MaterialCommunityIcons name="radiobox-marked" size={24} color="#007bff" /> :
                                                                                          <MaterialCommunityIcons name="radiobox-blank" size={24} color="#777" />}
                                                                                <Text numberOfLines={1} style={styles.modalText}>{ year }</Text>
                                                                      </View>
                                                            </TouchableNativeFeedback>
                                                  })}
                                        </View>
                              </View>
                    )
          }
          
          if(initiialLoading) {
                    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                              <ActivityIndicator animating={true} size="large" color="#000" />
                    </View>

          }

          var total = 0
          histories.map(history => {
                    total += parseFloat(history.MONTANT)
          })
          return (
                    <View style={styles.container}>
                              <View style={styles.courseList}>
                                        <View style={styles.header}>
                                                  <TouchableOpacity onPress={() => corporateRef.current.open()} style={styles.openModalize}>
                                                            <Text style={styles.openModalizeLabel} numberOfLines={1}>
                                                                      {selectedCorporate.DESCRIPTION}
                                                            </Text>
                                                            <AntDesign style={{ marginLeft: 5 }} name="caretdown" size={16} color="#777" />
                                                  </TouchableOpacity>
                                                  <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                                                            <TouchableOpacity onPress={() => monthsRef.current.open()} style={styles.openModalize}>
                                                                      <Text style={styles.openModalizeLabel} numberOfLines={1}>
                                                                                { subText(months[selectedMonth], 3, false, '') }
                                                                      </Text>
                                                                      <AntDesign style={{ marginLeft: 5 }} name="caretdown" size={16} color="#777" />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={() => yearsRef.current.open()} style={{...styles.openModalize, marginLeft: 10}}>
                                                                      <Text style={styles.openModalizeLabel} numberOfLines={1}>
                                                                                { selectedYear }
                                                                      </Text>
                                                                      <AntDesign style={{ marginLeft: 5 }} name="caretdown" size={16} color="#777" />
                                                            </TouchableOpacity>
                                                  </View>
                                        </View>
                                        {histories.length > 0 && <View style={{ marginBottom: 10, paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between'}}>
                                                  <Text style={{ fontSize: 17, fontWeight: 'bold', opacity: 0.8}}>Courses: { histories.length }</Text>
                                                  <Text style={{ fontSize: 17, fontWeight: 'bold', opacity: 0.8}}>Total: { total.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") } Fbu</Text>
                                        </View>}
                                        <ScrollView style={{ flex: 1}} 
                                                  refreshControl={<RefreshControl
                                                            colors={["#000"]} refreshing={refreshing}
                                                            onRefresh={onRefresh} />}>
                                        {histories.length == 0 && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50}}>
                                                  <Text style={{ color: '#777', fontSize: 18, marginVertical: 10}}>
                                                            Aucune course trouvée
                                                  </Text>
                                                  <Text style={{ color: '#777' }}>Coporate: {selectedCorporate.DESCRIPTION}</Text>
                                                  <Text style={{ color: '#777' }}>{ months[selectedMonth] } { selectedYear }</Text>
                                        </View>}
                                        {/* {histories.length > 0 && <FlatList
                                                  data={histories}
                                                  renderItem={({ item, index}) => <Course course={item} index={index} /> }
                                                  keyExtractor={(course) => course.DECLARATION_ID.toString()}
                                                  style={{ marginTop: 10, flex: 1}}
                                                  refreshControl={<RefreshControl
                                                            colors={["#000"]} refreshing={refreshing}
                                                            onRefresh={onRefresh} />}
                                        />} */}
                                        {histories.map(( course, index) => <Course course={course} index={index} key={course.DECLARATION_ID.toString()} />)}
                                        </ScrollView>
                              </View>
                              <Portal>
                                        <Modalize ref={corporateRef} handleStyle={{ display: 'none' }} modalStyle={{ borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>
                                                  <CorporatesModalize />
                                        </Modalize>
                              </Portal>
                              <Portal>
                                        <Modalize ref={monthsRef} handleStyle={{ display: 'none' }} modalStyle={{ borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>
                                                  <MonthsModalize />
                                        </Modalize>
                              </Portal>
                              <Portal>
                                        <Modalize ref={yearsRef} adjustToContentHeight handleStyle={{ display: 'none' }} modalStyle={{ borderTopRightRadius: 20, borderTopLeftRadius: 20 }}>
                                                  <YearsModalize />
                                        </Modalize>
                              </Portal>
                    </View>
          )
}

const styles = StyleSheet.create({
          container: {
                    flex: 1,
                    backgroundColor: '#F3F7F7',
          },
          course: {
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    backgroundColor: '#fff',
                    margin: 10,
                    marginVertical: 5,
                    elevation: 1,
                    borderRadius: 10
          },
          courseDesc: {
                    marginLeft: 5,
          },
          courseTitle: {
                    color: '#777',
                    fontSize: 14
          },
          courseList: {
                    flex: 1,
          },
          header: {
                    paddingHorizontal: 15,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginVertical: 10
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