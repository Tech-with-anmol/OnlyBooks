import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Text, Platform } from 'react-native';
import React, { useEffect } from 'react';
import Editor from '@/component/dom-components/hello-dom'
import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts, DMSerifText_400Regular } from '@expo-google-fonts/dm-serif-text';
import * as SplashScreen from 'expo-splash-screen'
import DropDownPicker from 'react-native-dropdown-picker'
import { router } from 'expo-router';
import { client } from '@/lib/appwrite';
import { Account, Databases, Query } from 'react-native-appwrite';



const IS_DOM = typeof Editor!== "undefined";
const {height, width} = Dimensions.get('window');

SplashScreen.preventAutoHideAsync();


export default function Post() {

  const[userData, setUserData] = useState({email: '', name: ''})

  const account = new Account(client);
  const database = new Databases(client);

  useEffect(() => {
    const getData = async() => {
      const data = await account.get();
      setUserData({
        name: data.name,
        email: data.email
      })
    }
    getData();
  })

  const [open, setOpen] = useState(false);
  const[value, setValue] = useState(null);
  const[items, setItems] =useState([
    {label: 'Book', value: 'book', icon: () => <Ionicons name='book' size={20}/>},
    {label: 'Quote', value: 'quote', icon: () => <Ionicons name='text' size={20}/>},
    {label: 'Research', value: 'research', icon: () => <Ionicons name='telescope' size={20}/>},
    {label: 'Education', value: 'education', icon: () => <Ionicons name='bulb' size={20}/>}
  ])
  
  const [editorState, setEditorState] = useState<string | null>(null);
  const [plainText, setPlainText] = useState("");
  const wordCount = editorState?.split(" ").length ?? 0;

  const[loaded, error] = useFonts({
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

  const handlePost = async() => {
    try{
        const userAv = await database.listDocuments('677ad7c60012a997bf2c','677ad7d000244716f3a6', [
                Query.equal('email', userData.email)
        ])
        const newpost = await database.createDocument('677ad7c60012a997bf2c', '677d348300118c369c4c', 'unique()', {
          name : userData.name,
          email : userData.email,
          content: plainText,
          
        });
        
        await database.createDocument('677ad7c60012a997bf2c', '69', newpost.$id , {
          name : userData.name,
          avatar : userAv.documents[0].avatar
        });
        router.replace('/Home')
     } catch(error) {
        console.log(error)
     }
  }

  return (
    <>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backbtn}>
        <Ionicons name='chevron-back' size={32}/>
      </TouchableOpacity>
      <Text style={styles.headerTxt}>Post</Text>
      <TouchableOpacity onPress={handlePost}>
        <Ionicons name='paper-plane-outline' size={32}/>
      </TouchableOpacity>
    </View>
    <Text></Text>
    <DropDownPicker
    style={styles.dropdown}
    dropDownContainerStyle={styles.dropdownlist}
    placeholder='Select a cateogry please..'
    open={open}
    value={value}
    items={items}
    setOpen={setOpen}
    setValue={setValue}
    setItems={setItems}
    />
    <Text></Text>
    <Editor setPlainText={setPlainText} setEditorState={setEditorState}/>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 0.3,
  },
  backbtn: {
    backgroundColor: 'rgba(122, 118, 118, 0.22)',
    borderRadius: 5,
  },
  headerTxt: {
    position: 'absolute',
    left: width * 0.45,
    top: height * 0.01,
    fontFamily : Platform.select({
      android: 'DMSerifText_400Regular',
      ios:'DMSerifText-Regular'
    }),
    fontSize: 27,
  },
  dropdown: {
    borderRadius: 20,
    width: width * 0.9,
    alignSelf: 'center',

  },
  dropdownlist: {
    width: width * 0.9,
    alignSelf: 'center',
    
  },
});