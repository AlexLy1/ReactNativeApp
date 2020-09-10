import React from 'react';
import { TouchableOpacity, FlatList, StyleSheet, Text, View, Image } from 'react-native';

/**
 * Import for firebase configration.
 */
import { fb, auth, database, storage } from '../../firebaseConfig/config.js';

/**
 * Main class of the page.
 */
class listing extends React.Component {

    /**
     * Constructor of the class, specifying the empty list of the listing,
     * refresh initial state and loggin state.
     * @param {can be used to navigate to this page} props 
     */
    constructor(props) {
        super(props);
        this.state = {
            // The list shows 9 items. 
            study_notes: [],
            refresh: false,
            loggedin: false
        };
    }

    /**
     * This method gets run each time when the page is activated.
     * It looks after the loggined state and when loggin succeed, it will 
     * call fetchdata to get data from firebase.
     */
    componentDidMount = () => {
        var origin = this;
        fb.auth().onAuthStateChanged(function (user) {
            if (user) {
                origin.setState({
                    loggedin: true
                });
                origin.fetchData();
            } else {
                origin.setState({
                    loggedin: false
                });
            }
        });
    }

    /**
     * This is the method that get each instance of the note and retrieves the concret values from 
     * the note and adds them into the listing.
     */
    addToFlatList = (notes, data, photoId) => {
        var origin = this;
        // fetch instance in notes tree
        var instance = data[photoId];

        notes.push({
            url: instance.url,
            date: instance.date,
            content: instance.content,
            duration: instance.duration,
            strategy: instance.strategy,
            sprint: instance.sprint,
            noteId: photoId,
            note: instance
        });

        origin.setState({
            refresh: false
        });
    }

    /**
     * This method retrieve the whole notes data from the database, and then it pass each 
     * instance to the addToFlatList() method for further process.
     */
    fetchData = () => {
        // rest the state
        this.setState({
            study_notes: [],
            refresh: true
        });

        var origin = this;

        database.ref('notes').once('value').then(function (snapshot) {
            if (snapshot !== null) data = snapshot.val();
            var notes = origin.state.study_notes;

            for (var photoId in data) {
                origin.addToFlatList(notes, data, photoId);
            }
        }).catch(error => console.log(error));
    }

    /**
     * This method call fetch data when the page get refreshed. 
     */
    refreshScreen = () => {
        this.fetchData();
    }

    /**
     * Render method of the page.
     */
    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.state.loggedin == true ? (
                    <View style={{ flex: 1 }}>
                        {/* This is the header title view of this page. */}
                        <View style={{ flexDirection: 'row', hieght: 70, paddingTop: 40, backgroundColor: 'white', borderColor: 'lightgrey', borderBottomWidth: 0.5, justifyContent: 'center', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text></Text>
                            <Text style={{ paddingBottom: 10, paddingLeft: 52, fontSize: 18, fontWeight: 'bold' }}> Listing Notes </Text>
                            {/* Touchable plus button to navigate to the new note page. */}
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('NewNote')}>
                                <Text style={{ paddingBottom: 5, paddingRight: 20, fontWeight: 'bold', color: 'darkblue' }}> New </Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            // Necessary attributes for the flat list.
                            refreshing={this.state.refresh}
                            onRefresh={this.refreshScreen}
                            data={this.state.study_notes}
                            keyExtractor={(item, index) => index.toString()}
                            style={{ flex: 1, backgroundColor: '#eee' }}
                            // Render out the items in the list.
                            // The below structure specifies a single item.  
                            renderItem={({ item, index }) => (
                                <View>
                                    <TouchableOpacity
                                        key={index}
                                        style={{ flexDirection: 'row', padding: 10, width: '100%', overflow: 'hidden', marginBottom: 1, borderBottomWidth: 1, borderColor: 'lightgrey' }}
                                        /* When tap on the note, the screen will navigate to the detail page and also pass this photo id to the detail page. */
                                        onPress={() => this.props.navigation.navigate('Detail', { note: item.note, id: item.noteId })}>
                                        <Image
                                            source={{ uri: item.url }}
                                            style={{ borderWidth: 1, borderColor: 'grey', resizeMode: 'cover', width: '40%', height: 150 }}
                                        />
                                        {/* attributes display of each note on the list */}
                                        <View style={{ padding: 10 }}>
                                            <Text style={{ fontWeight: 'bold' }}>Date: {item.date}</Text>
                                            <Text style={{ paddingTop: 8, fontWeight: 'bold' }}>Strategy: {item.strategy}</Text>
                                            <Text style={{ paddingTop: 8, fontWeight: 'bold' }}>Content: {item.content}</Text>
                                            <Text style={{ paddingTop: 8, fontWeight: 'bold' }}>Time spend: {item.duration}</Text>
                                            <Text style={{ paddingTop: 8, fontWeight: 'bold' }}>Sprint: {item.sprint}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    </View>
                ) : (
                    // when user is not under loggined state, the part gets displayed. 
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0000cd' }}>Please Login to See Your Notes! </Text>
                        </View>
                    )}
            </View>
        );
    }
}

export default listing;