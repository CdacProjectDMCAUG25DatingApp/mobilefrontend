    import { StyleSheet, Dimensions } from 'react-native';

    const { width, height } = Dimensions.get('window');

    export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },

    card: {
        width: width * 0.8,
        height: height * 0.65,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#111',
    },

    image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },

    overlay: {
        position: 'absolute',
        top: 40,
        alignSelf: 'center',
        alignItems: 'center',
    },

    name: {
        fontSize: 26,
        color: '#fff',
        fontWeight: '600',
    },

    subtitle: {
        fontSize: 14,
        color: '#ccc',
    },

    infoBox: {
        position: 'absolute',
        bottom: 20,
        left: 15,
        right: 15,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 15,
        padding: 12,
    },

    infoText: {
        color: '#fff',
        fontSize: 13,
        textAlign: 'center',
    },
    });
