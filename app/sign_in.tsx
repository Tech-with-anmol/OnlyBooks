import { View, Text, Image, StyleSheet, Platform, Dimensions , TextInput, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFonts,Poppins_300Light, Poppins_500Medium } from '@expo-google-fonts/poppins'
import { DMSerifText_400Regular } from '@expo-google-fonts/dm-serif-text'
import * as SplashScreen from 'expo-splash-screen'
import Ionicons from '@expo/vector-icons/Ionicons'
import { router } from 'expo-router'
import { client } from '@/lib/appwrite'
import { Account } from 'react-native-appwrite'
import Toast from 'react-native-toast-message'

const{height, width} = Dimensions.get('window')

SplashScreen.preventAutoHideAsync();

export default function sign_in() {
  
  const account = new Account(client);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleContinue =  async() => {
    if(!email.includes('@')){
      Toast.show({
        type: 'info',
        text1: 'Wrong credentials',
        text2: 'Plese enter correct email adress'
      })
    }
    if(password.length <= 8) {
      Toast.show({
        type: 'info',
        text1: 'wrong credentials',
        text2: 'Please enter correct password'
      })
    }
    try {
      await account.createEmailPasswordSession(email,password);
      router.replace('/Home')
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please try again ensuring correct credentials'
      })
    }
    
    
  }

  const[loaded, error] = useFonts({
    Poppins_300Light,
    DMSerifText_400Regular,
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

  return (
    <View>
      <Image style={styles.Logo} source={require('../assets/images/icon.png')}/>
      <Text style={styles.welcometxt}>Welcome Back</Text>
      <Text></Text>
      <View style={styles.input}>
        <Ionicons name='mail-outline' size={32}/>
        <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder='Enter your email'/>
      </View>
      <View style={styles.input}>
        <Ionicons name='key' size={32}/>
        <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder='Enter your password'/>
      </View>
      <View style={styles.SignReco}>
        <Text style={{
          fontFamily: Platform.select({
            android: 'Poppins_500Medium',
            ios: 'Poppins-Medium'
          })
        }}>Don't have a account?</Text>
        <TouchableOpacity onPress={() => router.replace('/sign_up')}>
          <Text style={{
            fontFamily: Platform.select({
              android: 'Poppins_500Medium',
              ios: 'Poppins-Medium'
            }),
            color: 'rgba(123, 189, 134, 0.8)'
          }}> Sign Up</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleContinue} style={styles.continuebtn}>
        <Text style={styles.continuetxt}>Continue</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  Logo: {
    height: height * 0.2,
    width: width * 0.39,
    backgroundColor: '#000',
    borderRadius: 20,
    alignSelf: 'center',
    top: height * 0.07,
    shadowColor: '#000',
    shadowOffset: {height: 10, width: 10},
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  welcometxt: {
    top: height * 0.12,
    alignSelf: 'center',
    fontFamily: Platform.select({
      android: 'DMSerifText_400Regular',
      ios: 'DMSerifText-Regular'
    }),
    fontSize: 29,
  },
  input : {
    flexDirection: 'row',
    height: height * 0.06,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 2.1,
    borderColor: 'rgba(196, 189, 189, 0.8)',
    borderRadius: 50,
    paddingHorizontal: 18,
    gap: 12,
    width: width * 0.9,
    marginLeft: 20,
    top: height * 0.1,
    marginTop: 20,
  },
  SignReco : {
    flexDirection: 'row',
    padding: 5,
    justifyContent: 'center',
    alignSelf: 'center',
    top: height * 0.13
  },
  continuebtn: {
    top: height * 0.17,
    left: width * 0.06,
    backgroundColor: 'rgba(128, 216, 155, 0.9)',
    borderRadius: 10,
    width: width * 0.9,
    height: height * 0.06,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowRadius: 20,
    shadowOffset: {height:10, width:10},
    elevation: 10,
  },
  continuetxt : {
    fontWeight: '500',
    fontSize: 17,
    alignSelf: 'center',

  },
})