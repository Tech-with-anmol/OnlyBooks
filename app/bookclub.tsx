import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { client } from '@/lib/appwrite';
import { Account, Databases } from 'react-native-appwrite';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';

export default function Bookclub() {
  const database = new Databases(client);
  const account = new Account(client);
  const router = useRouter();

  const [clubData, setClubData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      const clubs = await database.listDocuments('677ad7c60012a997bf2c', '3');
      setClubData(clubs.documents);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchClubs();
    setRefreshing(false);
  };

  const filteredClubs = clubData.filter((club) =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => {
    return (
      <View style={styles.clubItem}>
        <TouchableOpacity style={{
          zIndex: 3,
        }} onPress={() => router.push(`clubs/${item.$id}`)}>
        <Text style={styles.clubName}>{item.name}</Text>
        <Text style={styles.clubDescription}>{item.description}</Text>
        <Text style={styles.clubMembers}>Members: {item.members.length}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/addClub')} style={styles.addButton}>
        <Ionicons name="add-circle" size={35} />
      </TouchableOpacity>
      <TextInput
        style={styles.searchInput}
        placeholder="Search clubs..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredClubs}
        renderItem={renderItem}
        keyExtractor={(item) => item.$id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  addButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  clubItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  clubName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clubDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  clubMembers: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});