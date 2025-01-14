import { Alert, Button, View, StyleSheet, TextInput, TouchableOpacity, Dimensions, Text, Platform, Image, ScrollView, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import Editor from '@/component/dom-components/hello-dom';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts, DMSerifText_400Regular } from '@expo-google-fonts/dm-serif-text';
import * as SplashScreen from 'expo-splash-screen';
import DropDownPicker from 'react-native-dropdown-picker';
import { router } from 'expo-router';
import { client } from '@/lib/appwrite';
import { Account, Databases, Query , Storage} from 'react-native-appwrite';
import { Poppins_300Light, Poppins_400Regular, Poppins_500Medium } from '@expo-google-fonts/poppins';
import * as ImagePicker from 'expo-image-picker';

const IS_DOM = typeof Editor !== "undefined";
const { height, width } = Dimensions.get('window');

SplashScreen.preventAutoHideAsync();

export default function Post() {

  const [userData, setUserData] = useState({ email: '', name: '' });
  const [loading, setLoading] = useState(false)

  const account = new Account(client);
  const database = new Databases(client);
  const storage = new Storage(client);

  useEffect(() => {
    const getData = async () => {
      const data = await account.get();
      setUserData({
        name: data.name,
        email: data.email
      });
    };
    getData();

    
    Alert.alert(
      "Rules",
      "1. Enter Book/Topic to ensure best reach & to auto-save book to your library\n" +
      "2. No content outside of Book/Education & Research\n" +
      "3. Be polite & No nsfw content (if you do so, you will be immediately banned)"
    );
  }, []);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Book', value: 'book', icon: () => <Ionicons name='book' size={20} /> },
    { label: 'Quote', value: 'quote', icon: () => <Ionicons name='text' size={20} /> },
    { label: 'Research', value: 'research', icon: () => <Ionicons name='telescope' size={20} /> },
    { label: 'Education', value: 'education', icon: () => <Ionicons name='bulb' size={20} /> }
  ]);

  const [editorState, setEditorState] = useState<string | null>(null);
  const [plainText, setPlainText] = useState("");
  const [ImagemetaData, setImagemetaData] = useState<ImagePicker.ImagePickerResult | null>(null);
  const [bookName, setBookName] = useState('');
  const [postimage, setImage] = useState<string | null>(null);
  const wordCount = editorState?.split(" ").length ?? 0;

  const [loaded, error] = useFonts({
    DMSerifText_400Regular,
    Poppins_400Regular,
    Poppins_500Medium
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  if(loading) {
    <ActivityIndicator style={{
      alignSelf: 'center',
      justifyContent: 'center',
      marginTop: 400,
    }} size='large' color='#000'/>
  }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImagemetaData(result);
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    setLoading(true);
    try {
      const userAv = await database.listDocuments('677ad7c60012a997bf2c', '677ad7d000244716f3a6', [
        Query.equal('email', userData.email)
      ]);
 
      let posterId = null;

      if (postimage) {
        const poster = await storage.createFile('1230', 'unique()', {
          name: userData.name,
          type: ImagemetaData?.assets[0].mimeType, 
          size: ImagemetaData?.assets[0].fileSize, 
          uri: postimage
        });
        posterId = poster.$id
      }

      const newpost = await database.createDocument('677ad7c60012a997bf2c', '677d348300118c369c4c', 'unique()', {
        name: userData.name,
        email: userData.email,
        content: plainText,
        images : posterId,
        Book : bookName
      });
      
      await database.createDocument('677ad7c60012a997bf2c', '69', newpost.$id, {
        name: userData.email,
        avatar: userAv.documents[0].avatar
      });

    
      router.replace('/Home');
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backbtn}>
            <Ionicons name='chevron-back' size={32} />
          </TouchableOpacity>
          <Text style={styles.headerTxt}>Post</Text>
          <TouchableOpacity onPress={handlePost}>
            <Ionicons name='paper-plane-outline' size={32} />
          </TouchableOpacity>
        </View>
        <Text></Text>

        <DropDownPicker
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownlist}
          placeholder='Select a category please..'
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
        />
        <View style={{
          borderWidth: 0.9,
          borderColor: '#000',
          width: width * 0.9,
          alignSelf: 'center',
          marginTop: 15,
          borderRadius: 20,
        }}>
          <TextInput 
          value={bookName}
          onChangeText={setBookName}
          style={{ marginLeft: 10, }} placeholder='Enter Book/Topic name..' />
        </View>
        <Text></Text>
        <TouchableOpacity onPress={pickImage}>
          <View style={{
            alignSelf: 'center',
            borderWidth: 0.6,
            borderRadius: 20,
            width: width * 0.3,
            height: 30
          }}>
            <Text style={{
              marginLeft: 13,
              marginTop: 2,
            }}>Add an Image..</Text>
          </View>
        </TouchableOpacity>
        {postimage && <Image source={{ uri: postimage }} style={styles.image} />}
        <Editor setPlainText={setPlainText} setEditorState={setEditorState} />
       
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 0.3,
  },
  backbtn: {
    backgroundColor: 'rgba(122, 118, 118, 0.22)',
    borderRadius: 5,
  },
  headerTxt: {
    position: 'absolute',
    left: width * 0.45,
    top: height * 0.01,
    fontFamily: Platform.select({
      android: 'DMSerifText_400Regular',
      ios: 'DMSerifText-Regular'
    }),
    fontSize: 27,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 10,
  },
  dropdown: {
    borderRadius: 20,
    width: width * 0.9,
    alignSelf: 'center',
  },
  dropdownlist: {
    width: width * 0.9,
    alignSelf: 'center',
  },
});