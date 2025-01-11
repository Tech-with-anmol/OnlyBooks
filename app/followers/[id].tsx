import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native';
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

  const renderFollower = ({ item }) => (
    <View style={styles.followerItem}>
      <Text style={styles.followerText}>{item}</Text>
    </View>
  );

  const renderContent = () => {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleback}>
            <Ionicons style={styles.backbtn} name="chevron-back" size={32} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/Settings')}>
            <Ionicons style={styles.settingbtn} name="chatbox-ellipses-outline" size={28} />
          </TouchableOpacity>
          <Text style={styles.profiletxt}>Profile</Text>
        </View>
        <FlatList
          data={userData.followers}
          renderItem={renderFollower}
          keyExtractor={(item, index) => index.toString()}
        />
      </ScrollView>
    );
  };

  return <View style={styles.container}>{renderContent()}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#fff',
    height: 60,
    borderColor: 'rgba(0,0,0,0.8)',
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
  settingbtn: {
    zIndex: 1,
  },
  followerItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  followerText: {
    fontSize: 16,
    fontFamily: Platform.select({
      android: 'Poppins_400Regular',
      ios: 'Poppins-Regular',
    }),
  },
});