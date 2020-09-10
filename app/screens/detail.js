import React from 'react';
import { TextInput, TouchableOpacity, StyleSheet, Text, View, Image } from 'react-native';

/**
 * Import for firbase configration.
 */
import { fb, database, storage, auth } from '../../firebaseConfig/config.js';

/**
 * Import for accessing phone camera and its camera roll.
 */
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

/**
 * Main class of the detail page. 
 */
class detail extends React.Component {

    
    /**
     * Constructor of the page, specifies the initial state of the page. 
     * @param {Can be used to do navigation} props 
     */
    constructor(props) {
        super(props);
        this.state = {
            ChangeText: false,
            imageId: this.generateId(),
            imageSelected: false,
            noteLoaded: false
        }
    }

    /**
     * This is the method that runs each time when user navigate to this page. 
     */
    componentDidMount = () => {
        this.checkNoteLoaded();
    }


    /**
     * This method checks if the identification parameters passed from 'Listing' page
     * is arrived successfully.
     */
    checkNoteLoaded = () => {
        var params = this.props.navigation.state.params;
        if (params) {
            this.setState({
                noteId: params.id,
                note: params.note,
                uri: params.note.url
            });
            this.fetchNoteData(params.note);
        }
    }


    /**
     * This method fetches the data from the given identification parameter, noteId and a note object.
     */
    fetchNoteData = (note) => {
        var origin = this;
        origin.setState({
            Date: note.date,
            Description: note.description,
            Strategy: note.strategy,
            Content: note.content,
            Time: note.duration,
            Sprint: note.sprint
        });
    }

    /**
     * An async function that checks the permissions of accessing
     * the camera and the camera roll. 
     */
    _checkCameraAndCameraRollPermissions = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ camera: status });

        const { statusRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        this.setState({ cameraRoll: statusRoll });
    }

    /**
     * This method generate a 4 char random number sequence, (e.g. e7av.)
     */
    randomId = () => {
        return Math.floor((Math.random() + 1) * 0x10000)
            .toString(16)
            .substring(1);
    }

    /**
     * This method generates a long sequence of ID consist of multiple random 4 bits sequences.
     */
    generateId = () => {
        return this.randomId() + this.randomId() + '-' + this.randomId() + '-'
            + this.randomId() + '-' + this.randomId() + '-' + this.randomId() + '-' + this.randomId()
            + '-' + this.randomId();
    }

    /**
     * This method is called when user press the upload photo button.
     * It process the behavior from the user did in the image picker GUI
     * and pass the result to the photo upload method.
     */
    selectPhoto = async () => {
        // first check permissions
        this._checkCameraAndCameraRollPermissions();

        let response = await ImagePicker.launchImageLibraryAsync({
            // only searching media types with images.
            mediaTypes: 'Images',
            allowEditing: true,
            // quality is from 0.1 to 1
            quality: 1
        });

        if (!response.cancelled) {
            this.setState({
                imageId: this.generateId(),
                // setting uri inside of the state,
                // so that the page can preview the selected image. 
                uri: response.uri,
                imageSelected: true
            });
        } else {
            this.setState({
                imageSelected: false
            });
        }
    }

    /**
     * Upload the selected photo to firebase storage.
     */
    uploadPhoto = async (uri) => {
        if (this.state.imageSelected) {
            var origin = this;
            var userId = fb.auth().currentUser.uid;
            var imageId = this.state.imageId;
            var noteID = this.state.noteId;

            // this statement finds the dot position of the image name
            // e.g. image.png, it will locate the position of the dot.
            var suffix = /(?:\.([^.]+))?$/;
            // this takes the suffix after the dot as the file name extension.
            var extension = suffix.exec(uri)[1];
            this.setState({ currentFileType: extension });

            const result = await fetch(uri);
            const blob = await result.blob();
            var filePath = imageId + '.' + origin.state.currentFileType;

            // creating a path in the storage
            // start with a user fold, inside this folder are specific user's fold
            // distinguish with their userID as their folder name
            // each user fold has an img folder containing the image with unique image id.
            const upload = storage.ref('user/' + userId + '/img').child(filePath).put(blob);

            // This code get the uploaded downloadURL
            upload.on('state_changed', function (snapshot) { },
                function (error) { console.log('Error uploading: ' + error); },
                function () {
                    upload.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                        database.ref('notes').child(noteID).child('url').set(downloadURL);
                    });
                });

        } else {
            alert('Please select an image before upload! ');
        }

    }

    /**
     * This method is called when button is used to activate the text input area.
     */
    startEdit = () => {
        this.setState({ ChangeText: true });
    }

    /**
     * This method is called when button is used to in-activate the text input area.
     */
    finishEdit = () => {
        this.setState({ ChangeText: false });
        database.ref('notes').child(this.state.noteId).child('description').set(this.state.Description);
    }

    /**
     * Render method of this page. 
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
                    <Text style={{ paddingBottom: 10, paddingRight: 52, fontSize: 18, fontWeight: 'bold' }}> Note Detail </Text>
                    <Text></Text>
                </View>

                {/* Top left and top right display for date and sprint. */}
                <View style={{ padding: 5, flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fffaf0', borderTopColor: 'lightgrey', borderTopWidth: 2 }}>
                    <Text style={{ color: 'grey' }}>{this.state.Date}</Text>
                    <Text style={{ color: 'grey' }}>{this.state.Sprint}</Text>
                </View>

                {/* This is the view for the description input. */}
                <View>
                    <TextInput
                        editable={this.state.ChangeText}
                        placeholder={'Study description gose here.'}
                        maxLength={1000}
                        multiline={true}
                        value={this.state.Description}
                        onChangeText={(text) => this.setState({ Description: text })}
                        style={{ height: 280, width: '100%', backgroundColor: '#fffaf0', color: '#a52a2a', paddingHorizontal: 10, paddingTop: 15, fontWeight: 'bold' }}
                    />
                </View>

                {/* This is the view for input text area and the edit button. */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5, paddingRight: 15, backgroundColor: '#fffaf0', borderBottomWidth: 2, borderColor: 'lightgrey' }}>
                    <View>
                        <Text style={{ color: 'grey' }}>{this.state.Content}</Text>
                        <Text style={{ color: 'grey' }}>{this.state.Strategy}</Text>
                        <Text style={{ color: 'grey' }}>{this.state.Time}</Text>
                    </View>

                    {/* This is the button that changes according the state of the text input area. */}
                    <TouchableOpacity
                        onPress={() => {
                            this.state.ChangeText == false ? (
                                this.startEdit()
                            ) : (
                                    this.finishEdit()
                                )
                        }}
                        style={{ backgroundColor: 'lightblue', borderRadius: 8, width: 80, height: 50, borderWidth: 0.5, borderColor: 'grey', justifyContent: 'center', alignItems: 'center', paddingRight: 10 }}>
                        {this.state.ChangeText == false ? (
                            <Text style={{ fontSize: 20, paddingLeft: 10, paddingBottom: 2, color: 'white' }}>Edit</Text>
                        ) : (
                                <Text style={{ fontSize: 20, paddingLeft: 10, paddingBottom: 2, color: 'white' }}>Done</Text>
                            )}
                    </TouchableOpacity>
                </View>

                {/* This is the view for the preview image. */}
                <View style={{ padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={{ uri: this.state.uri }}
                        style={{ borderWidth: 1, borderColor: 'grey', resizeMode: 'cover', width: '100%', height: 250 }}
                    />
                </View>

                {/* This is the view for the select and update photo buttons. */}
                <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ paddingLeft: 30 }}>
                        <TouchableOpacity
                            onPress={() => {
                                this.selectPhoto();
                            }}
                            style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10, backgroundColor: 'lightblue', borderRadius: 5, width: 150, borderWidth: 0.5, borderColor: 'grey' }}>
                            <Text style={{ fontSize: 20, color: 'white' }}>Select Photo</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ paddingRight: 30 }}>
                        <TouchableOpacity
                            style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10, backgroundColor: 'lightblue', borderRadius: 5, width: 150, borderWidth: 0.5, borderColor: 'grey' }}
                            onPress={() => {
                                this.uploadPhoto(this.state.uri);
                            }}>
                            <Text style={{ fontSize: 20, color: 'white' }}>Upload Photo</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View >
        );
    }
}

export default detail;