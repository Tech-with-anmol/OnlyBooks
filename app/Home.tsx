import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity, FlatList, Image, TextInput, Share } from 'react-native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Poppins_600SemiBold, Poppins_500Medium, Poppins_300Light } from '@expo-google-fonts/poppins';
import Fetchposts from '@/component/fetch-posts';
import { client } from '@/lib/appwrite';
import { Account, Databases, Query } from 'react-native-appwrite';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { formatDistanceToNow } from 'date-fns'




const { height, width } = Dimensions.get('window');

SplashScreen.preventAutoHideAsync();


export default function Home() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [comments, setComments] = useState([]);
  const [commentPost, setcommentPost] = useState('');
  const [currentPostId, setCurrentPostId] = useState(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const database = new Databases(client);
  const account = new Account(client);

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

  const formattime = (datetime) => {
    
    const date = new Date(datetime);
    
    return formatDistanceToNow(date, {addSuffix: true})
  };

  const handleLike = async (postId, prevlikes) => {

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.$id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );

    await database.updateDocument('677ad7c60012a997bf2c', '677d348300118c369c4c', postId, {
      likes: prevlikes + 1,
    });
  
    setLikedPosts((prevLikedPosts) => ({
      ...prevLikedPosts,
      [postId]: !prevLikedPosts[postId],
    }));
  };


  
  const handleComments = async (postId) => {
    try {
      const commentsData = await database.listDocuments('677ad7c60012a997bf2c', '69', [
        Query.equal('postId', postId),
        Query.orderDesc('$createdAt')
      ]);
      const comments = commentsData.documents.map(doc => ({
        name: doc.name,
        comment: doc.comment,
        avatar : doc.avatar,
        $createdAt : doc.$createdAt
      }));
      setComments(comments);
      setCurrentPostId(postId);
      bottomSheetRef.current?.expand();
    } catch (error) {
      console.log(error);
    }
  };

  const renderPost = ({ item }) => (
    <Post
      item={item}
      likedPosts={likedPosts}
      handleLike={handleLike}
      handleComments={handleComments}
    />
  );

  const renderComment = ({ item }) => (
    <View style={styles.commentContainer}>
      <View style={styles.commentBoxHeader} >
      <Image style={{height: 30, width: 30, borderRadius: 10,}} source={{ uri: `${item.avatar}` }}/>
      <View style={styles.headerDetails}>
        <Text style={{fontWeight: '500'}}>{item.name}</Text>
        <Text></Text>
        <Text>{formattime(item.$createdAt)}</Text>
      </View>
      </View>
      <Text style={styles.commentBoxContent}>{item.comment}</Text>
    </View>
  );

  const sendComments = async () => {
    if (!currentPostId) return;

    try {
      const datas = await account.get();
      const avatarFinder = await database.listDocuments('677ad7c60012a997bf2c', '677ad7d000244716f3a6', [
        Query.equal('email', datas.email)
      ])
      const newComment = {
        postId: currentPostId,
        comment: commentPost,
        name: datas.name,
        avatar: avatarFinder.documents[0].avatar
      };

      await database.createDocument('677ad7c60012a997bf2c', '69', 'unique()', newComment);

      setComments((prevComments) => [newComment, ...prevComments]);
      setcommentPost('');
    } catch (error) {
      console.log(error);
    }
  };

  const sharePost = async(Content) => {
    await Share.share({
      message: Content
    })
  }

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
  
  const Post = ({ item, likedPosts, handleLike, handleComments }) => {
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      const loadUserData = async () => {
        const userData = await fetchUserData(item.email);
        setUser(userData);
      };
      loadUserData();
    }, [item.email]);
  
    const isLiked = likedPosts[item.$id];
  
    return (
      <View style={styles.card}>
        <View style={styles.postHeader}>
          {user && (
            <Image style={styles.pfpHome} source={{ uri: user.avatar }} />
          )}
          <View style={styles.userInfo}>
            <Text style={styles.authorName}>{item.name}</Text>
            <Text style={styles.dateTime}>{formatDate(item.$createdAt)}</Text>
          </View>
        </View>
        <Text></Text>
        <Text>{item.content}</Text>
        <Text></Text>
        <View style={styles.bottomNav}>
          <TouchableOpacity onPress={() => handleLike(item.$id, item.likes)}>
            <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={30} color={isLiked ? 'red' : 'black'} />
          </TouchableOpacity>
          <Text style={styles.likes}>{item.likes}</Text>
          <TouchableOpacity onPress={() => handleComments(item.$id)}>
            <Ionicons style={styles.comment} name='chatbubble-outline' size={26} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => sharePost(item.content)}>
            <Ionicons style={{marginTop: 2}} name='share-outline' size={26}/>
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons style={{marginLeft: 165, marginTop: 5,}} name='bookmark-outline' size={26}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
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
      <View style={{ marginTop: 50 }}>
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
            contentContainerStyle={styles.commentsList}
          />
          <View style={styles.commentMessageBox}>
            <Image style={styles.AddCommentPfp} source={{ uri: `https://avatar.iran.liara.run/public` }} />
            <View style={styles.sendButonsView}>
              <TextInput 
                value={commentPost}
                onChangeText={setcommentPost}
                style={styles.AddCommentInput} 
                placeholder="Add a comment..." 
              />
              <TouchableOpacity onPress={sendComments} style={styles.sendButton}>
          
                <Ionicons style={{marginLeft: 10, marginTop: 4}} name='arrow-up' size={30}/>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(242, 242, 242, 0.9)',
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
    borderRadius: 50,
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
    backgroundColor: 'rgb(252, 252, 252)',
    borderRadius: 5,
    margin: 10,
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: {height: 10, width: 10},
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 4,
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
    alignItems: 'flex-start',
    padding: 10,
    marginLeft: -10,
    borderTopWidth: 0.2,
    
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
  sendButton : {
    borderRadius: 20,
    backgroundColor: 'rgba(113, 228, 89, 0.9)',
    width: 50,
  },
  headerDetails : {
    flexDirection: 'row',
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
    width: '100%',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
  },
  AddCommentInput: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
  },
  commentBoxHeader: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
  },
  commentBoxContent : {
    marginLeft: 40,
    marginTop: -5,
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
  commentAuthor: {
    fontWeight: 'bold',
  },
  commentText: {
    fontSize: 16,
  },
  sendButonsView: {
    flex: 1,
    flexDirection: 'row',
  },
  commentsList: {
    paddingBottom: 60, 
  },
});