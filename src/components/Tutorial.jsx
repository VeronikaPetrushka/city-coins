import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, Dimensions, Image } from "react-native";
import Icons from './Icons';

const { height } = Dimensions.get('window');

const Tutorial = ({ visible, onClose }) => {
    const tutorialData = [
        { image: require('../assets/places/4.png'), title: 'Visit Attractions', text: "Check in at sights using geolocation to earn achievements and points." },
        { image: require('../assets/places/8.png'), title: 'Capture the Moment', text: "Take a photo at each attraction for extra rewards. Keep exploring to collect them all!" },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (visible) {
            setCurrentIndex(0);
        }
    }, [visible]);

    const handleNext = () => {
        if (currentIndex < tutorialData.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            onClose();
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>How to earn points:</Text>

                    <Image source={tutorialData[currentIndex].image} style={styles.image} />
                    <Text style={styles.title}>{tutorialData[currentIndex].title}</Text>
                    <Text style={styles.text}>{tutorialData[currentIndex].text}</Text>

                    {
                        currentIndex < tutorialData.length - 1 ? (
                            <View style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                                <TouchableOpacity  
                                    style={[styles.previousButton, currentIndex === 0 && { opacity: 0.5 }]} 
                                    onPress={handlePrevious}
                                    disabled={currentIndex === 0}
                                    >
                                    <Icons type={'back'}/>
                                </TouchableOpacity>
        
                                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                                    <Icons type={'back'}/>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Text style={styles.buttonText}>{currentIndex < tutorialData.length - 1 ? 'Next' : 'Close'}</Text>
                            </TouchableOpacity>    
                        )
                    }

                </View>
            </View>
        </Modal>
    )
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 15,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: {
            width: 20,
            height: 20,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '800',
        lineHeight: 23,
        color: '#2b790e',
        marginBottom: 20,
        textAlign: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '900',
        lineHeight: 18,
        color: '#7fae6e',
        marginBottom: 20,
        textAlign: 'center'
    },
    text: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 16,
        color: '#3C3C3B',
        marginBottom: 28,
        textAlign: 'center'
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    previousButton: {
        width: 50,
        height: 50,
        marginRight: 30
    },
    nextButton: {
        width: 50,
        height: 50,
        transform: [{ rotate: '180deg' }]
    },
    closeButton: {
        width: 150,
        padding: 7,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#02ae53',
        alignSelf: 'center'
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '300',
    }
});

export default Tutorial;
