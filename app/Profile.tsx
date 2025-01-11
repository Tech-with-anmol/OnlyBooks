import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, DMSerifText_400Regular } from '@expo-google-fonts/dm-serif-text';
import Library from '@/component/library';
import Selfposts from '@/component/selfposts';
import { Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins';
import { client } from '@/lib/appwrite';
import { Account, Databases, Query, Storage } from 'react-native-appwrite';

const { height, width } = Dimensions.get('window');

export default function Profile() {


  const account = new Account(client);
  const database = new Databases(client);
  const storage = new Storage(client);

  const [activetab, setactivetab] = useState('Posts');
  const [userdata, setuserdata] = useState({ name: '', bio: '' , avatar : ''});
  const [Avatar, setAvatar] = useState('');
  const [userDataAccount, setUserDataAccount] = useState({email : '', name: ''});


  const router = useRouter();

  useEffect(() => {
    const data = async () => {
      try {
        const userData = await account.get();
        setUserDataAccount({
          email: userData.email,
          name: userData.email
        })
        const av = await database.listDocuments('677ad7c60012a997bf2c','677ad7d000244716f3a6', [
          Query.equal('email', userData.email)
        ]);
        const avatardata = await database.getDocument('677ad7c60012a997bf2c','677ad7d000244716f3a6', av.documents[0].$id)
        setuserdata({
          name: userData.name,
          bio: userData.prefs.userbio,
          avatar : avatardata.avatar
        });
      } catch (error) {
        console.log(error);
      }
    };
    data();
  }, []);
  
  const renderTab = () => {


    if (activetab === 'Posts') {
      return <Selfposts email={userDataAccount.email} />;
    }
    if (activetab === 'Library') {
      return (
        <View>
          <Library email={userDataAccount.email}/>
        </View>
      );
    }
  };

  const [loaded, error] = useFonts({
    DMSerifText_400Regular,
    Poppins_400Regular,
    Poppins_500Medium,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const handleback = (): void => {
    router.replace('/Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleback}>
          <Ionicons style={styles.backbtn} name="chevron-back" size={32} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/Settings')}>
          <Ionicons style={styles.settingbtn} name="cog-outline" size={32} />
        </TouchableOpacity>
        <Text style={styles.profiletxt}>Profile</Text>
      </View>

      <Ionicons onPress={() => router.replace('/Editprofile')} style={styles.editprofile} name="pencil" size={32} />

      <Image style={styles.avatar} source={{ uri: `${userdata.avatar}` }} />
      <View style={styles.namebio}>
        <Text style={styles.userName}>{userdata.name}</Text>
        <View style={styles.bio}>
          <Text style={styles.userBio}>{userdata.bio}</Text>
        </View>
      </View>
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
      <View style={{ marginTop: 230 }}>{renderTab()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  avatar: {
    height: height * 0.2,
    width: width * 0.4,
    borderRadius: 80,
    alignSelf: 'center',
    marginTop: height * 0.03,
    zIndex: 1,
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
  namebio: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  bio: {
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },
  editprofile: {
    position: 'absolute',
    marginLeft: width * 0.6,
    marginTop: height * 0.1,
    borderRadius: 7,
    backgroundColor: 'white',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 10,
  },
  userName: {
    fontSize: 17,
    fontFamily: Platform.select({
      android: 'Poppins_500Medium',
      ios: 'Poppins-Medium',
    }),
    position: 'absolute',
    top: height * 0.025,
  },
  userBio: {
    fontSize: 15,
    position: 'absolute',
    top: height * 0.06,
    fontFamily: Platform.select({
      android: 'Poppins_400Regular',
      ios: 'Poppins-Regular',
    }),
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
  postTab: {
    position: 'absolute',
    top: height * 0.2,
    left: width * 0.2,
  },
  ActivepostTab: {
    position: 'absolute',
    top: height * 0.2,
    left: width * 0.2,
    borderBottomWidth: 5,
  },
  libraryTab: {
    position: 'absolute',
    top: height * 0.2,
    left: width * 0.7,
  },
  ActivelibraryTab: {
    position: 'absolute',
    top: height * 0.2,
    left: width * 0.7,
    borderBottomWidth: 5,
  },
});