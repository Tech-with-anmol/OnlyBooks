import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'
import React from 'react'

const {height, width} = Dimensions.get('window')

export default function sign_in() {
  return (
    <View style={styles.container}>
      <Image style={styles.Logo} source={require('../assets/images/icon.png')}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex : 1,
    backgroundColor: '#rgb(205,214,244)'
  },
  Logo: {
    height: height * 0.2,
    width: width * 0.39,
    backgroundColor: '#000',
    borderRadius: 20,
    left: width * 0.1,
    top: height * 0.1,
  }
})