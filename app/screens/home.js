import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';

/**
 * Import for firebase configration.
 */
import { fb } from '../../firebaseConfig/config.js';

/**
 * Main class for this page.
 */
class home extends React.Component {

    /**
     * This is the constructor of the page, having a state to keep tracking 
     * if the current is loggined. 
     * @param {can be used to navigate to this page} props 
     */
    constructor(props) {
        super(props);
        this.state = ({
            loggedin: false
        });
    }

    /**
     * This method is run each time when this page activated,
     * it keeps tracking the changes of the auth state.
     */
    componentDidMount = () => {
        var origin = this;
        fb.auth().onAuthStateChanged(function (user) {
            if (user) {
                origin.setState({
                    loggedin: true
                });
            } else {
                origin.setState({
                    loggedin: false
                });
            }
        });
    }



    /**
     * Render method of the page.
     */
    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.state.loggedin == false ? (
                    // This part gets rendered when login is false, which will render the login and signup screen 
                    <View style={{ flex: 1 }}>
                        <View style={{ hieght: 70, paddingTop: 40, backgroundColor: 'white', borderColor: 'lightgrey', borderBottomWidth: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ paddingBottom: 10, fontSize: 18, fontWeight: 'bold' }}> Home </Text>
                        </View>

                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 50 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#20b2aa' }}> Welcome Study Diary App! </Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#20b2aa' }}>Please Choose Login or Signup!</Text>

                            <View style={{ paddingTop: 50, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Login')}
                                    style={{ margin: 10, width: 150, height: 150, borderRadius: 75, borderWidth: 1, borderColor: 'lightgrey', justifyContent: 'center', alignItems: 'center', backgroundColor: '#4169e1' }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>Login</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Register')}
                                    style={{ margin: 10, width: 150, height: 150, borderRadius: 75, borderWidth: 1, borderColor: 'lightgrey', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4a460' }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>Signup</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ) : (
                        // This part gets rendered when login is succeed. The view indicates the users that they are loggedin. 
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#20b2aa' }}>You are successfully Login!</Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#20b2aa' }}>Hope you enjoy the App!</Text>
                        </View>
                    )}
            </View>
        );
    }
}

export default home;