import { StyleSheet, Text, View, Image, } from 'react-native'
import React from 'react'

const Icon = (props) => {
    return (
        <View style={{}}>
                <Image source={props.src} style={{...styles.icon, ...props.style}} />

        </View>
    )
}

export default Icon

const styles = StyleSheet.create({
    icon:{
        width:100,
        height:100
    }
})