import React from 'react'
import { useRoute } from "@react-navigation/native"
import { View, StyleSheet, Text, ScrollView } from "react-native"
import moment from 'moment'

export default function NotificationsDetailScreen() {
          const route = useRoute()
          const { course } = route.params
          var type = ''
          if(course.TYPE_DECLARATION_ID == 2)  {
                    type = "Course annulée"
          } else if(course.TYPE_DECLARATION_ID == 1) {
                    type = "Vrai course"
          }
          return (
                    <ScrollView style={styles.container}>
                              <View style={styles.item}>
                                        <Text style={styles.itemTitle}>
                                                  Date de déclaration
                                        </Text>
                                        <Text style={styles.itemValue}>
                                                  { moment(course.DATE_INSERTION).format('DD-MM-YYYY H:mm')}
                                        </Text>
                              </View>
                              <View style={styles.item}>
                                        <Text style={styles.itemTitle}>
                                                  Type de déclaration
                                        </Text>
                                        <Text style={styles.itemValue}>
                                                  { type }
                                        </Text>
                              </View>
                              {course.RAISON_ANNULATION && <View style={styles.item}>
                                        <Text style={styles.itemTitle}>
                                                  Raison d'annulation
                                        </Text>
                                        <Text style={styles.itemValue}>
                                                  { course.RAISON_ANNULATION }
                                        </Text>
                              </View>}
                              {course.INCIDENT_DESCRIPTION && <View style={styles.item}>
                                        <Text style={styles.itemTitle}>
                                                  Incident déclarée
                                        </Text>
                                        <Text style={styles.itemValue}>
                                                  { course.INCIDENT_DESCRIPTION }
                                        </Text>
                              </View>}
                              <View style={styles.item}>
                                        <Text style={styles.itemTitle}>
                                                  Chauffeur
                                        </Text>
                                        <Text style={styles.itemValue}>
                                                  { course.NOM_CHAFFEUR } { course.PRENOM_CHAUFFEUR }
                                        </Text>
                              </View>
                              <View style={styles.item}>
                                        <Text style={styles.itemTitle}>
                                                  Corporate
                                        </Text>
                                        <Text style={styles.itemValue}>
                                                  { course.CORPORATE_DESCRIPTION }
                                        </Text>
                              </View>
                              <View style={styles.item}>
                                        <Text style={styles.itemTitle}>
                                                  Pickup
                                        </Text>
                                        <Text style={styles.itemValue}>
                                                  { course.PICKUP }
                                        </Text>
                              </View>
                              <View style={styles.item}>
                                        <Text style={styles.itemTitle}>
                                                  Destination
                                        </Text>
                                        <Text style={styles.itemValue}>
                                                  { course.DESTINATION }
                                        </Text>
                              </View>
                              <View style={styles.item}>
                                        <Text style={styles.itemTitle}>
                                                  Client
                                        </Text>
                                        <Text style={styles.itemValue}>
                                                  { course.NOM }
                                        </Text>
                              </View>
                              <View style={styles.item}>
                                        <Text style={styles.itemTitle}>
                                                  Durée
                                        </Text>
                                        <Text style={styles.itemValue}>
                                                  { course.TIME_SPENT ?? 'N/A' }
                                        </Text>
                              </View>
                              <View style={styles.item}>
                                        <Text style={styles.itemTitle}>
                                                  Distance
                                        </Text>
                                        <Text style={styles.itemValue}>
                                                  { course.KM_SPENT ?? 'N/A' }
                                        </Text>
                              </View>
                              <View style={styles.item}>
                                        <Text style={styles.itemTitle}>
                                                  Montant
                                        </Text>
                                        {course.MONTANT ? <Text style={styles.itemValue}>
                                                  { course.MONTANT?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") } Fbu
                                        </Text> :
                                        <Text style={styles.itemValue}>
                                                  N/A
                                        </Text>}
                              </View>
                              <View style={styles.item}>
                                        <Text style={styles.itemTitle}>
                                                  Date début de la course
                                        </Text>
                                        {course.DATE_DEBUT_COURSE ? <Text style={styles.itemValue}>
                                                  { moment(course.DATE_DEBUT_COURSE).format('DD-MM-YYYY H:mm')}
                                        </Text> :
                                        <Text style={styles.itemValue}>
                                                  N/A
                                        </Text>}
                              </View>
                              <View style={{...styles.item, marginBottom: 20 }}>
                                        <Text style={styles.itemTitle}>
                                                  Date fin de la course
                                        </Text>
                                        {course.DATE_FIN_COURSE ? <Text style={styles.itemValue}>
                                                  { moment(course.DATE_FIN_COURSE).format('DD-MM-YYYY H:mm')}
                                        </Text> :
                                        <Text style={styles.itemValue}>
                                                  N/A
                                        </Text>}
                              </View>
                    </ScrollView>
          )
}

const styles = StyleSheet.create({
          container: {
                    paddingHorizontal: 20,
                    flex: 1,
                    backgroundColor: '#F3F7F7'
          },
          item: {
                    marginTop: 10
          },
          itemTitle: {
                    fontSize: 17,
                    fontWeight: 'bold',
                    opacity: 0.8,
          },
          itemValue: {
                    color: '#777',
                    fontSize: 16
          },
})