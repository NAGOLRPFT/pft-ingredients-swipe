import React, { useState, useRef } from 'react';
import { View, Text, Pressable, Dimensions, Animated, Easing, Image } from 'react-native';
import { useFonts } from 'expo-font';
import { useNavigation } from '@react-navigation/native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

import '../global.css';

const { width } = Dimensions.get('window');

const ingredientsData = [
    {
        id: 1,
        name: 'Butter',
        emoji: '🧈',
    },
    {
        id: 2,
        name: 'Eggs',
        emoji: '🥚',
    },
    {
        id: 3,
        name: 'Milk',
        emoji: '🥛',
    },
    {
        id: 4,
        name: 'Flour',
        emoji: '🌾',
    },
    {
        id: 5,
        name: 'Cheese',
        emoji: '🧀',
    },
];

export default function Swipe() {
    const [fontsLoaded] = useFonts({
        Cabin: require('../assets/fonts/Cabin.ttf'),
        Montserrat: require('../assets/fonts/Montserrat.ttf'),
    });

    const navigation = useNavigation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    // Animated values for card swiping
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const rotate = translateX.interpolate({
        inputRange: [-width / 2, 0, width / 2],
        outputRange: ['-7.5deg', '0deg', '7.5deg'],
    });

    // Add new animated value for opacity
    const opacity = useRef(new Animated.Value(1)).current;

    // Create interpolations for showing "YES" or "NO" as the card is swiped
    const yesOpacity = translateX.interpolate({
        inputRange: [0, width / 8, width / 4],
        outputRange: [0, 0.5, 1],
        extrapolate: 'clamp',
    });

    const noOpacity = translateX.interpolate({
        inputRange: [-width / 4, -width / 8, 0],
        outputRange: [1, 0.5, 0],
        extrapolate: 'clamp',
    });

    // Helper to reset card position
    const resetPosition = () => {
        Animated.parallel([
            Animated.timing(translateX, {
                toValue: 0,
                duration: 200,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 200,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const selectIngredient = (ingredientName) => {
        setSelectedIngredients((prev) => [...prev, ingredientName]);
    };

    const handleChoice = (choice) => {
        // Fade out current card and emoji
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(translateX, {
                toValue: choice === 'yes' ? width : -width,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start(() => {
            setTimeout(() => {
                translateX.setValue(0);
                translateY.setValue(0);
                setCurrentIndex((prev) => prev + 1);

                // Fade in new card and emoji
                opacity.setValue(0);
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }).start();
            }, 100);
        });

        if (choice === 'yes') {
            const ingredient = ingredientsData[currentIndex];
            if (ingredient && !selectedIngredients.includes(ingredient.name)) {
                selectIngredient(ingredient.name);
            }
        }
    };

    // Gesture handler event
    const onPanGestureEvent = Animated.event(
        [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
        { useNativeDriver: true }
    );

    const onPanHandlerStateChange = (event) => {
        if (event.nativeEvent.state === State.END) {
            const dragX = event.nativeEvent.translationX;
            if (dragX > 50) {
                // Swiped right
                handleChoice('yes');
            } else if (dragX < -50) {
                // Swiped left
                handleChoice('no');
            } else {
                resetPosition();
            }
        }
    };

    if (!fontsLoaded) return null;

    const currentCard = ingredientsData[currentIndex];

    return (
        <View className="flex-1 bg-white p-8 pt-[8vh] pb-[5vh] items-center">
            <Image
                source={require('../assets/cochef-orange-C.png')}
                className="w-36 h-36 rounded-xl border-[#FF906B] mb-8"
            />

            {currentCard ? (
                <>

                    <Text className="text-black/70 font-cabin font-[600] text-xl text-black mb-0.5">
                        Do you have
                    </Text>
                    
                    <Text className={`text-black font-montserrat font-[800] text-5xl leading-[50px] text-center mb-8`}>{currentCard ? currentCard.name : ''} </Text>

                    <PanGestureHandler
                        onGestureEvent={onPanGestureEvent}
                        onHandlerStateChange={onPanHandlerStateChange}
                    >
                        <Animated.View
                            style={{
                                width: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity,
                                transform: [
                                    { translateX },
                                    { translateY },
                                    { rotate },
                                ],
                            }}
                        >
                            <View className="bg-neutral-100 rounded-xl p-4 items-center w-full">
                                <Animated.Text
                                    style={{ opacity }}
                                    className="text-[250px] mb-4"
                                >
                                    {currentCard.emoji}
                                </Animated.Text>

                                <Animated.View
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
                                        opacity: yesOpacity,
                                    }}
                                >
                                    <Text
                                        className="font-montserrat font-[900] text-8xl bg-green-500 p-4 px-8 pt-10 rounded-xl text-white"
                                    >
                                        YES
                                    </Text>
                                </Animated.View>

                                <Animated.View
                                    style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
                                        opacity: noOpacity,
                                    }}
                                >
                                    <Text
                                        className="font-montserrat font-[900] text-8xl bg-red-500 p-4 px-8 pt-10 rounded-xl text-white"
                                    >
                                        NO
                                    </Text>
                                </Animated.View>
                            </View>
                        </Animated.View>
                    </PanGestureHandler>

                    <View className="flex-row w-full justify-center mt-6 gap-4">
                        <Pressable
                            onPress={() => handleChoice('no')}
                            className="bg-red-500 w-1/2 rounded-full p-5 items-center"
                        >
                            <Text className="text-white font-montserrat font-[600] text-lg text-black">
                                No
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={() => handleChoice('yes')}
                            className="bg-green-500 w-1/2 rounded-full p-5 items-center"
                        >
                            <Text className="text-white font-montserrat font-[600] text-lg">
                                Yes
                            </Text>
                        </Pressable>
                    </View>
                </>
            ) : (
                <View className="items-center justify-center">
                    <Text className="text-black font-cabin font-[600] text-lg mb-4">
                        All ingredients checked
                    </Text>
                    <Pressable
                        onPress={() => setCurrentIndex(0)}
                        className="bg-[#FF6633] rounded-xl p-5 w-full items-center"
                    >
                        <Text className="text-white font-montserrat font-[600] text-lg">
                            Continue
                        </Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}