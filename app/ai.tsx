import { View, Text, StyleSheet, Platform, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { client } from '@/lib/appwrite';
import { Account, Databases, Query} from 'react-native-appwrite'
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';



SplashScreen.preventAutoHideAsync();
const {height, width} = Dimensions.get('window')

export default function ai() {

  const database = new Databases(client);
  const account = new Account(client);


  const [booksCollection,setBookcollection] = useState<any>([]);
  const [userPrompt, setUserPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);


    const [loaded, error] = useFonts({
        Poppins_400Regular
    })

    useEffect(() => {
        if(loaded || error){
            SplashScreen.hideAsync()
        }
    }, []);

   

    useEffect(() => {
     const fetchLibrary = async () => {
        const userData = await account.get();
        const userBooks = await database.listDocuments('677ad7c60012a997bf2c', '677d348300118c369c4c', [
          Query.equal('email', userData.email),
          Query.isNotNull('Book')
        ]);
  
        const books = userBooks.documents.map(doc => doc.Book);
  
        setBookcollection(books);
        setUserPrompt(`Suggest at least 10 books based on these ( You should not use formatting options like bold, Title etc. at starting, write something intresting in bookworm language): ${booksCollection.join(', ')}`)
    };
    fetchLibrary();
  });

    if(!error && !loaded) {
      return null;
    }

    if(loading) {
      return <ActivityIndicator style={{
        alignSelf: 'center',
        justifyContent: 'center',
        marginTop: 400,
      }} size='large' color='#000'/>
    }

    const { OpenAI } = require("openai");

    const baseURL = process.env.EXPO_PUBLIC_API_URL;
    const apiKey = process.env.EXPO_PUBLIC_API_KEY;
    const systemPrompt = "You are a book suggestion giver based on user history. Be descriptive, funny and helpful.";
    const api = new OpenAI({
      apiKey,
      baseURL,
    });
    
    const main = async () => {
      setLoading(true);
      try{
          const completion = await api.chat.completions.create({
            model: "mistralai/Mistral-7B-Instruct-v0.2",
            messages: [
              {
                role: "system",
                content: systemPrompt,
              },
              {
                role: "user",
                content: userPrompt,
              },
            ],
            temperature: 0.7,
            max_tokens: 500,
          });
        
          const response = completion.choices[0].message.content;
    
          setAiResponse(response)
        } catch(error) {
          console.log(error)
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2 : 'There is some issue with server. Please try later'
          })
        } finally{
          setLoading(false);
        }
    };
    
  return (
    <View style={styles.container}>
     <TouchableOpacity style={styles.GenerateBtn} onPress={() => main()}>
      <Ionicons name='sparkles-outline' size={40} color="rgb(218, 252, 0)" />
     </TouchableOpacity>
     <ScrollView>
      <Text style={styles.aiOutput}>{aiResponse}</Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    container :{
        flex: 1,
        backgroundColor: 'rgba(238, 229, 203, 0.8)'
    },

    aiOutput: {
        textAlign: 'center',
        margin: 20,
        fontSize : 15,
        fontFamily: Platform.select({
            android: 'Poppins_ 400Medium',
            ios : 'Poppins-Medium'
        })
    },
    GenerateBtn : {
      alignSelf: 'center',
      position: 'absolute',
      borderWidth: 0.3,
      justifyContent: 'center',
      marginTop: 760,
      backgroundColor: 'rgb(0,0,0)',
      borderRadius: 20,
      width : width * 0.4,
      alignItems: 'center',
      height : 50,
      bottom: 10,
      zIndex: 2,
      shadowOffset: {height: 10, width: 10},
      shadowColor: '#000',
      shadowOpacity: 0.9,
      shadowRadius: 20,
      elevation: 12,
    },
})