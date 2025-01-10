import { View, Text, StyleSheet, Dimensions, Platform, TextInput, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useFonts, DMSerifText_400Regular } from '@expo-google-fonts/dm-serif-text';
import * as SplashScreen from 'expo-splash-screen';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import { client } from '@/lib/appwrite';
import { Account, Databases, Query, Storage } from 'react-native-appwrite';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';

const { height, width } = Dimensions.get('window');
SplashScreen.preventAutoHideAsync();

export default function Editprofile() {
  const account = new Account(client);
  const databases = new Databases(client);
  const storage = new Storage(client);

  const [name, setname] = useState('');
  const [bio, setbio] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [userData, setUserData] = useState({ email: '', name: '', avatar : '' });
  const [image, setimage] = useState('');

  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const data = await account.get();
      const av = await databases.listDocuments('677ad7c60012a997bf2c','677ad7d000244716f3a6', [
        Query.equal('email', data.email)
      ]);
      const avatardata = await databases.getDocument('677ad7c60012a997bf2c','677ad7d000244716f3a6', av.documents[0].$id)
      setUserData({
        name: data.name,
        email: data.email,
        avatar : avatardata.avatar
      });
    };
    getData();
  }, []);

  const [loaded, error] = useFonts({
    DMSerifText_400Regular
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
    router.push('/Profile');
  };




  const handlesave = async () => {
    try {
      const session = await account.get();
      const docId = await databases.listDocuments('677ad7c60012a997bf2c', '677ad7d000244716f3a6', [
        Query.equal('email', session.email)
      ]);
      

      if (name.length > 3) {
        await account.updateName(name);

        await databases.updateDocument('677ad7c60012a997bf2c', '677ad7d000244716f3a6', docId.documents[0].$id, {
          name: name,
        });
      }

      if (bio.length > 0) {
        await account.updatePrefs({ userbio: bio });
        await databases.updateDocument('677ad7c60012a997bf2c', '677ad7d000244716f3a6', docId.documents[0].$id, {
          bio: bio
        });
      }

      if (email.includes('@') && password.length >= 8) {
        await account.updateEmail(email, password);
        await databases.updateDocument('677ad7c60012a997bf2c', '677ad7d000244716f3a6', docId.documents[0].$id, {
          email: email
        });
      }

      Toast.show({
        type: 'success',
        text1: 'Successful',
        text2: 'Your data has been updated'
      });
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Failure',
        text2: 'Please ensure correct information is entered'
      });
    }
    router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleback}>
        <Ionicons style={styles.backbtn} name='chevron-back' size={32} />
      </TouchableOpacity>
      <Text style={styles.Edittxt}>Edit profile</Text>
      <Image style={styles.avatar} source={{ uri: `${userData.avatar}` }} />
      <Ionicons style={styles.cameraIcon} name='camera' size={32} />
      {image && <Image source={{ uri: image }} style={styles.Avatarimage} />}
      <View>
        <View style={styles.input}>
          <AntDesign name='user' size={32} />
          <TextInput
            value={name}
            onChangeText={setname}
            placeholder='Enter new name' />
        </View>
        <View style={styles.input}>
          <AntDesign name='message1' size={32} />
          <TextInput
            multiline
            value={bio}
            onChangeText={setbio}
            placeholder='Enter new Bio' />
        </View>
        <View style={styles.inputpref}>
          <Ionicons name='mail-outline' size={32} />
          <TextInput
            value={email}
            onChangeText={setemail}
            placeholder='Enter new email' />
        </View>
        <View style={styles.input}>
          <Ionicons name='key-outline' size={32} />
          <TextInput
            value={password}
            onChangeText={setpassword}
            placeholder='Enter your password' />
        </View>
      </View>
      <Text style={styles.note}>📩 : To update email, You must enter password</Text>
      <TouchableOpacity onPress={handlesave} style={styles.savebtn}>
        <Text style={styles.savetxt}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backbtn: {
    position: 'absolute',
    top: height * 0.02,
    left: width * 0.05,
    backgroundColor: 'rgba(184, 176, 176, 0.39)',
    borderRadius: 7,
  },
  Edittxt: {
    top: height * 0.01,
    left: width * 0.27,
    fontFamily: Platform.select({
      android: 'DMSerifText_400Regular',
      ios: 'DMSerifText-Regular'
    }),
    fontSize: 35,
  },
  nameHolder: {
    position: 'absolute',
    top: height * 0.1,
    left: width * 0.17,
    borderRadius: 10,
    borderColor: 'rgba(228, 223, 223, 0.9)',
    borderWidth: 4,
    width: width * 0.8
  },
  input: {
    flexDirection: 'row',
    height: height * 0.06,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 0.6,
    borderColor: 'rgba(124, 123, 123, 0.8)',
    borderRadius: 10,
    paddingHorizontal: 18,
    gap: 12,
    width: width * 0.9,
    marginLeft: 20,
    top: height * 0.1,
    marginTop: 20,
  },
  Avatarimage: {
    height: 100,
    width: 100,
  },
  inputpref: {
    flexDirection: 'row',
    height: height * 0.06,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderWidth: 0.6,
    borderColor: 'rgba(124, 123, 123, 0.8)',
    borderRadius: 10,
    paddingHorizontal: 18,
    gap: 12,
    width: width * 0.9,
    marginLeft: 20,
    top: height * 0.1,
    marginTop: 20,
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 80,
    top: height * 0.04,
    alignSelf: 'center',
    zIndex: 1,
    shadowColor: '#000',
    shadowRadius: 20,
    shadowOffset: { height: 10, width: 10 },
    elevation: 10,
  },
  cameraIcon: {
    position: 'absolute',
    top: height * 0.18,
    left: width * 0.56,
    zIndex: 2,
    backgroundColor: 'rgba(224, 221, 221, 0.35)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { height: 10, width: 10 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 8,
  },
  namelogo: {
    top: height * 0.11,
    left: width * 0.07,
  },
  bioHolder: {
    position: 'absolute',
    top: height * 0.2,
    left: width * 0.17,
    borderRadius: 10,
    borderColor: 'rgba(228, 223, 223, 0.9)',
    borderWidth: 4,
    width: width * 0.8
  },
  note: {
    position: 'absolute',
    top: height * 0.64,
    left: width * 0.08,
    fontFamily: Platform.select({
      android: 'Poppins_400Regular',
      ios: 'Poppins-Regular',

    }),

  },
  prefHolder: {
    position: 'absolute',
    top: height * 0.3,
    left: width * 0.17,
    borderRadius: 10,
    borderColor: 'rgba(228, 223, 223, 0.9)',
    borderWidth: 4,
    width: width * 0.8,
    height: height * 0.2,
  },
  biologo: {
    top: height * 0.17,
    left: width * 0.07,
  },
  preflogo: {
    top: height * 0.23,
    left: width * 0.07,
  },
  savebtn: {
    top: height * 0.2,
    left: width * 0.06,
    backgroundColor: 'rgba(157, 230, 157, 0.9)',
    borderRadius: 10,
    width: width * 0.9,
    height: height * 0.06,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowRadius: 20,
    shadowOffset: { height: 10, width: 10 },
    elevation: 10,
  },
  savetxt: {
    textAlign: 'center',
    color: 'rgba(37, 37, 37, 0.7)',
    fontWeight: '700',
    fontSize: 17,
  },
});