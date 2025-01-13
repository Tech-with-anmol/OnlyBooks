import { View, Text, Image, StyleSheet, Dimensions, TextInput, TouchableOpacity, ScrollView, Platform, ActivityIndicator} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import AntDesign from '@expo/vector-icons/AntDesign'
import {useRouter} from 'expo-router'
import { useFonts, Poppins_300Light, Poppins_500Medium } from '@expo-google-fonts/poppins'
import { DMSerifText_400Regular } from '@expo-google-fonts/dm-serif-text'
import Ionicons from '@expo/vector-icons/Ionicons'
import * as SplashScreen from 'expo-splash-screen'
import { Account, Databases, ID } from 'react-native-appwrite'
import { client } from '../lib/appwrite'
import Toast from 'react-native-toast-message'

SplashScreen.preventAutoHideAsync();

const {height, width} = Dimensions.get('window')

export default function sign_up() {

  const account = new Account(client);
  const router = useRouter();
  const databases = new Databases(client);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [userId, setuserId] = useState('');
  const [done, setdone] = useState(false);

  useEffect(() => {
    const sessionCheck = async() => {
      try {
        const session = await account.get();
        setuserId(session.$id);
        if(session) {
          router.replace('/Home');
        } 
      } catch( error) {
        
      }
    };
    sessionCheck();
  }, []);

  const handleContinue = async() => {

    console.log('handle strted');
    if (!email.includes('@')) {
      Toast.show({
        type: 'info',
        text1: 'Error',
        text2: 'Please enter correct email address'
      });
      return;
    }

    if (password.length <= 8) {
      Toast.show({
        type: 'info',
        text1: 'Error',
        text2: 'Please enter password of more than 8 digits'
      });
      return;
    }

    if (name.length <= 3) {
      Toast.show({
        type: 'info',
        text1: 'Error',
        text2: 'Please enter name longer than 3 digits'
      });
      return;
    }
    
    setdone(true);

    console.log ('',{userId, email, password, name,bio})
    try {
      console.log('process started bro!!')
      await account.create('unique()', email, password, name);
      
      console.log('check 1: ', {email, password})
      await account.createEmailPasswordSession(email,password);
      await account.updatePrefs({userbio : bio})
      Toast.show({
        type: 'success',
        text1: 'Account created',
        text2: 'Account successfully created'
      });
      console.log('only dbleft')
      const session = await account.get();
      setuserId(session.$id)
      await databases.createDocument('677ad7c60012a997bf2c', '677ad7d000244716f3a6', 'unique()', {
        userId,
        email,
        password,
        name,
        bio 
      });
      router.replace('/Home');
    } catch (error) {
      console.log('error', error)
      Toast.show({
        type: 'error',
        text1: 'Failure',
        text2: 'Please try again'
      });
    } finally {
      setdone(false);
    }
  }

  const [loaded, error] = useFonts({
    Poppins_300Light,
    Poppins_500Medium,
    DMSerifText_400Regular
  });

  useEffect(() => {
    if(loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if(!loaded && !error){
    return null;
  }

  

  return (
    <View style={styles.container}>
      <ScrollView>
      <Image style={styles.Logo} source={require('../assets/images/icon.png')}/>
      <Text style={styles.welcometxt}>Welcome to OnlyBooks!</Text>
      <View >
        <View style={styles.input}>
          <AntDesign name='mail' size={32}/>
          <TextInput style={{
          fontFamily: Platform.select({
            android: 'Poppins_300Light',
            ios: 'Poppins-Light'
          })
        }} 
        value={email}
        onChangeText={setEmail}
        placeholder='Enter your Email'/>
        </View>
        <View style={styles.input}>
        <Ionicons  name='key' size={32}/>
        <TextInput style={{
          fontFamily: Platform.select({
            android: 'Poppins_300Light',
            ios: 'Poppins-Light'
          })
        }} 
        value={password}
        secureTextEntry={true}
        onChangeText={setPassword}
        placeholder='Enter your password'/>
        </View>
        <View style={styles.input}>
        <AntDesign  name='user' size={32}/>
        <TextInput style={{
          fontFamily: Platform.select({
            android: 'Poppins_300Light',
            ios: 'Poppins-Light'
          })
        }}
      value={name}
      onChangeText={setName}
      placeholder='Enter your name'/>
        </View>
        <View style={styles.inputpref}>
        <AntDesign style={{marginTop:10}}name='message1' size={32}/>
        <TextInput style={{
          fontFamily: Platform.select({
            android: 'Poppins_300Light',
            ios: 'Poppins-Light'
          })
        }}
        value={bio}
        onChangeText={setBio}
        placeholder='Enter Bio (You can skip writing bio!)'/>
        </View>
      </View>
      <View style={styles.signInsugg}>
        <Text style={{
          fontFamily: Platform.select({
            android: 'Poppins_500Medium',
            ios: 'Poppins-Medium'
          }),
          fontSize  : 16,
          fontWeight: '500',
        }}>Already a member?</Text>
        <TouchableOpacity onPress={() => router.replace('/sign_in')}>
          <Text style={{color: 'rgba(96, 163, 79, 0.9)',
            fontFamily: Platform.select({
              android: 'Poppins_500Medium',
              ios: 'Poppins-Medium'
            }), 
            fontSize: 17,
          }}> Sign in</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleContinue} style={styles.savebtn}>
        <Text style={styles.savetxt}>Continue</Text>
      </TouchableOpacity>
      {done && (
        <View style={styles.done}>
          <ActivityIndicator size="large" color="#000"/>
        </View>
      )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex : 1,
    backgroundColor: '#fff'
  },
  Logo: {
    height: height * 0.2,
    width: width * 0.39,
    backgroundColor: '#000',
    borderRadius: 20,
    left: width * 0.06,
    top: height * 0.03,
    shadowColor: '#000',
    shadowOffset: {height: 10, width: 10},
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  input: {
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
    marginTop: 10,
    
  },
  welcometxt: {
    top: height * 0.07,
    left: width * 0.08,
    fontFamily: Platform.select({
      android: 'Poppins_500Medium',
      ios: 'Poppins-Medium'
    }),
    fontSize: 24,
  },
  inputpref: {
    flexDirection: 'row',
    height: height * 0.15,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderWidth: 2.1,
    borderColor: 'rgba(196, 185, 185, 0.8)',
    borderRadius: 20,
    paddingHorizontal: 18,
    gap: 12,
    width: width * 0.9,
    marginLeft: 20,
    top: height * 0.1,
    marginTop: 20,
    
  },
  savebtn: {
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
  savetxt: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
  },
  done : {
    position: 'absolute',
    top: height * 0.5,
    left: width * 0.5,
    transform: [{ translateX: -50}, {translateY: -50}]
  },
  signInsugg : {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    position: 'absolute',
    top: height * 0.75,
    alignSelf: 'center',  
  }
})