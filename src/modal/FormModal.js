import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import COLORS from '../consts/colors';

const FormModal = ({ onClose, isVisible, onSave, userName, userInfo }) => {
    const [modalUserName, setModalUserName] = useState(userName);
    const [modalUserInfo, setModalUserInfo] = useState(userInfo);

    return (
        <Modal animationType="slide" transparent={true} visible={isVisible}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Edit User Information</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter User Name"
                        value={modalUserName}
                        onChangeText={(text) => setModalUserName(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter User Info"
                        value={modalUserInfo}
                        onChangeText={(text) => setModalUserInfo(text)}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={() => onSave(modalUserName, modalUserInfo)}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 10,
        width: '90%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: COLORS.primary,
    },
    input: {
        marginBottom: 16,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderWidth: 1.5,
        borderColor: '#ccc',
        borderRadius: 8,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop:10,
    },
    saveButton: {
        flex: 1,
        padding: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButton: {
        flex: 1,
        padding: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 5,
        alignItems: 'center',
        marginRight: 10,
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default FormModal;
