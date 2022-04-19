import React from 'react'
import { View } from 'react-native'

export default function Skeletons() {
          return (
                    <View style={{alignItems:"center", paddingTop: 15, paddingHorizontal: 10}}>
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