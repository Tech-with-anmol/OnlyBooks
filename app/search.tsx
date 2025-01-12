import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Databases, Query } from 'react-native-appwrite';
import { client } from '@/lib/appwrite';
import { useRouter } from 'expo-router';

const database = new Databases(client);

export default function Search() {

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>([]);

  const router = useRouter();

  useEffect(() => {
    if (query.length > 0) {
      const fetchUsers = async () => {
        try {
          const users = await database.listDocuments('677ad7c60012a997bf2c', '677ad7d000244716f3a6', [
            Query.search('name', query)
          ]);
          setResults(users.documents);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };

      fetchUsers();
    } else {
      setResults([]);
    }
  }, [query]);

  const renderUser = ({ item  }) => (
    <View style={styles.userItem}>
     <TouchableOpacity onPress={() => router.push(`/profileView/${item.email}`)}>
      <Image style={styles.avatar} source={{ uri: item.avatar }} />
      <Text style={styles.userName}>{item.name}</Text>
     </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
    
      <TextInput
        style={styles.searchInput}
        placeholder="Search users..."
        value={query}
        onChangeText={setQuery}
      />
      <FlatList
        data={results}
        renderItem={renderUser}
        keyExtractor={(item) => item.$id}
        ItemSeparatorComponent={null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(238, 219, 195, 0.8)'
  },
  searchInput: {
    height: 40,
    borderColor: 'rgba(0,0,0,0.9)',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingBottom: 20,
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  userName: {
    fontSize: 16,
    marginLeft: 50,
    marginTop : -30,
  },
});