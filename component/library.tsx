import { View, Text, StyleSheet, Dimensions, Image, FlatList, Platform, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { client } from '@/lib/appwrite';
import { Account, Databases, Query } from 'react-native-appwrite';
import axios from 'axios';
import { useFonts, Poppins_500Medium } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getDate } from 'date-fns';


const { height, width } = Dimensions.get('window');
SplashScreen.preventAutoHideAsync();

export default function Library({email}) {
  const account = new Account(client);
  const database = new Databases(client);

  const router = useRouter();

  const [bookCollection, setBookcollection] = useState<any[]>([]);
  const [bookinfo, setBookinfo] = useState<string[]>([]);


  const fetchBookinfo = async (book) => {
    try{
    const data = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${book}`);
    return data.data.items[0].volumeInfo.imageLinks.thumbnail;
    } catch( error) {

    }
  };


  const storedataLocally = async(Key , value) => {
    try {
      await AsyncStorage.setItem(Key, JSON.stringify(value));
    } catch (error) {
      console.log(error)
    }
  };

  const getCachedBooks = async(key) => {
    try{
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch(error) {
      console.log(error)
    }
  }
  useEffect(() => {
    const fetchLibrary = async () => {
      const userData = await account.get();
      const userBooks = await database.listDocuments('677ad7c60012a997bf2c', '677d348300118c369c4c', [
        Query.equal('email', email),
        Query.isNotNull('Book')
      ]);

      const books = userBooks.documents.map(doc => doc.Book);
      const cachedBookInfos = await getCachedBooks('bookInfos') || {};
      const bookInfos = [];


      for(const book of books) {
        if(cachedBookInfos[book]) {
          bookInfos.push(cachedBookInfos[book]);
        } else{
        const bookInfo = await fetchBookinfo(book);
        cachedBookInfos[book] = bookInfo
        bookInfos.push(bookInfo);
        }
      }

      await storedataLocally('bookInfos', cachedBookInfos);
      setBookcollection(books);
      setBookinfo(bookInfos);
    };

    fetchLibrary();
  }, []);

  

  const renderItem = ({ item, index }) => (
    <View style={styles.bookContainer}>
      {bookinfo[index] && (
        <Image style={styles.bookImage} source={{ uri: bookinfo[index] }} resizeMode="contain" />
      )}
      <Text style={styles.bookTitle}>{item}</Text>
    </View>
  );

  return (
    <View>
    <TouchableOpacity onPress={() => router.push('/library')} style={{
      left: 275,
      borderWidth: 0.6,
      borderColor: '#000',
      borderRadius: 20,
      width: 80,
      height: 30,
      justifyContent: 'center',

    }}>
      <Text style={{
        marginLeft: 6,
      }}>View All -></Text>
    </TouchableOpacity>
    <FlatList
      data={bookCollection}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      numColumns={2}
      contentContainerStyle={styles.listContainer}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
  },
  bookContainer: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
    
  },
  bookImage: {
    height: 185,
    width: 130,
    marginBottom: 10,
    resizeMode: 'contain',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { height: 10, width: 10 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 20,
  },
  bookTitle: {
    textAlign: 'center',
    fontFamily: Platform.select({
      android: 'Poppins_500Medium',
      ios: 'Poppins-Medium'
    })
  },
});