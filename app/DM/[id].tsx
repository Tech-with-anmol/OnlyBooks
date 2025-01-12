import { View, Text, StyleSheet, Image, ActivityIndicator, SafeAreaView, TextInput, Dimensions, TouchableOpacity, Platform, KeyboardAvoidingView, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { client } from '@/lib/appwrite';
import { Account, Databases, Query } from 'react-native-appwrite';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const { height, width } = Dimensions.get('window');

export default function DM() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const router = useRouter();

  const account = new Account(client);
  const database = new Databases(client);

  const [message, setMessage] = useState('');
  const [recieverData, setRecieverData] = useState<any>(null);
  const [senderData, setSenderData] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchReceiver = async () => {
      const sender = await account.get();
      const senderDoc = await database.listDocuments('677ad7c60012a997bf2c', '677ad7d000244716f3a6', [
        Query.equal('email', sender.email)
      ]);
      setSenderData(senderDoc.documents[0]);
      const reciever = await database.listDocuments('677ad7c60012a997bf2c', '677ad7d000244716f3a6', [
        Query.equal('email', id),
      ]);
      setRecieverData(reciever.documents[0]);

      const messages = await database.listDocuments('677ad7c60012a997bf2c', '1', [
        Query.or(
          Query.and([Query.equal('sender', sender.email), Query.equal('reciever', id)]),
          Query.and([Query.equal('sender', id), Query.equal('reciever', sender.email)])
        ),
        Query.orderDesc('$createdAt')
      ]);
      setMessages(messages.documents);
    };
    fetchReceiver();
  }, [id]);

  if (!recieverData) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="rgba(218, 207, 149, 0.9)" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  const handleSendMessage = async () => {
    try {
      const newMessage = {
        sender: senderData.email,
        reciever: recieverData.email,
        message: message, 
      };
      await database.createDocument('677ad7c60012a997bf2c', '1', 'unique()', newMessage);
      setMessages([newMessage, ...messages]);
      setMessage('');
    } catch (error) {
      console.info(error);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={item.sender === senderData.email ? styles.sentMessage : styles.receivedMessage}>
      <Text style={styles.messageText}>{item.message}</Text>
    </View>
  );

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.headerDM}>
          <Ionicons
            style={{
              backgroundColor: 'rgba(209, 206, 206, 0.73)',
              borderRadius: 5,
              padding: 2,
            }}
            onPress={() => router.back()}
            name="chevron-back"
            size={30}
          />
          <Image style={styles.avatarReciever} source={{ uri: `${recieverData.avatar}` }} />
          <Text style={styles.nameReciever}>{recieverData.name}</Text>
          <Ionicons
            style={{
              justifyContent: 'flex-end',
              marginLeft: 200,
            }}
            name="call-outline"
            size={30}
          />
        </View>
        <View>
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.$id}
          inverted
        />
        </View>
        <View style={styles.messageView}>
          <Image style={styles.messageAvatar} source={{ uri: `${senderData.avatar}` }} />
          <TextInput
            placeholder="Enter your message..."
            value={message}
            style={styles.messageInput}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity onPress={handleSendMessage}>
            <Ionicons style={{ marginTop: 5 }} name="send-outline" size={30} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(243, 225, 186, 0.9)',
  },
  headerDM: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 0.2,
    backgroundColor: 'rgba(252, 243, 229, 0.9)',
  },
  avatarReciever: {
    height: 45,
    width: 45,
    borderRadius: 40,
    resizeMode: 'contain',
    marginRight: 10,
    marginLeft: 10,
  },
  nameReciever: {
    fontWeight: '500',
    fontSize: 17,
    justifyContent: 'center',
  },
  messageView: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    position: 'absolute',
    bottom: 35,
    left: 0,
    right: 0,
  },
  messageInput: {
    flex: 1,
    padding: 8,
  },
  messageAvatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginLeft: 5,
    resizeMode: 'contain',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    maxWidth: '80%',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
  },
});