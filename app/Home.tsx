import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity, FlatList, Image, TextInput } from 'react-native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Poppins_600SemiBold, Poppins_500Medium, Poppins_300Light } from '@expo-google-fonts/poppins';
import Fetchposts from '@/component/fetch-posts';
import { client } from '@/lib/appwrite';
import { Databases } from 'react-native-appwrite';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { height, width } = Dimensions.get('window');

SplashScreen.preventAutoHideAsync();

export default function Home() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [comments, setComments] = useState([]);
  const [commentPost, setcommentPost] = useState('');
  const bottomSheetRef = useRef<BottomSheet>(null);


  const database = new Databases(client);

  const handleSheetChanges = useCallback((index: number) => {
    console.log(index);
  }, []);

  const [loaded, error] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_300Light,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    const loadPosts = async () => {
      const postData = await Fetchposts();
      setPosts(postData);
    };
    loadPosts();
  }, []);

  if (!loaded && !error) {
    return null;
  }

  const handleProfile = () => {
    router.push('/Profile');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleLike = async (postId, prevlikes) => {
    await database.updateDocument('677ad7c60012a997bf2c', '677d348300118c369c4c', postId, {
      likes: prevlikes + 1,
    });

    setLikedPosts((prevLikedPosts) => ({
      ...prevLikedPosts,
      [postId]: !prevLikedPosts[postId],
    }));
  };

  const handleComments = async (postId) => {
    const post = await database.getDocument('677ad7c60012a997bf2c', '677d348300118c369c4c', postId);
    setComments(post.comments || []);
    bottomSheetRef.current?.expand();
  };

  const renderPost = ({ item }) => {
    const isLiked = likedPosts[item.$id];

    return (
      <View style={styles.card}>
        <View style={styles.postHeader}>
          <Image style={styles.pfpHome} source={{ uri: `https://avatar.iran.liara.run/public` }} />
          <View style={styles.userInfo}>
            <Text style={styles.authorName}>{item.name}</Text>
            <Text style={styles.dateTime}>{formatDate(item.$createdAt)}</Text>
          </View>
        </View>
        <Text>{item.content}</Text>
        <View style={styles.bottomNav}>
          <TouchableOpacity onPress={() => handleLike(item.$id, item.likes)}>
            <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={30} color={isLiked ? 'red' : 'black'} />
          </TouchableOpacity>
          <Text style={styles.likes}>{item.likes}</Text>
          <TouchableOpacity onPress={() => handleComments(item.$id)}>
            <Ionicons style={styles.comment} name='chatbubble-outline' size={26} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentContainer}>
      <Text style={styles.commentText}>{item}</Text>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.logotxt}>OnlyBooks</Text>
      <TouchableOpacity style={styles.notification}>
        <Ionicons name='heart-outline' size={32} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/Post')} style={styles.posticon}>
        <Ionicons name='add-circle-outline' size={32} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.peopleicon} onPress={handleProfile}>
        <AntDesign name='user' size={32} />
      </TouchableOpacity>
      <View style={{ marginTop: 80 }}>
        <FlatList data={posts} keyExtractor={(item) => item.$id} renderItem={renderPost} />
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        snapPoints={['50%', '75%']}
        index={-1}
        style={styles.bottomSheet}
      >
        <BottomSheetView style={styles.bottomSheetView}>
          <Text style={{ textAlign: 'center', fontWeight: '500' }}>Comments</Text>
          <FlatList
            data={comments}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderComment}
          />
          <View style={styles.commentMessageBox}>
            <Image style={styles.AddCommentPfp} source={{ uri: `https://avatar.iran.liara.run/public` }} />
            <TextInput 
            value={commentPost}
            onChangeText={setcommentPost}
            style={styles.AddCommentInput} 
            placeholder="Add a comment..." />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logo: {
    flex: 1,
  },
  logotxt: {
    position: 'absolute',
    top: height * 0.01,
    left: width * 0.03,
    fontFamily: Platform.select({
      android: 'Poppins_600SemiBold',
      ios: 'Poppins-SemiBold',
    }),
    fontSize: 24,
  },
  notification: {
    position: 'absolute',
    top: height * 0.02,
    left: width * 0.68,
  },
  posticon: {
    position: 'absolute',
    top: height * 0.02,
    left: width * 0.78,
  },
  peopleicon: {
    position: 'absolute',
    top: height * 0.02,
    left: width * 0.88,
  },
  pfpHome: {
    height: 50,
    width: 50,
  },
  authorName: {
    justifyContent: 'center',
    fontFamily: Platform.select({
      android: 'Poppins_500Medium',
      ios: 'Poppins-Medium',
    }),
    fontSize: 18,
  },
  userInfo: {
    flexDirection: 'column',
    gap: -3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'flex-start',
    gap: 12,
  },
  card: {
    padding: 10,
    backgroundColor: 'rgba(248, 245, 245, 0.81)',
    borderRadius: 5,
    margin: 10,
  },
  dateTime: {
    fontFamily: Platform.select({
      android: 'Poppins_300Light',
      ios: 'Poppins-Light',
    }),
    marginTop: -5,
  },
  likes: {
    fontSize: 19,
    marginTop: 2,
    marginLeft: -15,
  },
  bottomNav: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'space-around',
    alignSelf: 'flex-start',
    padding: 10,
    marginLeft: -10,
  },
  comment: {
    marginTop: 1,
  },
  bottomSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
    borderColor: 'rgba(66, 66, 66, 0.51)',
    borderWidth: 0,
  },
  bottomSheetView: {
    flex: 1,
  },
  commentMessageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
  },
  AddCommentInput: {
    flex: 1,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  AddCommentPfp: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  commentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  commentText: {
    fontSize: 16,
  },
});