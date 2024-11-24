import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, ImageBackground } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from "react-native-linear-gradient";
import WelcomeModal from "./WelcomeModal.jsx";
import SettingsModal from "./SettingsModal.jsx";
import Tutorial from "./Tutorial.jsx";
import Map from "./Map";

const { height , width} = Dimensions.get('window');

const Home = () => {
    const navigation = useNavigation();
    const [welcomeModalVisible, setWelcomeModalVisible] = useState(true);
    const [settingsModalVisible, setSettingsModalVisible] = useState(false);
    const [tutorialModalVisible, setTutorialModalVisible] = useState(false);
    const [uploadedImage, setUploadedImage] = useState({ uri: Image.resolveAssetSource(require('../assets/avatar/user.png')).uri });
    const [score, setScore] = useState(0);

    const loadAvatar = async () => {
        try {
          const storedImageUri = await AsyncStorage.getItem('uploadedImage');
            
          if (storedImageUri) {
            setUploadedImage(({ uri: storedImageUri }));
        } else {
            setUploadedImage({ uri: Image.resolveAssetSource(require('../assets/avatar/user.png')).uri });
        }
        } catch (error) {
          console.error('Error loading avatar:', error);
        }
      };

      const loadScore = async () => {
        try {
            const storedScore = await AsyncStorage.getItem('score');
            const parsedScore = storedScore ? JSON.parse(storedScore) : 0;
            setScore(parsedScore);
        } catch (error) {
            console.error('Error loading score:', error);
        }
    };
    
    useEffect(() => {
        loadAvatar();
        loadScore();
    }, []);
    
    const handleWelcomeVisible = () => {
        setWelcomeModalVisible(!welcomeModalVisible);
    };

    const handleSettingsVisible = async () => {
        setSettingsModalVisible(!settingsModalVisible);
        setUploadedImage({ uri: Image.resolveAssetSource(require('../assets/avatar/user.png')).uri });
        await loadAvatar();
    }

    const handleTutorialVisible = () => {
        setTutorialModalVisible(!tutorialModalVisible);
    };

    return (
        <ImageBackground source={require('../assets/newDiz/back.png')} style={{ flex: 1 }}>
        <View style={styles.container}>

            <View style={styles.upperPanel}>
                <View style={styles.scoreContainer}>
                    <Text style={styles.score}>{score}</Text>
                </View>
                <TouchableOpacity style={styles.infoBtn} onPress={() => navigation.navigate('StoreScreen')}>
                    <Text style={styles.infoText}>Store</Text>
                </TouchableOpacity>
                <View style={styles.settingsContainer}>
                    <TouchableOpacity style={styles.settingsBtn} onPress={handleSettingsVisible}>
                        <Image 
                            source={uploadedImage} 
                            style={styles.avatarImage}
                        />
                    </TouchableOpacity>
                    <Text style={styles.settingsText}>Settings</Text>
                </View>
            </View>

            <View style={{width: '100%', height: '63%'}}>
                <Map />
            </View>

            <TouchableOpacity style={styles.tutorialBtn} onPress={handleTutorialVisible}>
                <LinearGradient
                            colors={['#95bc86', '#40af17']}
                            
                            start={{ x: -0.15, y: 0.5 }}
                            end={{ x: 1.1, y: 0.5 }}
                            style={[styles.gradient]}
                        >
                    <Text style={styles.tutorialText}>Tutorial</Text>
                </LinearGradient>
            </TouchableOpacity>

            <View style={styles.bottomPanel}>
                <TouchableOpacity style={styles.adviceBtn} onPress={() => navigation.navigate('AchievementsScreen')}>
                    <LinearGradient
                            colors={['#2b790e', '#6aa156']}
                            start={{ x: -0.15, y: 0.5 }}
                            end={{ x: 1.1, y: 0.5 }}
                            style={[styles.gradient]}
                        >
                        <Text style={styles.btnText}>Achievements</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.scoreBtn} onPress={() => navigation.navigate('PlanScreen')}>
                    <LinearGradient
                            colors={['#6aa156', '#2b790e']}
                            start={{ x: -0.15, y: 0.5 }}
                            end={{ x: 1.1, y: 0.5 }}
                            style={[styles.gradient]}
                        >
                        <Text style={styles.btnText}>Route planning</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <SettingsModal visible={settingsModalVisible} onClose={handleSettingsVisible} />
            <WelcomeModal visible={welcomeModalVisible} onClose={handleWelcomeVisible}/>
            <Tutorial visible={tutorialModalVisible} onClose={handleTutorialVisible}/>

        </View>
        </ImageBackground>
    )
};

const styles = StyleSheet.create({
    
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 20,
        paddingTop: height * 0.07,
    },

    upperPanel: {
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        flexDirection: 'row',
        marginBottom: height * 0.025
    },

    scoreContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
    },

    score: {
        fontSize: 18,
        fontWeight: '900',
        color: '#6aa156',
    },

    infoBtn: {
        width: width * 0.46,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#2b790e',
        marginRight: 20,
    },

    infoText: {
        fontSize: 17,
        fontWeight: '900',
        color: '#6aa156',
    },

    settingsContainer: {
        alignItems: 'center',
        justifyContent:'center'
    },

    settingsBtn: {
        borderRadius: 100,
        width: 52,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#2b790e'
    },

    avatarImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },

    settingsText: {
        fontSize: 11,
        fontWeight: '900',
        color: '#6aa156'
    },

    quizIcon: {
        width: 60,
        height: 60,
        position: 'absolute',
        top: 5,
        left: 10,
        zIndex: 15
    },

    tutorialBtn: {
        width: '100%',
        height: height * 0.075,
        padding: 14,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: height * 0.02,
        marginTop: height * 0.04,
    },

    tutorialText: {
        fontSize: 19,
        fontWeight: '900',
        color: '#fff'
    },

    gradient: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        flexDirection: 'row',
    },

    bottomPanel: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },

    adviceBtn: {
        width: '48%',
        height: height * 0.065,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 14,
        overflow: 'hidden',
    },

    scoreBtn: {
        width: '48%',
        height: height * 0.065,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
    },

    btnText: {
        fontSize: 17,
        color: '#fff',
        fontWeight: '800'
    }
});

export default Home;