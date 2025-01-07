import { View, Text, TouchableOpacity , StyleSheet, Dimensions, Platform} from 'react-native'
import React from 'react'
import { Account } from 'react-native-appwrite'
import { client } from '@/lib/appwrite'
import {useRouter} from 'expo-router'
import Toast from 'react-native-toast-message'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useFonts, Poppins_500Medium } from '@expo-google-fonts/poppins'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'


const {height, width} = Dimensions.get('window');
SplashScreen.preventAutoHideAsync()

export default function Settings() {

  
  const router = useRouter();

  const account = new Account(client);

  const[loaded, error] = useFonts({
    Poppins_500Medium
  });

  useEffect(() => {
    if(loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error])

  if(!loaded && !error){
    return null;
  }


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
  
  const handleback = () => {
    console.log('fuck nvm')
    router.back();
  }
  return (
    <View style={styles.container}>
      <View>
      <View>
      <TouchableOpacity onPress={handleback}>
        <Ionicons style={styles.backbtn} name='chevron-back' size={36}/>
      </TouchableOpacity>
      </View>
      </View>
      
      <Text></Text>
      <Text></Text>
     <TouchableOpacity onPress={() => router.push('../setting/1')} style={styles.button}>
      <Text style={styles.text}>About</Text>
      <Ionicons style={styles.iconsa} name='chevron-forward' size={32}/>
     </TouchableOpacity>
     <TouchableOpacity onPress={() => router.push('../setting/2')} style={styles.button}>
      <Text style={styles.text}>Feedback</Text>
      <Ionicons style={styles.iconsb} name='chevron-forward' size={32}/>
     </TouchableOpacity>
     <TouchableOpacity style={styles.button}>
      <Text style={styles.text}>Contact US</Text>
      <Ionicons style={styles.iconsc} name='chevron-forward' size={32}/>
     </TouchableOpacity>
     <TouchableOpacity style={styles.buttonl} onPress={handlelogout}>
      <Text style= {styles.text}>Log Out</Text>
      <Ionicons style={styles.icons} name='power' color="red" size={32}/>
     </TouchableOpacity>
     
    </View>
  )
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
    backgroundColor: '#fff'
  },
  backbtn : {
    top: height * 0.02,
    left: width * 0.05,
    backgroundColor: 'rgba(192, 187, 187, 0.39)',
    borderRadius: 7,
    width: 37
  },
  button: {
    flexDirection: 'row',
    alignContent: 'space-between',
    padding: 15,
    gap: 250,
    backgroundColor: 'rgb(252, 252, 252)',
    borderRadius: 20,
    margin: 20,
    borderColor: 'rgba(112, 109, 109, 0.9)',
    borderWidth: 0.4,
    
  },
  buttonl: {
    flexDirection: 'row',
    alignContent: 'space-between',
    padding: 15,
    gap: 250,
    backgroundColor: 'rgba(248, 202, 202, 0.21)',
    borderRadius: 20,
    margin: 20,
    borderColor: 'rgba(112, 109, 109, 0.9)',
    borderWidth: 0.4,
    
  },
  text: {
    fontFamily: Platform.select({
      android: 'Poppins_500Medium',
      ios: 'Poppins-Medium'
    })
  },
  icons: {
    left: width* 0 - 8,
  },
  iconsa: {
    left: width * 0 + 13
  },
  iconsb: {
    left: width * 0 - 14
  },
  iconsc: {
    left: width * 0 - 24
  }
})