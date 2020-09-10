import React from 'react';
import { TextInput, TouchableOpacity, StyleSheet, Text, View } from 'react-native';

/**
 * Import for firebase configration.
 */
import { auth, database } from '../../firebaseConfig/config.js';

/**
 * Main class for the page.
 */
class register extends React.Component {

    /**
     * Constructor of the class. Holding two input values from the signup page.
     * @param {can be used to navigate to this page.} props 
     */
    constructor(props) {
        super(props);
        this.state = ({
            email: '',
            pass: ''
        });
    }

    /**
     * This method creates a new user object with spcific email address inputed by the user
     * and store this new user object into firebase. 
     */
    createUserObject = (userObj, email) => {
        var newUserObject = {
            name: 'sample name',
            userName: 'sample username',
            avatar: 'https://images.unsplash.com/photo-1488793207478-ff0892419e30?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=666&q=80',
            email: email
        };

        database.ref('users').child(userObj.uid).set(newUserObject);
        alert('Signup sussessfully!');
        this.props.navigation.navigate('Home');
    }


    /**
     * This is an async method which is called when user click on the signup button.
     * It pass the eamil address to createUserObject() method for further registering processes.
     */
    signup = async () => {
        var email = this.state.email;
        var pass = this.state.pass;
        if (email !== '' && pass !== '') {
            try {
                let user = await auth.createUserWithEmailAndPassword(email, pass)
                    .then((userObject) => this.createUserObject(userObject.user, email))
                    .catch((error) => alert(error));
            } catch (error) {
                alert(error);
            }
        } else {
            alert('Empty email or password!');
        }
    }

    /**
     * Render method of the class.
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
                    <Text style={{ paddingBottom: 10, paddingRight: 52, fontSize: 18, fontWeight: 'bold' }}> Signup </Text>
                    <Text></Text>
                </View>

                {/* This is the view for email and password input field. */}
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
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Password:</Text>
                    <TextInput
                        editable={true}
                        secureTextEntry={true}
                        placeholder={'Password goes here..'}
                        onChangeText={(text) => this.setState({ pass: text })}
                        value={this.state.pass}
                        style={{ width: 250, marginVertical: 10, padding: 5, borderColor: 'lightgrey', borderWidth: 1, borderRadius: 5 }}
                    />
                    {/* This is the view for the signup button.  */}
                    <View style={{ paddingTop: 30 }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.signup();
                            }}
                            style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10, backgroundColor: '#f4a460', borderRadius: 8, width: 250, height: 50, borderWidth: 0.5, borderColor: 'grey' }}>
                            <Text style={{ fontSize: 20, color: 'white' }}>Signup</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

export default register;