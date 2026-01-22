    import React, { useRef, useState } from 'react';
    import {
    Image,
    Animated,
    PanResponder,
    Dimensions,
    } from 'react-native';
    import styles from '../styles/homeStyles';

    const { width } = Dimensions.get('window');

    const images = [
    require('../../assets/photo1.jpg'),
    require('../../assets/photo2.jpg'),
    require('../../assets/photo3.jpg'),
    ];

    const SwipeCard = () => {
    const [index, setIndex] = useState(0);
    const position = useRef(new Animated.ValueXY()).current;

    const panResponder = useRef(
        PanResponder.create({
        onMoveShouldSetPanResponder: () => true,

        onPanResponderMove: Animated.event(
            [null, { dx: position.x }],
            { useNativeDriver: false }
        ),

        onPanResponderRelease: (_, gesture) => {
            // 👉 SWIPE THRESHOLD
            if (gesture.dx > 120) {
            console.log('👉 Swiped RIGHT');

            Animated.timing(position, {
                toValue: { x: width, y: 0 },
                duration: 200,
                useNativeDriver: false,
            }).start(() => {
                position.setValue({ x: 0, y: 0 });
                setIndex(prev => (prev + 1) % images.length);
            });

            } else if (gesture.dx < -120) {
            console.log('👉 Swiped LEFT');

            Animated.timing(position, {
                toValue: { x: -width, y: 0 },
                duration: 200,
                useNativeDriver: false,
            }).start(() => {
                position.setValue({ x: 0, y: 0 });
                setIndex(prev => (prev + 1) % images.length);
            });

            } else {
            // 👉 NOT A SWIPE
            Animated.spring(position, {
                toValue: { x: 0, y: 0 },
                useNativeDriver: false,
            }).start();
            }
        },
        })
    ).current;

    return (
        <Animated.View
        {...panResponder.panHandlers}
        style={[
            styles.card,
            { transform: [{ translateX: position.x }] },
        ]}
        >
        <Image
            source={images[index]}
            style={styles.image}
            resizeMode="cover"
        />
        </Animated.View>
    );
    };

    export default SwipeCard;
