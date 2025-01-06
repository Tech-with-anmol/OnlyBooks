import { View, Text, TouchableOpacity , StyleSheet} from 'react-native'
import React from 'react'
import { Account } from 'react-native-appwrite'
import { client } from '@/lib/appwrite'
import {useRouter} from 'expo-router'
import Toast from 'react-native-toast-message'


export default function Settings() {

  const router = useRouter();

  const account = new Account(client);

  const handlelogout = async() => {
    try{
      await account.deleteSession('current');
      router.replace('/sign_in');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Failure',
        text2: 'Failed to log out please try again'
      })
    }
    
  }

  return (
    <View style={styles.container}>
     <TouchableOpacity onPress={handlelogout}>
      <Text>Log Out</Text>
     </TouchableOpacity>
     <TouchableOpacity>
      <Text>About</Text>
     </TouchableOpacity>
     <TouchableOpacity>
      <Text>Feedback</Text>
     </TouchableOpacity>
     <TouchableOpacity>
      <Text>Contact US</Text>
     </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container : {
    flex : 1
  }
})