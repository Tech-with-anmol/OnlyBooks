import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { client } from '@/lib/appwrite';
import { Account, Databases, Query} from 'react-native-appwrite'



SplashScreen.preventAutoHideAsync();


export default function ai() {

  const database = new Databases(client);
  const account = new Account(client);


  const [booksCollection,setBookcollection] = useState<any>([]);
  const [userPrompt, setUserPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');


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
        setUserPrompt(`Suggest at least 10 books based on these: ${booksCollection.join(', ')}`)
    };
    fetchLibrary();
  });

    if(!error && !loaded) {
      return null;
    }

    const { OpenAI } = require("openai");

    const baseURL = process.env.EXPO_PUBLIC_API_URL;
    const apiKey = process.env.EXPO_PUBLIC_API_KEY;
    const systemPrompt = "You are a book suggestion giver based on user history. Be descriptive, funny and helpful";
    
    
    const api = new OpenAI({
      apiKey,
      baseURL,
    });
    
    const main = async () => {
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
        max_tokens: 256,
      });
    
      const response = completion.choices[0].message.content;

      setAiResponse(response)
      console.log("User:", userPrompt);
      console.log("AI:", response);
    };
    
  return (
    <View style={styles.container}>
     <TouchableOpacity onPress={() => main()}>
      <Text>Generate</Text>
     </TouchableOpacity>
      <Text style={styles.aiOutput}>{aiResponse}</Text>
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
        fontSize : 15,
        fontFamily: Platform.select({
            android: 'Poppins_ 400Medium',
            ios : 'Poppins-Medium'
        })
    }
})