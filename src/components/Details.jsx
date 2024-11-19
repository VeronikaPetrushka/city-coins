import React, { useRef, useState, useEffect } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Alert, ImageBackground } from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icons from "./Icons";

const { height } = Dimensions.get('window');

const Details = ({ place }) => {
    const navigation = useNavigation();

    const handleAlbumPress = async () => {
        try {
            const storedVisitedTrips = await AsyncStorage.getItem('visitedTrips');
            const visitedTripsArray = storedVisitedTrips ? JSON.parse(storedVisitedTrips) : [];
    
            const matchingTrip = visitedTripsArray.find(
                (trip) => trip.place && trip.place.name === place.name
            );
    
            if (matchingTrip) {
                navigation.navigate('AlbumScreen', {
                    name: place.name,
                    photos: matchingTrip.images || [],
                });
            } else {
                Alert.alert('No Album', `No album exists for ${place.name}.`);
            }
        } catch (error) {
            Alert.alert('Error', `Could not retrieve album: ${error.message}`);
        }
    };
    

    const handleBackPress = () => {
        navigation.navigate('HomeScreen');
    };
    
    return (
        // <ImageBackground source={require('../assets/newDiz/back.png')} style={{ flex: 1 }}>
        <View style={styles.container}>
            <TouchableOpacity style={styles.backIcon} onPress={handleBackPress}>
                <Icons type={'back'}/>
            </TouchableOpacity>
                <Image source={place.image} style={styles.image} />
            <View style={styles.btnContainer}>
                <TouchableOpacity  
                    style={[styles.checkBtn, {backgroundColor: '#0036b7'}]} 
                    onPress={handleAlbumPress}
                >
                    <Text style={styles.checkBtnText}>Album</Text>
                </TouchableOpacity>

                <TouchableOpacity  
                    style={[styles.checkBtn]} 
                    onPress={() => navigation.navigate('CheckInScreen', {place: place})}
                >
                    <Text style={styles.checkBtnText}>Check in</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.name}>{place.name}</Text>
                <ScrollView style={{width: '100%', height: height * 0.47}}>
                    <Text style={styles.description}>Address: {place.address}</Text>
                    <Text style={styles.description}>Admission: {place.admission}</Text>
                    <Text style={styles.description}>{place.history}</Text>
                    <Text style={styles.fact}>{place.touristInterest}</Text>
                    <View style={{height: 100}}/>
                </ScrollView>
            </View>
        </View>
        // </ImageBackground>
    );
};


const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        paddingTop: 0,
        paddingBottom: 30,
        backgroundColor: '#e3effa'
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
    image: {
        width: '100%',
        height: height * 0.33,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        marginBottom: 16,
    },
    btnContainer: {
        width: '100%',
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    checkBtn: {
        width: "48%",
        height: height * 0.08,
        borderRadius: 10,
        backgroundColor: '#3D85C6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkBtnText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: '900',
    },
    markerImage: {
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#0036b7'
    },
    textContainer: {
        paddingHorizontal: 16,
        width: '100%'
    },
    name: {
        fontSize: 20,
        fontWeight: '900',
        marginBottom: 15,
        color: '#0036b7',
        textAlign: 'center'
    },
    description: {
        fontSize: 17,
        marginBottom: 10,
        color: '#3D85C6',
        textAlign: 'justify'
    },
    fact: {
        fontSize: 15,
        color: '#3D85C6',
        textAlign: 'justify'
    },
    visitedIcon: {
        width: 30,
        height: 30,
        position: 'absolute',
        top: -5,
        right: -5,
        zIndex: 15,
    },
});

export default Details;
