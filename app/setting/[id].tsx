import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

export default function SettingF() {

  const { id }  = useLocalSearchParams<{id: string}>();
 
  console.info(id)
  const renderContent = () => {
    switch (id) {
        case '1':
            return(
                <View>
                  <Text></Text>
                  <Text>hi</Text>
                  </View>
            );
        case '2':
          return(
            <View>
              <Text>SEcond parm</Text>
            </View>
          );

       default: 
         return(
          <View>
            <Text>wrong path bro!!</Text>
          </View>
         )
      }
  }
  return (
    <View>
      {renderContent()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
})