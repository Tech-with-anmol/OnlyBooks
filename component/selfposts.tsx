import { View, Text, StyleSheet, Dimensions, FlatList, Image, Platform } from 'react-native';
import React, { useEffect, useState } from 'react';
import { client } from '@/lib/appwrite';
import { Account, Databases, Query } from 'react-native-appwrite';
import { useFonts, Poppins_500Medium, Poppins_300Light } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import Ionicons from '@expo/vector-icons/Ionicons';

const { height, width } = Dimensions.get('window');
SplashScreen.preventAutoHideAsync();

export default function Selfposts({ email }) {
  const account = new Account(client);
  const database = new Databases(client);
  const [posts, setPosts] = useState([]);

  const [loaded, error] = useFonts({
    Poppins_500Medium,
    Poppins_300Light,
  });

  useEffect(() => {
    const loadPost = async () => {
      const postCollection = await fetchSelfPost();
     
      setPosts(postCollection);
    };
    loadPost();
  }, [email]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const fetchtimedate = (datetime) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(datetime).toLocaleDateString(undefined, options);
  };

  const fetchSelfPost = async () => {
    try {
      const posts = await database.listDocuments('677ad7c60012a997bf2c', '677d348300118c369c4c', [
        Query.equal('email', email),
      ]);
     
      return posts.documents;
    } catch (error) {
     
    }
  };

  const renderPost = ({ item }) => {
    return <Post item={item} />;
  };

  const fetchUserData = async (email) => {
    try {
      const userData = await database.listDocuments('677ad7c60012a997bf2c', '677ad7d000244716f3a6', [
        Query.equal('email', email),
      ]);
      return userData.documents[0];
    } catch (error) {
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
        <View style={styles.postHeader}>
          {user && <Image source={{ uri: user.avatar }} style={styles.userAvatar} />}
          <View style={styles.postDetails}>
            <Text
              style={{
                marginLeft: 5,
                fontFamily: Platform.select({
                  android: 'Poppins_500Medium',
                  ios: 'Poppins-Medium',
                }),
              }}
            >
              {item.name}
            </Text>
            <Text
              style={{
                fontFamily: Platform.select({
                  android: 'Poppins_300Light',
                  ios: 'Poppins-Light',
                }),
              }}
            >
              {fetchtimedate(item.$createdAt)}
            </Text>
          </View>
        </View>
        <Text></Text>
        <Text style={styles.postText}>{item.content}</Text>
        <Text></Text>
        <View style={styles.bottomNav}>
          <Ionicons style={{ marginTop: 7 }} name="heart-outline" size={32} />
          <Ionicons style={{ marginTop: 7 }} name="chatbubble-outline" size={26} />
          <Ionicons style={{ marginTop: 7 }} name="share-outline" size={26} />
          <Ionicons style={{ marginLeft: 190, marginTop: 7 }} name="bookmark-outline" size={26} />
        </View>
      </View>
    );
  };

  return (
    <View>
      <FlatList 
      data={posts} 
      keyExtractor={(item) => item.$id} 
      renderItem={renderPost}
      contentContainerStyle={{paddingBottom: 20}} />
    </View>
  );
}

const styles = StyleSheet.create({
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
  userAvatar: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  postHeader: {
    flexDirection: 'row',
    gap: 5,
  },
  postDetails: {},
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 15,
    borderTopWidth: 0.2,
  },
});