import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity, FlatList } from 'react-native'
import React, { useState } from 'react'
import Homescreen from '@/component/homescreen'
import { useFonts,Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import Fetchposts from '@/component/fetch-posts';

const {height, width} = Dimensions.get('window');

SplashScreen.preventAutoHideAsync();

export default function Home() {

  const router = useRouter();
  const [posts, setPosts] = useState([]);

  
  const [loaded, error] = useFonts({
      Poppins_600SemiBold
    });
  
    useEffect(() => {
      if(loaded || error) {
        SplashScreen.hideAsync();
      }
    }, [loaded, error]);

    useEffect(() => {
      const loadposts = async() => {
        const postdata = await Fetchposts();
        setPosts(postdata)
      }
      loadposts();
    }, []);

    if(!loaded && !error) {
      return null;
    }

  const handleProfile = () => {
    router.push('/Profile');
  }
  

  const renderpost = ({item}) => (
    <View style={styles.card}>
      <Text>{item.content}</Text>
    </View>
  )
  return (
    <View style={styles.container}>
      <Text style={styles.logotxt}>OnlyBooks</Text>
       <TouchableOpacity style={styles.notification}>
        <Ionicons name='heart-outline' size={32}/>
       </TouchableOpacity>
       <TouchableOpacity onPress={() => router.push('/Post')} style={styles.posticon}>
        <Ionicons name='add-circle-outline' size={32}/>
       </TouchableOpacity>
       <TouchableOpacity style={styles.peopleicon} onPress={handleProfile}>
        <AntDesign name='user' size={32}/>
       </TouchableOpacity>
       <View style={{marginTop: 80}}>
        
       <FlatList
       data={posts}
       keyExtractor={(item) => item.$id}
       renderItem={renderpost}/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex : 1,
        backgroundColor: '#fff'
    },
     logo:{
        flex: 1
     },
     logotxt:{
        position: 'absolute',
        top : height * 0.01,
        left: width * 0.03,
        fontFamily : Platform.select({
            android: 'Poppins_600SemiBold',
            ios: 'Poppins-SemiBold'
        }),
        fontSize: 24
     },
     notification : {
        position: 'absolute',
        top: height * 0.02,
        left: width*  0.68,
     },
     posticon : {
        position: 'absolute',
        top: height * 0.02,
        left: width * 0.78
    },
    peopleicon: {
        position: 'absolute',
        top: height * 0.02,
        left: width * 0.88
    },
    card: {
      padding: 10,
      backgroundColor: 'rgba(248, 245, 245, 0.81)',
      borderRadius: 5,
      margin: 10,
    }
})