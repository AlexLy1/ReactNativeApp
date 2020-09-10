import React from 'react';
import { TextInput, TouchableOpacity, StyleSheet, Text, View, Image } from 'react-native';

/**
 * Import for firebase configration.
 */
import { fb, database, storage, auth } from '../../firebaseConfig/config.js';


/**
 * Main class of the page.
 */
class profile extends React.Component {

    /**
     * Constructor of the class. holding a login state and a editing
     * profil state.
     * @param {can be used to navigate to this page.} props 
     */
    constructor(props) {
        super(props);
        this.state = {
            loggedin: false,
            editingProfile: false
        }
    }

    /**
     * This method is called each time when this page is activated.
     * It looks after the login state of the user and decides if it's needed 
     * to fetch data from the firebase.
     */
    componentDidMount = () => {
        var origin = this;
        fb.auth().onAuthStateChanged(function (user) {
            if (user) {
                origin.setState({
                    loggedin: true,
                    userId: user.uid
                });
                origin.fetchInfo(user.uid);
            } else {
                origin.setState({
                    loggedin: false
                });
            }
        });
    }

    /**
     * This method gets called by the above method, which mainly 
     * processes fetching data from firebase.
     */
    fetchInfo = (userId) => {
        var origin = this;
        database.ref('users').child(userId).once('value').then(function (snapshot) {
            if (snapshot.val() !== null) {
                data = snapshot.val();
                origin.setState({
                    username: data.userName,
                    name: data.name,
                    userId: userId,
                    email: data.email,
                    avatar: data.avatar
                });
            }
        });
    }

    /**
     * This is method is called when user click on the log out button.
     * It simple revoke the sign out method from firebase.
     */
    logOutUser = () => {
        fb.auth().signOut();
        alert('Successfully sign out! ');
    }

    /**
     * This method is called when user clicked on the edit profile button,
     * It process the information changing and saving.
     */
    editProfile = () => {
        if (this.state.editingProfile == true) {
            this.setState({
                editingProfile: false
            });
            this.saveChanges();
        } else {
            this.setState({
                editingProfile: true
            });
        }
    }

    /**
     * This method is called by editProfile(), which is used to save the changes 
     * made by the user.
     */
    saveChanges = () => {
        var name = this.state.name;
        var userName = this.state.username;

        if (name !== '') {
            database.ref('user').child(this.state.userId).child('name').set(name);
        }
        if (userName !== '') {
            database.ref('user').child(this.state.userId).child('userName').set(userName);
        }
    }

    /**
     * Render method of the page. 
     */
    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.state.loggedin == true ? (
                    <View style={{ flex: 1 }}>
                        {/* Title rendering */}
                        <View style={{ hieght: 70, paddingTop: 40, backgroundColor: 'white', borderColor: 'lightgrey', borderBottomWidth: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ paddingBottom: 10, fontSize: 18, fontWeight: 'bold' }}> Profile </Text>
                        </View>
                        {/* Avatar rending. */}
                        <View style={{ paddingTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1537815749002-de6a533c64db?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1145&q=80' }}
                                style={{ margin: 10, width: 200, height: 200, borderRadius: 100 }} />
                        </View>
                        {this.state.editingProfile == true ? (
                            // this part gets rendered when users are editing their profile page.
                            <View style={{ padding: 8, paddingTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>UserName:</Text>
                                <TextInput
                                    editable={true}
                                    placeholder={'New User Name'}
                                    onChangeText={(text) => this.setState({ username: text })}
                                    value={this.state.username}
                                    style={{ width: 250, marginVertical: 10, padding: 5, borderColor: 'lightgrey', borderWidth: 1, borderRadius: 5 }}
                                />
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Name:</Text>
                                <TextInput
                                    editable={true}
                                    placeholder={'New User Name'}
                                    onChangeText={(text) => this.setState({ name: text })}
                                    value={this.state.name}
                                    style={{ width: 250, marginVertical: 10, padding: 5, borderColor: 'lightgrey', borderWidth: 1, borderRadius: 5 }}
                                />
                            </View>
                            
                        ) : (
                                // This part gets rendered when the page is IDEL. 
                                <View style={{ paddingTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', paddingBottom: 8 }}>{this.state.username}</Text>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', paddingBottom: 8 }}>{this.state.name}</Text>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', paddingBottom: 8 }}>{this.state.userId}</Text>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', paddingBottom: 8 }}>{this.state.email}</Text>
                                </View>
                            )}

                        {/* Two buttons rendering. */}
                        <View style={{ padding: 50, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ paddingBottom: 30 }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.editProfile();
                                    }}
                                    style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10, backgroundColor: 'lightblue', borderRadius: 8, width: 250, height: 50, borderWidth: 0.5, borderColor: 'grey' }}>
                                    <Text style={{ fontSize: 20, color: 'white' }}>Edit Profile</Text>
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity
                                    style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10, backgroundColor: 'lightblue', borderRadius: 8, width: 250, height: 50, borderWidth: 0.5, borderColor: 'grey' }}
                                    onPress={() => {
                                        this.logOutUser();
                                    }}>
                                    <Text style={{ fontSize: 20, color: 'white' }}>Log Out</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ) : (   
                        // This part gets renderred when user is not loggined.
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0000cd' }}>Please Login to See Your Profile! </Text>
                        </View>
                    )
                }
            </View>
        );
    }
}

export default profile;