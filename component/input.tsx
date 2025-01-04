import { View, Text, StyleSheet, TextInput, Dimensions} from 'react-native'
import React from 'react'


const {height, width} = Dimensions.get('window');

const Input = (props : any) => {
    return(
        <View style={[styles.container, props.containerStyles && props.containerStyles]}>
            {
                props.icon && props.icon
            }
            <TextInput
        
            style={{flex:1}}
            placeholderTextColor='#rgba(34, 32, 32, 0.8)'
            ref={props.inputref && props.inputref}
            {...props}
            />
        </View>
    )
}

export default Input;

const styles = StyleSheet.create({
    container : {
        flexDirection: 'row',
        height: height * 0.2,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.4,
        borderColor: 'rgba(238, 231, 231, 0.8)',
        borderRadius: 10,
        paddingHorizontal: 18,
        gap: 12,
    },
})