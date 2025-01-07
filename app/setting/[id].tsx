import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, Platform, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';

const{height, width} = Dimensions.get('window');
SplashScreen.preventAutoHideAsync();

export default function SettingF() {

  const[Content, setContent] = useState('');

  const[loaded, error] = useFonts({
    Poppins_400Regular
  })

  const { id }  = useLocalSearchParams<{id: string}>();

  useEffect(() => {
    if(loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if(!loaded && !error) {
    return null;
  }
  
  const handleFeedback = () => {
    const email = 'mr.curious1st@gmail.com';
    const subject = 'Issue/Bug in the app';
    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(Content)}`;

    Linking.openURL(mailto);
  }
  
  const renderContent = () => {
    switch (id) {
        case '1':
            return(
                <View style={{padding: 20}}>
                  <Text>Hi! I am anmol, this project (OnlyBooks) was made for high-seas 
                    and is in development.
                  </Text>
                  <Text>It uses appwrite for handling backend.</Text>
                  <Text>Using appwrite for backend was not easy at all, because it creates 
                    lot of new challenges as you can neither make relation in database nor
                    it is possible to fetch other user auth profile using appwrite could, and so 
                    also due to small community and not fully developed, appwrite is really
                    some headache to work with, the only reason i choosed to work with appwrite
                    was because i have pro tier of it through github education plan, and i must say
                    i have implemented many new solutions throughout the project, it was very fun & delight
                    trying to push appwrite to max to make something which isn't natively supported.
                    i think, i should make a blog, writing about how to implement stuff which are not
                    supported by appwrte and how to make any app working purely using appwrite and not having 
                    to move to other database or any technology. It's always to so fun to encounter and implement solutions
                    for problem which might not be new, but either don't have solution or even in case, if it have,
                    it is just overkill and not feasible. Have a good day :).
                  </Text>
                  <Text>Missing styling was intentional xD</Text>
                  </View>
            );
        case '2':
          return(
            <View >
              <Text style={styles.feedbacktxt}>We appreciate Feedback!!</Text>
              <Text style={{
                padding: 20,
                top: height * 0.1,
                fontFamily: Platform.select({
                  android: 'Poppins_400Regular',
                  ios: 'Poppins-Regular'
                })
              }}>This is earliest version of app and so there might be bugs
                and issues, but I am working hard to fix any bug as soon i see,
                please report any bug you see immediatly to us, we would try our best
                to reach you & fix the bug asap. Afterall, it takes, a lot of feedback and
                refinfement to make something great. :).
              </Text>
              
              <TextInput 
              value={Content}
              onChangeText={setContent}
              multiline
              style={styles.feedbackform}/>
              <TouchableOpacity onPress={handleFeedback} style={styles.feedbacksumbit}>
                <Text style={styles.buttonText}>Sumbit</Text>
              </TouchableOpacity>
            </View>
          );

       default: 
         return(
          <View>
            <Text>wrong path bro!!</Text>
          </View>
         )
      }
  }
  return (
    <View>
      {renderContent()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  feedbacktxt: {
    position: 'absolute',
    top: height * 0.05,
    left: width * 0.27,
    fontFamily: Platform.select({
      android: 'Poppins_400Regular',
      ios: 'Poppins-Regular'
    })

  },
  feedbackform : {
    position: 'absolute',
    verticalAlign: 'top',
    top: height * 0.4,
    left: width *  0.1,
    height: height * 0.4,
    width: width * 0.8,
    borderColor: 'rgba(185, 209, 141, 0.8)',
    borderWidth: 3,
    borderRadius: 20,
  },
  feedbacksumbit : {
    position: 'absolute',
    top: height * 0.85,
    left: width * 0.1,
    backgroundColor: 'rgba(95, 241, 139, 0.56)',
    width: width * 0.8,
    height: height * 0.05,
    justifyContent: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {height: 10, width: 10},
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 15

  },
  buttonText: {
    marginLeft: 130,
    fontWeight: '600',
    fontSize: 17,
  },
  
})