import { View, Text, StyleSheet, Dimensions, Platform, TextInput, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useFonts, DMSerifText_400Regular } from '@expo-google-fonts/dm-serif-text';
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router'
import AntDesign from '@expo/vector-icons/AntDesign'

const {height, width} = Dimensions.get('window');
SplashScreen.preventAutoHideAsync();

export default function Editprofile() {

  const router = useRouter();

  const[loaded, error] = useFonts({
    DMSerifText_400Regular
  });

  useEffect(() => {
    if(loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if(!loaded && !error) {
    return null;
  }

  const handleback = ():void => {
    router.push('/Profile')
  }
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleback}>
        <Ionicons style={styles.backbtn} name='chevron-back' size={32}/>
      </TouchableOpacity>
      <Text style={styles.Edittxt}>Edit profile</Text>
      <Image style={styles.avatar} source={{uri: `https://avatar.iran.liara.run/public`}}/>
      
      <View>
        <View style={styles.input}>
          <AntDesign name='user' size={32}/>
          <TextInput placeholder='Enter your name?'/>
        </View>
        <View style={styles.input}>
        <AntDesign  name='message1' size={32}/>
        <TextInput  placeholder='Enter your Bio'/>
        </View>
        <View style={styles.inputpref}>
        <AntDesign style={{marginTop:10}}name='bulb1' size={32}/>
        <TextInput placeholder='Enter your prefrences for content'/>
        </View>
      </View>
      <TouchableOpacity style={styles.savebtn}>
        <Text style={styles.savetxt}>Save</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex : 1,
    backgroundColor: '#fff',
  },
  backbtn : {
    position: 'absolute',
    top: height * 0.02,
    left: width * 0.075,
    backgroundColor: 'rgba(184, 176, 176, 0.39)',
    borderRadius: 7,
  },
  Edittxt: {
    top: height * 0.01,
    left: width * 0.3,
    fontFamily: Platform.select({
      android: 'DMSerifText_400Regular',
      ios: 'DMSerifText-Regular'
    }),
    fontSize: 35,
  },
  nameHolder: {
    position: 'absolute',
    top: height * 0.1,
    left: width * 0.17,
    borderRadius: 10,
    borderColor: 'rgba(228, 223, 223, 0.9)',
    borderWidth: 4,
    width: width * 0.8
  },

  input: {
    flexDirection: 'row',
    height: height * 0.06,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 0.6,
    borderColor: 'rgba(124, 123, 123, 0.8)',
    borderRadius: 10,
    paddingHorizontal: 18,
    gap: 12,
    width: width * 0.9,
    marginLeft: 20,
    top: height * 0.1,
    marginTop: 20,
  },
  inputpref: {
    flexDirection: 'row',
    height: height * 0.2,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    borderWidth: 0.6,
    borderColor: 'rgba(124, 123, 123, 0.8)',
    borderRadius: 10,
    paddingHorizontal: 18,
    gap: 12,
    width: width * 0.9,
    marginLeft: 20,
    top: height * 0.1,
    marginTop: 20,
  },
  avatar : {
    height: 100,
    width : 100,
    borderRadius: 80,
    top : height * 0.04,
    left: width * 0.35,
    zIndex: 1
  },
  namelogo: {
    top: height * 0.11,
    left: width * 0.07,
  },
  bioHolder: {
    position: 'absolute',
    top: height * 0.2,
    left: width * 0.17,
    borderRadius: 10,
    borderColor: 'rgba(228, 223, 223, 0.9)',
    borderWidth: 4,
    width: width * 0.8
  },
  prefHolder: {
    position: 'absolute',
    top: height * 0.3,
    left: width * 0.17,
    borderRadius: 10,
    borderColor: 'rgba(228, 223, 223, 0.9)',
    borderWidth: 4,
    width: width * 0.8,
    height: height * 0.2,
  },
  biologo: {
    top: height * 0.17,
    left: width * 0.07,
  },
  preflogo: {
    top: height * 0.23,
    left: width * 0.07,
  },
  savebtn: {
    top: height * 0.45,
    left: width * 0.06,
    backgroundColor: 'rgba(105, 177, 211, 0.9)',
    borderRadius: 10,
    width: width * 0.9,
    height: height * 0.047,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowRadius: 20,
  },
  savetxt: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
  },
})