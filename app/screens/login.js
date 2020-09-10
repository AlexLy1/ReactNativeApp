import React from 'react';
import { TextInput, TouchableOpacity, StyleSheet, Text, View } from 'react-native';

/**
 * Import for firebase configration.
 */
import {auth} from '../../firebaseConfig/config.js';

/**
 * Main class of the page.
 */
class login extends React.Component {

    /**
     * Constructor of the page, the state stores two input values of the page.
     * @param {can be used to navigate to this page} props 
     */
    constructor(props) {
        super(props);
        this.state=({
            email: '',
            pass: ''
        });
    }

    /**
     * An async method, which is called when login button clicked. Then this method
     * will process the login infomation and login the user. 
     */
    login = async() => {

        var email = this.state.email;
        var pass = this.state.pass;
        if(email !== '' && pass !== ''){
            try{
                let user = await auth.signInWithEmailAndPassword(email, pass);
                if(user){
                    this.props.navigation.navigate('Listing');
                }
            } catch(error){
                alert(error);
            }
        } else {
            alert('Empty email or password!');
        }
    }

    /**
     * Render method of the page. 
     */
    render() {
        return (
            <View style={{ flex: 1 }}>
                {/* This is the header title view of this page. */}
                <View style={{ flexDirection: 'row', hieght: 70, paddingTop: 40, backgroundColor: 'white', borderColor: 'lightgrey', borderBottomWidth: 0.5, justifyContent: 'center', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Touchable back button to navigate back to the list page. */}
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Text style={{ paddingBottom: 5, paddingLeft: 20, fontWeight: 'bold', color: 'darkblue' }}> Back </Text>
                    </TouchableOpacity>
                    <Text style={{ paddingBottom: 10, paddingRight: 52, fontSize: 18, fontWeight: 'bold' }}> Login </Text>
                    <Text></Text>
                </View>

                {/* This is the view for email address input text. */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 300 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Email Address:</Text>
                    <TextInput
                        editable={true}
                        keyboardType={'email-address'}
                        placeholder={'Email goes here..'}
                        onChangeText={(text) => this.setState({ email: text })}
                        value={this.state.email}
                        style={{ width: 250, marginVertical: 10, padding: 5, borderColor: 'lightgrey', borderWidth: 1, borderRadius: 5 }}
                    />
                    {/* This is the view for password input text. */}
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Password:</Text>
                    <TextInput
                        editable={true}
                        secureTextEntry={true}
                        placeholder={'Password goes here..'}
                        onChangeText={(text) => this.setState({ pass: text })}
                        value={this.state.pass}
                        style={{ width: 250, marginVertical: 10, padding: 5, borderColor: 'lightgrey', borderWidth: 1, borderRadius: 5 }}
                    />

                    {/* This is the view for login button. */}
                    <View style={{ paddingTop: 30 }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.login();
                            }}
                            style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10, backgroundColor: '#4169e1', borderRadius: 8, width: 250, height: 50, borderWidth: 0.5, borderColor: 'grey' }}>
                            <Text style={{ fontSize: 20, color: 'white' }}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

export default login;