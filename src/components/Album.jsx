import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icons from './Icons';

const { width, height } = Dimensions.get('window');

const AlbumScreen = ({ name, photos  }) => {
    const navigation = useNavigation();

    const handleBackPress = () => {
        navigation.navigate('HomeScreen');
    };

    return (
        <ImageBackground source={require('../assets/newDiz/back.png')} style={{ flex: 1 }}>
        <View style={styles.container}>
            <TouchableOpacity style={styles.backIcon} onPress={handleBackPress}>
                <Icons type={'back'}/>
            </TouchableOpacity>
            <Text style={styles.title}>{name}</Text>
            <ScrollView contentContainerStyle={styles.photosContainer}>
                {photos.length > 0 ? (
                    photos.map((uri, index) => (
                        <Image key={index} source={{ uri }} style={styles.photo} />
                    ))
                ) : (
                    <Text style={styles.noPhotosText}>No photos available for this trip, check in first, and come back !</Text>
                )}
            </ScrollView>
        </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: height * 0.07,
    },
    backIcon: {
        width: 60,
        height: 60,
        padding: 10,
        position: 'absolute',
        top: height * 0.04,
        left: 10,
        zIndex: 10
    },
    title: {
        fontSize: 26,
        fontWeight: '900',
        marginBottom: 30,
        color: '#7fae6e',
        width: width * 0.8,
        textAlign: 'center',
        alignSelf: 'center',
        flexWrap: 'wrap'
    },
    photosContainer: {
        width: '100%'
    },
    photo: {
        width: '100%',
        height: height * 0.35,
        marginBottom: 10,
        borderRadius: 12,
    },
    noPhotosText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default AlbumScreen;
