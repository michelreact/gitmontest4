import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Text,
    Button,
} from 'react-native'
import firebase from 'react-native-firebase';

class Page1 extends Component {
    state = {
        token: 'null',
        message: '',
    }

    componentDidMount() {
        this.checkPermission()
    }

    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission()
        if (enabled) {
            this.getToken()
        } else {
            this.requestPermission()
        }
    }

    async getToken() {
        const fcmToken = await firebase.messaging().getToken()
        if (fcmToken) {
            this.setState({ token: fcmToken })
        } else {
            this.setState({ token: 'token no' })
        }
    }

    async requestPermission() {
        try {
            await firebase.messaging().requestPermission()
            // user has authotised
            this.getToken()
        } catch (error) {
            // user has rejected permissions
            this.setState({ token: 'catch erreur user request permission'})
        }
    }

    buttonEnvoiMessage = () => {
        // Create a RemoteMessage
        const message = new firebase.messaging.RemoteMessage()
        .setMessageId('unique123')
        .setTo('mailto:laurentmichelst@gmail.com')
        .setData({
            key1: 'value1',
            key2: 'value2',
        });
        // Send the message
        firebase.messaging().sendMessage(message)
            .then((response) => {
                this.setState({ message: 'message envoyé' + response})
            })
            .then((error) => {
                this.setState({ message: 'message pas envoyé' + error })
            })
    }

    render () {
        return (
            <View style={styles.viewMain}>
                <Text>Page 1</Text>
                <Text>installation envoi message ok</Text>
                <Text>{this.state.token}</Text>
                <Button
                    title='envoi message'
                    color='green'
                    onPress={this.buttonEnvoiMessage}
                />
                <Text>{this.state.message}</Text>
            </View>
        )
    }
}

export default Page1

const styles = StyleSheet.create({
    viewMain: {
        marginLeft: 50,
        marginRight: 50,
    }
})

