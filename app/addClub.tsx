import { View, Text, StyleSheet, Dimensions, Platform, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Poppins_500Medium, useFonts } from '@expo-google-fonts/poppins'
import * as SplashScreen from 'expo-splash-screen'
import { client } from '@/lib/appwrite'
import { Account, Databases} from 'react-native-appwrite'
import Toast from 'react-native-toast-message'
import { useRouter } from 'expo-router'



SplashScreen.preventAutoHideAsync();
const {height, width} = Dimensions.get('window');

export default function addClub() {
  

    const [clubName, setClubName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const account = new Account(client);
    const database = new Databases(client);

    const[loaded, error] = useFonts({
        Poppins_500Medium
    });

    
    useEffect(() => {
        if(loaded || error) {
            SplashScreen.hideAsync();
        }
    }, []);

    if(!loaded && ! error) {
        return null;
    }

    if(loading) {
        return <ActivityIndicator style={{
            alignSelf: 'center',
            marginTop: 400,
        }} size='large' color="#000"/>
    };

    const handleCreate = async() => {
        setLoading(true);
        const creator = await account.get();
        try{
            if(clubName && description) {
                await database.createDocument('677ad7c60012a997bf2c', '3', 'unique()', {
                    name : clubName,
                    description : description,
                    members : [creator.email],
                    creator : creator.email
                });
                router.replace('/bookclub')
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Wrong Info',
                    text2: 'Please enter details properly'
                })
            }
        }catch (error) {
            console.log(error)
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'There is some issue with server, please try again'
            })
        } finally {
            setLoading(false);
        }
    };


    return (
      <View style={styles.conatiner}>
        <Text style={styles.newClub}>New club</Text>
        <TouchableOpacity style={styles.clubNewName}>
            <TextInput
            placeholder='Enter Club name...'
            value={clubName}
            onChangeText={setClubName}
            style={{
                marginLeft: 10,
            }}
            />
        </TouchableOpacity>
        <TouchableOpacity style={styles.clubDescription}>
            <TextInput
            placeholder='Enter club description...'
            multiline
            value={description}
            onChangeText={setDescription}
            style={{
                marginLeft: 10,
            }}
            />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleCreate()} style={styles.createButton}>
            <Text style={styles.createText}>Create</Text>
        </TouchableOpacity>
      </View>
    )
}

const styles = StyleSheet.create({
    conatiner : {
        flex : 1
    },
    newClub : {
        fontSize: 18,
        fontFamily: Platform.select({
            android: 'Poppins_500Medium',
            ios: 'Poppins-Medium'
        }),
        textAlign : 'center',
        margin: 20,
    },
    clubNewName: {
        width: width * 0.8,
        alignSelf: 'center',
        borderWidth : 0.8,
        borderColor : '#000',
        borderRadius: 20,
        height: 40,
        marginTop: 100,   
    },
    clubDescription : {
        width: width * 0.8,
        alignSelf: 'center',
        borderWidth: 0.8,
        borderRadius: 20,
        height: 200,
        marginTop: 20,
    },
    createButton : {
        alignSelf: 'center',
        margin: 20,
        width : width * 0.3,
        height: 30,
        marginTop: 100,
        borderRadius: 20,
        borderWidth: 0.9,

    },
    createText : {
        alignSelf: 'center',
        justifyContent: 'center',
        marginLeft: 7,
        marginTop: 3,
    },
})