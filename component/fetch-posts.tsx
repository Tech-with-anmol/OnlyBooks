import { View, Text } from 'react-native'
import React from 'react'
import { Databases, Query } from 'react-native-appwrite'
import { client } from '@/lib/appwrite'



const database = new Databases(client);
const Fetchposts = async() => {
  try {
      const posts = await database.listDocuments('677ad7c60012a997bf2c', '677d348300118c369c4c', [

          Query.limit(10)
      ]);
   return posts.documents;
  } catch (error) {
      console.log(error)
      return [];
  }
};

export default Fetchposts;