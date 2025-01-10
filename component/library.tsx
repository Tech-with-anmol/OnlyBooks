import { View, Text, StyleSheet, Dimensions, Image, FlatList, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { client } from '@/lib/appwrite';
import { Account, Databases, Query } from 'react-native-appwrite';
import axios from 'axios';
import { useFonts, Poppins_500Medium } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';

const { height, width } = Dimensions.get('window');
SplashScreen.preventAutoHideAsync();

export default function Library() {
  const account = new Account(client);
  const database = new Databases(client);

  const [bookCollection, setBookcollection] = useState<any[]>([]);
  const [bookinfo, setBookinfo] = useState<string[]>([]);

  useEffect(() => {
    const fetchLibrary = async () => {
      const userData = await account.get();
      const userBooks = await database.listDocuments('677ad7c60012a997bf2c', '677d348300118c369c4c', [
        Query.equal('email', userData.email),
        Query.isNotNull('Book')
      ]);

      let totalBooks = userBooks.total;
      const books = [];
      const bookInfoPromises = [];

      while (totalBooks > 0) {
        const book = userBooks.documents[totalBooks - 1].Book;
        books.push(book);
        bookInfoPromises.push(fetchBookinfo(book));
        totalBooks -= 1;
      }

      const bookInfos = await Promise.all(bookInfoPromises);
      setBookcollection(books);
      setBookinfo(bookInfos);
    };

    fetchLibrary();
  }, []);



  

  const fetchBookinfo = async (book) => {
    const data = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${book}`);
    return data.data.items[0].volumeInfo.imageLinks.thumbnail;
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.bookContainer}>
      {bookinfo[index] && (
        <Image style={styles.bookImage} source={{ uri: bookinfo[index] }} />
      )}
      <Text style={styles.bookTitle}>{item}</Text>
    </View>
  );

  return (
    <FlatList
      data={bookCollection}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      numColumns={2}
      contentContainerStyle={styles.listContainer}
    />
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
    shadowColor: '#000',
    shadowOffset: {height: 10, width: 10},
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 20,

  },
  bookImage: {
    height: 185,
    width: 150,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  bookTitle: {
    textAlign: 'center',
    fontFamily: Platform.select({
      android: 'Poppins_500Medium',
      ios: 'Poppins-Medium'
    })
  },
});