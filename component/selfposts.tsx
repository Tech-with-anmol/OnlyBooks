import { View, Text, StyleSheet, Dimensions, FlatList, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { client } from '@/lib/appwrite';
import { Account, Databases, Query } from 'react-native-appwrite';


const { height, width } = Dimensions.get('window');

export default function Selfposts() {
  const account = new Account(client);
  const database = new Databases(client);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadPost = async () => {
      const postCollection = await fetchSelfPost();
      setPosts(postCollection);
    };
    loadPost();
  }, []);

  const fetchSelfPost = async () => {
    try {
      const holder = await account.get();
      const posts = await database.listDocuments('677ad7c60012a997bf2c', '677ad7d000244716f3a6', [
        Query.equal('email', holder.email),
      ]);
      const uniquePosts = Array.from(new Set(posts.documents.map(post => post.$id)))
      .map(id => posts.documents.find(post => post.$id === id));
      return uniquePosts;
    } catch (error) {
      console.log(error);
    }
  };

  const renderPost = ({ item }) => {
    return (
      <Post item={item} />
    );
  };

  const Post = ({ item }) => {
    return (
      <View style={styles.postContainer}>
        <Text style={styles.postText}>{item.content}</Text>
      </View>
    );
  };

  return (
    <View >
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={renderPost}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  postContainer : {
    flex : 1,
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'flex-start'

  },
  postText : {
    fontSize: 16,
  },
});