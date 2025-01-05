import { Text, View, StyleSheet, Dimensions, SafeAreaView, Platform } from "react-native";
import Onboarding from 'react-native-onboarding-swiper'
import LottieView from "lottie-react-native";
import { Stack } from "expo-router";
import { useFonts, Poppins_500Medium,Poppins_400Regular } from "@expo-google-fonts/poppins";
import { useEffect } from "react";
import * as SplashsScreen from 'expo-splash-screen'
import { useRouter } from "expo-router";

const {height, width} = Dimensions.get('window');

SplashsScreen.preventAutoHideAsync();

export default function Index() {
  
  const router = useRouter();

  const [loaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
  });

  useEffect(() => {
    if(loaded || error) {
      SplashsScreen.hideAsync();
    }
  }, [loaded, error]);
  
  if(!loaded && !error) {
    return null;
  }

  const handleDone: () => void = () => {
    router.replace('/sign_in')
  }

  return (
    
    <View style={styles.container}>
      <Stack.Screen options={{headerShown: false}}/>
      <Onboarding
      
       onDone={handleDone}
       onSkip={handleDone}

       titleStyles={{
        fontFamily: Platform.select({
          android: 'Poppins_500Medium',
          ios: 'Poppins-Medium'
        })
       }}
       subTitleStyles={{
        textAlign: 'center',
        padding: 10,
        fontFamily: Platform.select({
          android: 'Poppins_500Medium',
          ios: 'Poppins-Medium'
        })
       }}
       containerStyles={{paddingHorizontal: 20}}
       pages={[
        {
          backgroundColor: 'rgba(221, 214, 111, 0.8)',
          image: (
            <View>
              <LottieView
               autoPlay
               loop
               style={{
                 height: height*0.5,
                 width: width
                 
               }}
               source={require('../assets/animations/anione.json')} />
            </View>
          ),
          title: 'OnlyBooks',
          subtitle: 'A place to discuss books, quotes,  education & research',
        },
        {
          backgroundColor: 'rgba(185, 226, 131, 0.9)',
          image: (
            <View >
               <LottieView 
               style={{
                height: height*0.5,
                width: width
              }}
               source={require('../assets/animations/discover.json')} autoPlay loop/>
            </View>
          ),
          title: 'Discover',
          subtitle: 'Discover awesome quotes, book content, reviews & a whole lot more',
        },
        {
          backgroundColor: 'rgba(238, 199, 155, 0.8)',
          image: (
            <View >
               <LottieView 
               style={{
                height: height*0.5,
                width: width * 0.9
              }}
               source={require('../assets/animations/library.json')} autoPlay loop/>
            </View>
          ),
          title: 'Library',
          subtitle: 'Get collection & AI suggestions',
        },
       ]}
      />
    </View>
    
  );
}

const styles = StyleSheet.create({
  container : {
    flex: 1
  },
  
})