import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity, Image, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { Account, Databases, Query } from 'react-native-appwrite';
import { client } from '@/lib/appwrite';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const { height, width } = Dimensions.get('window');
SplashScreen.preventAutoHideAsync();

export default function Followers() {
  const account = new Account(client);
  const database = new Databases(client);
  const router = useRouter();

  const [userData, setUserData] = useState({ name: '', email: '', avatar: '', bio: '', followers: [] });
  const [followersDetails, setFollowersDetails] = useState<any[]>([]);

  const [loaded, error] = useFonts({
    Poppins_400Regular,
  });

  const { id } = useLocalSearchParams<{ id: string }>();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const details = await database.listDocuments('677ad7c60012a997bf2c', '677ad7d000244716f3a6', [
          Query.equal('email', id),
        ]);
        const detailsDoc = await database.getDocument('677ad7c60012a997bf2c', '677ad7d000244716f3a6', details.documents[0].$id);
        setUserData({
          name: detailsDoc.name,
          email: detailsDoc.email,
          avatar: detailsDoc.avatar,
          bio: detailsDoc.bio,
          followers: detailsDoc.followers,
        });

        const followersDetailsPromises = detailsDoc.followers.map(async (email) => {
          const userDetails = await database.listDocuments('677ad7c60012a997bf2c', '677ad7d000244716f3a6', [
            Query.equal('email', email)
          ]);
          return userDetails.documents[0];
        });

        const followersDetails = await Promise.all(followersDetailsPromises);
        setFollowersDetails(followersDetails);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [id]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const handleback = () => {
    router.back();
  };

  const renderFollower = ({ item }) => {
    if (!item || !item.avatar || !item.name) {
      return null;
    }

    return (
      <View style={styles.followerItem}>
        <TouchableOpacity onPress={() => router.push(`/profileView/${item.email}`)}>
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <Image style={styles.avatar} source={{ uri: `${item.avatar}` }} />
            <Text style={styles.followerText}>{item.name}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleback}>
            <Ionicons style={styles.backbtn} name="chevron-back" size={32} />
          </TouchableOpacity>
          <Text style={styles.profiletxt}>Profile</Text>
        </View>
        <FlatList
          data={followersDetails}
          renderItem={renderFollower}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  };

  return <View style={styles.container}>{renderContent()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(241, 235, 220, 0.9)',
  },
  header: {
    backgroundColor: 'rgba(253, 249, 241, 0.9)',
    height: 60,
    borderColor: 'rgba(0, 0, 0, 0.8)',
    borderBottomWidth: 0.4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  backbtn: {
    position: 'absolute',
    backgroundColor: 'rgba(184, 176, 176, 0.39)',
    borderRadius: 7,
    zIndex: 0,
  },
  avatar: {
    height: 50,
    width: 50,
    borderRadius: 20,
  },
  profiletxt: {
    position: 'absolute',
    top: height * 0.02,
    left: width * 0.13,
    fontSize: 23,
    fontFamily: Platform.select({
      android: 'DMSerifText_400Regular',
      ios: 'DMSerifText-Regular',
    }),
  },
  followerItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  followerText: {
    fontSize: 18,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: Platform.select({
      android: 'Poppins_400Regular',
      ios: 'Poppins-Regular',
    }),
  },
});