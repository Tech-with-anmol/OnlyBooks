import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { client } from '@/lib/appwrite';
import { Databases } from 'react-native-appwrite';

export default function Club() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const database = new Databases(client);
  const [clubData, setClubData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const club = await database.getDocument('677ad7c60012a997bf2c', '3', id);
        setClubData(club);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!clubData) {
    return (
      <View style={styles.errorContainer}>
        <Text>Club data not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.clubName}>{clubData.name}</Text>
      <Text style={styles.clubDescription}>{clubData.description}</Text>
      <Text style={styles.clubMembers}>Members: {clubData.members.length}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clubName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  clubDescription: {
    fontSize: 16,
    marginTop: 8,
  },
  clubMembers: {
    fontSize: 14,
    marginTop: 8,
    color: '#666',
  },
});