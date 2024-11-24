import React, { useState, useEffect } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Alert, ImageBackground } from "react-native";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icons from "./Icons";

const { height } = Dimensions.get('window');

const Details = ({ place }) => {
    const navigation = useNavigation();
    const [isVisited, setIsVisited] = useState(false);

    useEffect(() => {
        const checkVisitedStatus = async () => {
            try {
                const storedVisitedTrips = await AsyncStorage.getItem('visitedTrips');
                const visitedTripsArray = storedVisitedTrips ? JSON.parse(storedVisitedTrips) : [];
                const visited = visitedTripsArray.some((trip) => trip.place && trip.place.name === place.name);
                setIsVisited(visited);
            } catch (error) {
                Alert.alert('Error', `Could not retrieve visited trips: ${error.message}`);
            }
        };

        checkVisitedStatus();
    }, [place.name]);

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
                Alert.alert('No Album', `No album exists for ${place.name}. Check in and add photos first.`);
            }
        } catch (error) {
            Alert.alert('Error', `Could not retrieve album: ${error.message}`);
        }
    };
    

    const handleBackPress = () => {
        navigation.navigate('HomeScreen');
    };
    
    return (
        <ImageBackground source={require('../assets/newDiz/back.png')} style={{ flex: 1 }}>
        <View style={styles.container}>
            <TouchableOpacity style={styles.backIcon} onPress={handleBackPress}>
                <Icons type={'back'}/>
            </TouchableOpacity>
                <Image source={place.image} style={styles.image} />
            <View style={styles.btnContainer}>
                <TouchableOpacity  
                    style={[styles.checkBtn, {backgroundColor: '#7fae6e'}, isVisited && styles.visitedBorder]} 
                    onPress={handleAlbumPress}
                >
                    <Text style={[styles.checkBtnText, isVisited && {color: '#ffc000'}]}>Album</Text>
                </TouchableOpacity>

                <TouchableOpacity  
                    style={[styles.checkBtn, isVisited && styles.visitedBorder]} 
                    onPress={() => navigation.navigate('CheckInScreen', {place: place})}
                >
                    <Text style={[styles.checkBtnText, isVisited && {color: '#ffc000'}]}>Check in</Text>
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
        </ImageBackground>
    );
};


const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        paddingTop: 0,
        paddingBottom: 30,
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
    visitedBorder: {
        borderWidth: 3,
        borderColor: '#FFC000',
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
        backgroundColor: '#aac99e',
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
        borderColor: '#7fae6e'
    },
    textContainer: {
        paddingHorizontal: 16,
        width: '100%'
    },
    name: {
        fontSize: 20,
        fontWeight: '900',
        marginBottom: 15,
        color: '#7fae6e',
        textAlign: 'center'
    },
    description: {
        fontSize: 17,
        marginBottom: 10,
        color: '#aac99e',
        textAlign: 'justify'
    },
    fact: {
        fontSize: 15,
        color: '#aac99e',
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
