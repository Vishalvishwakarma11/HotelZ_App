const showToast = (message) => {
    Toast.show({
        type: 'success',
        text1: 'Success',
        text2: message,
        visibilityTime: 2000, // Set the duration for which the toast is visible
        autoHide: true, // Automatically hide the toast after the specified duration
        topOffset: 30, // Adjust the distance from the top of the screen
        bottomOffset: 40, // Adjust the distance from the bottom of the screen
        onShow: () => {
            console.log('Toast is shown!');
        },
        onHide: () => {
            console.log('Toast is hidden!');
        },
        textStyle: {
            fontSize: 16,
            fontWeight: 'bold',
        },
        backgroundColor: '#4CAF50', // Customize the background color
        borderColor: '#45A049', // Customize the border color
        borderWidth: 1, // Customize the border width
        borderRadius: 10, // Customize the border radius
        icon: 'success', // Specify the icon (success, error, info, etc.)
        iconColor: 'red', // Customize the icon color
    });
};
