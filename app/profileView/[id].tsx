import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { Account, Databases, Query } from 'react-native-appwrite';
import { client } from '@/lib/appwrite';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Selfposts from '@/component/selfposts';
import Library from '@/component/library';


const { height, width } = Dimensions.get('window');
SplashScreen.preventAutoHideAsync();

export default function ProfileView() {
  const account = new Account(client);
  const database = new Databases(client);
  const router = useRouter();

  const [activetab, setactivetab] = useState('Posts');
  const [userData, setUserData] = useState({ name: '', email: '', avatar: '', bio: '', followers: [], following: '' });
  const [isFollowing, setIsFollowing] = useState(false);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [totalFollowing, setTotalFollowing] = useState(0);


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
          following : detailsDoc.following
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
   
    fetchUserData();


  }, [id]);

  
  useEffect(() => {
    const checkIfFollowing = async () => {
      try {
        const followerDetails = await account.get();
        const userFile = await database.listDocuments('677ad7c60012a997bf2c', '677ad7d000244716f3a6', [
          Query.equal('email', followerDetails.email)
        ]);

        const currentFollowing = userFile.documents[0].following || [];
        setIsFollowing(currentFollowing.includes(userData.email));
        
      } catch (error) {
        console.log(error);
      }
    };

    if (userData.email) {
      checkIfFollowing();
    }
  }, [userData.email]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const renderTab = () => {
    if (activetab === 'Posts') {
      return <Selfposts email={userData.email} />;
    }
    if (activetab === 'Library') {
      return (
        <View>
          <Library email={userData.email}/>
        </View>
      );
    }
  };

  const handleFollow = async() => {
    try{
      const followerDetails = await account.get();
      const userFile = await database.listDocuments('677ad7c60012a997bf2c', '677ad7d000244716f3a6', [
        Query.equal('email', followerDetails.email)
      ]);
      const followedPerson = await database.listDocuments('677ad7c60012a997bf2c', '677ad7d000244716f3a6', [
        Query.equal('email', userData.email)
      ]);

      const currentFollowers = followedPerson.documents[0].followers || [];
      const currentFollowing = userFile.documents[0].following || [];

      if (isFollowing) {
      
        const updatedFollowers = currentFollowers.filter(email => email !== followerDetails.email);
        const updatedFollowing = currentFollowing.filter(email => email !== userData.email);

        await database.updateDocument('677ad7c60012a997bf2c', '677ad7d000244716f3a6', followedPerson.documents[0].$id, {
          followers: updatedFollowers
        });
        await database.updateDocument('677ad7c60012a997bf2c', '677ad7d000244716f3a6', userFile.documents[0].$id, {
          following: updatedFollowing
        });
        setIsFollowing(false); 
      } else {
        
        await database.updateDocument('677ad7c60012a997bf2c', '677ad7d000244716f3a6', followedPerson.documents[0].$id, {
          followers: [...currentFollowers, followerDetails.email]
        });
        await database.updateDocument('677ad7c60012a997bf2c', '677ad7d000244716f3a6', userFile.documents[0].$id, {
          following: [...currentFollowing, userData.email]
        });
        setIsFollowing(true);
      } 
     }  catch( error ) {
        console.log(error)
     }  
  };

  const handleback = () => {
    router.back();
  };

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
        <Image style={styles.avatar} source={{ uri: `${userData.avatar}` }} />
        <View style={styles.namebio}>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userBio}>{userData.bio}</Text>
        </View>
        <View style={styles.followSection}>
          <TouchableOpacity onPress={() => router.push(`/following/${userData.email}`)}>
            <Text style={styles.followNumber}>{userData.following.length}</Text>
            <Text style={styles.followText}>following</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push(`/followers/${userData.email}`)}>
            <Text style={styles.followNumber}>{userData.followers.length}</Text>
            <Text style={styles.followText}>followers</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleFollow} style={styles.followButton}>
          <Text style={styles.followButtonText}>{isFollowing ? 'Unfollow' : 'Follow'}</Text>
        </TouchableOpacity>
        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => setactivetab('Posts')}>
            <Ionicons
              style={activetab === 'Posts' ? styles.ActivepostTab : styles.postTab}
              name={activetab === 'Posts' ? 'grid' : 'grid-outline'}
              size={32}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setactivetab('Library')}>
            <Ionicons
              style={activetab === 'Library' ? styles.ActivelibraryTab : styles.libraryTab}
              name={activetab === 'Library' ? 'book' : 'book-outline'}
              size={32}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.tabContent}>{renderTab()}</View>
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
  avatar: {
    height: height * 0.2,
    width: width * 0.4,
    borderRadius: 80,
    alignSelf: 'center',
    marginTop: height * 0.03,
    zIndex: 1,
  },
  namebio: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  bio: {
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  userName: {
    fontSize: 17,
    fontFamily: Platform.select({
      android: 'Poppins_500Medium',
      ios: 'Poppins-Medium',
    }),
    marginTop: 10,
  },
  userBio: {
    fontSize: 15,
    marginTop: 10,
    fontFamily: Platform.select({
      android: 'Poppins_400Regular',
      ios: 'Poppins-Regular',
    }),
  },
  followNumber : {
    fontWeight: '600',
    fontSize: 20,
  },
  followText: {
    fontWeight: '500',
    fontSize: 16,
    marginLeft: -26,
  },
  followSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginLeft: 30,
  },
  followButton: {
    marginTop: 20,
    alignSelf: 'center',
    width: width * 0.8,
    height: 35,
    borderRadius: 20,
    borderWidth: 0.8,
    justifyContent: 'center',
  },
  followButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: Platform.select({
      android: 'Poppins_500Medium',
      ios: 'Poppins-Medium',
    }),
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  postTab: {
    borderBottomWidth: 0,
  },
  ActivepostTab: {
    borderBottomWidth: 2,
  },
  libraryTab: {
    borderBottomWidth: 0,
  },
  ActivelibraryTab: {
    borderBottomWidth: 2,
  },
  tabContent: {
    marginTop: 20,
  },
});