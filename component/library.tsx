import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'

const {height, width} = Dimensions.get('window');
export default function Library() {
  return (
    <View>
      <Text style={styles.posttest}>library</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    posttest : {
        top: height * 0.4,
        padding: 20,
    }
})