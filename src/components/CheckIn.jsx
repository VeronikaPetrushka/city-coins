import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Dimensions, ScrollView, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MapView, { Marker } from "react-native-maps";
import Icons from './Icons';

const { height, width } = Dimensions.get('window');

const heightThreshold = 700;

const imageContainerHeight = height < heightThreshold ? height * 0.28 : height * 0.33;

const CheckIn = ({ place }) => {
    const mapRef = useRef(null);
    const navigation = useNavigation();
    const [photo, setPhoto] = useState(null);
    const [zoomedIn, setZoomedIn] = useState(false);
    const [markerSize, setMarkerSize] = useState(40);
    const [value, setValue] = useState(null);
    const [visited, setVisited] = useState(false);
    const [photos, setPhotos] = useState([]);

    const checkIfVisited = async () => {
        try {
            const storedVisitedTrips = await AsyncStorage.getItem('visitedTrips');
            const visitedTripsArray = storedVisitedTrips ? JSON.parse(storedVisitedTrips) : [];

            const visitedTrip = visitedTripsArray.find(trip => 
                trip.place && trip.place.name === place.name
            );

            setVisited(!!visitedTrip);
        } catch (error) {
            Alert.alert('Error', 'Could not check visit status: ' + error.message);
        }
    };

    useEffect(() => {
        if (!place || !place.name) {
            Alert.alert('Error', 'Place is not defined or missing necessary information.');
            return;
        }
        checkIfVisited();
    }, [place]);

    useFocusEffect(
        useCallback(() => {
            checkIfVisited();
        }, [place])
    );

    const handleZoomToggle = () => {
        const { lat, lng } = place.coordinates[0];

        if (!zoomedIn) {
            mapRef.current.animateToRegion({
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.0017,
                longitudeDelta: 0.0017,
            }, 1000);
            setMarkerSize(80);
        } else {
            mapRef.current.animateToRegion({
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.04,
                longitudeDelta: 0.04,
            }, 1000);
            setMarkerSize(40);
        }
        setZoomedIn(!zoomedIn);
    };

    const handleSelectPhoto = () => {
        launchImageLibrary({ mediaType: 'photo', selectionLimit: 0 }, (response) => {
            if (response.didCancel) {
                Alert.alert('Photo selection cancelled');
            } else if (response.error) {
                Alert.alert('Error selecting photo', response.error);
            } else if (response.assets && response.assets.length > 0) {
                const newPhotos = response.assets.map(asset => asset.uri);
                setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
            }
        });
    };
    
    const handleSubmit = async () => {
        if (photos.length === 0 ) {
            Alert.alert('Error', 'Please upload at least one photo and select a trip date range.');
            return;
        }
    
        const newVisitedTrip = {
            place,
            visitedDate: new Date().toISOString(),
            images: photos,
            isChecked: true,
        };


        try {
            const storedVisitedTrips = await AsyncStorage.getItem('visitedTrips');
            const visitedTripsArray = storedVisitedTrips ? JSON.parse(storedVisitedTrips) : [];

            const updatedVisitedTrips = [...visitedTripsArray, newVisitedTrip];

            await AsyncStorage.setItem('visitedTrips', JSON.stringify(updatedVisitedTrips));

            const storedScore = await AsyncStorage.getItem('score');
            const currentScore = storedScore ? JSON.parse(storedScore) : 0;

            const newScore = currentScore + 1000;
            await AsyncStorage.setItem('score', JSON.stringify(newScore));

            setVisited(true);
            Alert.alert('Success', `Congratulations! You’ve unlocked the achievement for visiting ${place.name}. Keep exploring Copenhagen to earn more achievements, collect coins, and make the most of your journey! Every step brings new rewards!`);

            setPhoto(null);
            setValue(null);

            navigation.goBack();
        } catch (error) {
            console.error('Error during check-in:', error);
            Alert.alert('Error', 'Could not save your check-in: ' + error.message);
        }
    };

    return (
        <ImageBackground source={require('../assets/newDiz/back.png')} style={{ flex: 1 }}>
        <View style={styles.container}>
            <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack('')}>
                <Icons type={'back'} />
            </TouchableOpacity>

            <Text style={styles.title}>{place.name}</Text>

            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    initialRegion={{
                        latitude: place.coordinates[0].lat,
                        longitude: place.coordinates[0].lng,
                        latitudeDelta: 0.04,
                        longitudeDelta: 0.04,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: place.coordinates[0].lat,
                            longitude: place.coordinates[0].lng,
                        }}
                    >
                        <View>
                            <Image
                                source={place.image}
                                style={[styles.markerImage, { width: markerSize, height: markerSize }]}
                            />
                            {visited && (
                                <View style={styles.visitedIcon}>
                                    <Icons type={'visited'} />
                                </View>
                            )}
                        </View>
                    </Marker>
                </MapView>
                <TouchableOpacity style={styles.zoomButton} onPress={handleZoomToggle}>
                    <Text style={styles.zoomButtonText}>{zoomedIn ? "Zoom Out" : "Zoom In"}</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.uploadButton} onPress={handleSelectPhoto}>
                <Text style={styles.uploadButtonText}>Upload Photo</Text>
            </TouchableOpacity>

            {photos.length > 0 ? (
                <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false} 
                    style={styles.imageCarousel}
                >
                    {photos.map((uri, index) => (
                        <View key={index} style={styles.imageWrapper}>
                            <Image source={{ uri }} style={styles.image} />
                        </View>
                    ))}
                </ScrollView>
            ) : (
                <View style={styles.imagePlaceholder}>
                    <View style={styles.imageIcon}>
                        <Icons type={'image'} />
                    </View>
                </View>
            )}

            <TouchableOpacity style={styles.checkBtn} onPress={handleSubmit}>
                <Text style={styles.checkBtnText}>Check in</Text>
            </TouchableOpacity>
        </View>
        </ImageBackground>
    );
};


const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 16,
        paddingTop: height * 0.07,
        paddingBottom: height * 0.05,
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
        width: width * 0.69,
        textAlign: 'center'
    },
    mapContainer: {
        width: '100%',
        height: imageContainerHeight,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 20,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    markerImage: {
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#02ae53',
    },
    zoomButton: {
        position: "absolute",
        bottom: 10,
        right: 10,
        backgroundColor: "#02ae53",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 5,
        zIndex: 10,
    },
    zoomButtonText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: '300',
    },
    uploadButton: {
        backgroundColor: '#02ae53',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        marginBottom: 20,
        width: 200,
        alignSelf: 'center'
    },
    uploadButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '900',
    },
    imageContainer: {
        width: '100%',
        height: imageContainerHeight,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    imagePlaceholder: {
        width: '100%',
        height: imageContainerHeight,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#aac99e',
        backgroundColor: 'rgba(44, 62, 80, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
        marginBottom: 20,
    },
    imageIcon: {
        width: 70,
        height: 70
    },
    imageCarousel: {
        width: '100%',
        height: imageContainerHeight,
        marginBottom: 20,
    },
    imageWrapper: {
        width: width * 0.91,
        height: '100%',
        marginRight: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },    
    picker: {
        width: '100%',
        backgroundColor: 'transparent',
        borderColor: '#aac99e',
        marginBottom: 15
    },
    checkBtn: {
        width: "100%",
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#02ae53',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkBtnText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: '900',
    },
    visitedIcon: {
        width: 30,
        height: 30,
        position: 'absolute',
        top: -5,
        right: -5,
        zIndex: 15
    }
});

export default CheckIn;
