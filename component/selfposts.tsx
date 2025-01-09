import { View, Text, StyleSheet, Dimensions, FlatList, Image } from 'react-native';
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
      return posts.documents;
    } catch (error) {
      console.log(error);
    }
  };

  const renderPost = ({ item }) => {
    return (
      <Post item={item} />
    );
  };

  const fetchUserData = async (email) => {
    try {
      const userData = await database.listDocuments('677ad7c60012a997bf2c', '677ad7d000244716f3a6', [
        Query.equal('email', email)
      ]);
      return userData.documents[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const Post = ({ item }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
      const loadUserData = async () => {
        const userData = await fetchUserData(item.email);
        setUser(userData);
      };
      loadUserData();
    }, [item.email]);

    return (
      <View style={styles.postContainer}>
        {user && <Image source={{ uri: user.avatar }} style={styles.avatar} />}
        <Text style={styles.postText}>{item.content}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={renderPost}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  postContainer: {
    flex: 1,
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: 'rgb(252, 252, 252)',
    borderRadius: 5,
    margin: 10,
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { height: 10, width: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 4,
  },
  postText: {
    fontSize: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
});