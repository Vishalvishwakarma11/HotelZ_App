import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import COLORS from '../../consts/colors';

const Footer = () => {
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.footerContainer}
        >
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Powered by {" "}
                    <Text style={styles.footerBoldText}>
                        Cabbagesoft Technologies
                    </Text>
                </Text>
                <Text style={styles.footerText}>
                    App Version {" "}
                    <Text style={styles.footerBoldText}>
                        1.1.0
                    </Text>
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    footerContainer: {
        paddingTop: 50,
        backgroundColor: COLORS.white,
    },
    footer: {
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 30,
    },
    footerText: {
        color: '#000',
        fontSize: 14,
        textAlign: 'center', 
    },
    footerBoldText: {
        color: '#075eec',
        fontWeight: 'bold',
    },
});

export default Footer;
