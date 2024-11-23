import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, ScrollView, View, TextInput, TouchableHighlight, Image, Button, useColorScheme, ToastAndroid } from 'react-native';
import * as Progress from 'react-native-progress';
import { FAB, Icon, Overlay } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { getApp } from "firebase/app";
import { addDoc, collection, getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
    apiKey: "AIzaSyASMm1EBY4AtpcAcBe-ZPTud-QyON10_18",
    authDomain: "hashtag-49216.firebaseapp.com",
    projectId: "hashtag-49216",
    storageBucket: "hashtag-49216.appspot.com",
    messagingSenderId: "212337364540",
    appId: "1:212337364540:web:24538fae64b0b17966fd39"
};

const app = getApp()
const db = getFirestore(app)
export default function Gallery(props) {
    const [show, setShow] = useState(false)
    const [progress, setProgress] = useState(0)
    const [caption, setCaption] = useState('')
    const [profilePicture, setProfilePicture] = useState('');
    const [image, setImage] = useState(null);
    const [isImage, setIsImage] = useState(true);

    useEffect(() => {
        if (props.props.image != undefined) {
            setProfilePicture(props.props.image)
        }
        else {
            setProfilePicture('https://everydaynutrition.co.uk/wp-content/uploads/2015/01/default-user-avatar.png')
        }
    }, [])


    const showToast = (text) => {
        ToastAndroid.show(text, ToastAndroid.SHORT);
    }

    let current_date = () => {
        let monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        let usable = new Date();
        let date = usable.getDate();
        let year = usable.getFullYear();
        let returnable1 = `${year}${Date.now()}`;
        let returnable2 = `${date} ${monthShort[usable.getMonth()]} ${year}`;
        return [returnable1, returnable2]
    }

    const CancelPost = () => {
        setImage(null);
        setIsImage(true)
        setCaption('')
    }

    const UploadPost = async () => {
        setProgress(0)
        setShow(true)
        const file = image.split('.');
        const possibleFileName = current_date();
        const fileName = possibleFileName[0] + '.' + file[file.length - 1]
        const storageRef = ref(getStorage(getApp(), 'gs://hashtag-49216.appspot.com'), "images/" + fileName);

        const response = await fetch(image);
        const blob = await response.blob();

        const UploadTask = uploadBytesResumable(storageRef, blob);

        UploadTask.on("state_changed",
            (snapshot) => {
                const progresss = (snapshot.bytesTransferred / snapshot.totalBytes);
                setProgress(Number(progresss.toFixed()));
            },
            (error) => {
                showToast("Something went wrong while uploading")
            },
            () => {
                getDownloadURL(UploadTask.snapshot.ref)
                    .then(async (downloadURL) => {
                        let newUser = { caption: caption, image: downloadURL, id: Number(possibleFileName[0]), username: props.props.username, profileImage: profilePicture, date: possibleFileName[1] };
                        await addDoc(collection(db, 'UserUploads'), newUser);
                    })
                    .then(() => {
                        setShow(false);
                        setImage(null);
                        setCaption('')
                        setIsImage(true);
                        setProgress(0);
                    })
            })

    }

    const pickImage = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [10, 10],
            quality: 1,
        });

        if (result.assets != null) {
            setImage(result.assets[0].uri);
            setIsImage(false)
        } else {
            setImage(null);
            setIsImage(true)
        }
    };

    const [bgColor, stetBgColor] = useState(false)

    let colorScheme = useColorScheme();

    useEffect(() => {


        if (colorScheme === 'dark') {
            stetBgColor(true)
        } else {
            stetBgColor(false)
        }
    }, [colorScheme])

    return (
        <View style={[styles.container, { backgroundColor: !bgColor ? 'white' : 'black' }]}>
            <StatusBar style="auto" />
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                <Overlay backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} overlayStyle={[styles.overlay, { backgroundColor: !bgColor ? 'white' : 'rgb(26, 26, 26)' }]} isVisible={show}>
                    <Text style={[styles.overlayTitle, { color: bgColor ? 'white' : 'black' }]}>Uploading Your Masterpiece</Text>

                    <View style={styles.allBtnView}>
                        <Progress.Bar
                            progress={progress}
                            width={250}
                            indeterminate={progress === 0 ? false : false}
                            color='#08FF08'
                            style={{ marginVertical: 10, marginBottom: 20 }}
                        />
                        <TouchableHighlight underlayColor='gray' style={styles.overlayHideBtn} onPress={() => { setShow(false) }}>
                            <Text style={styles.overlayHideText}>
                                Hide
                            </Text>
                        </TouchableHighlight>
                    </View>

                </Overlay>
                <View style={styles.viewImage}>
                    {isImage ?
                        <View style={styles.nullView}>
                            <Icon type='fontisto' name='dizzy' size={50} color='gray' style={{ paddingVertical: 15 }} />
                            <Text style={{ color: 'gray' }}>No Image Selected !</Text>
                        </View>
                        : image && <Image source={{ uri: image }} style={styles.image} />}
                </View>
                {!isImage ? <TextInput value={caption} multiline={true} onChangeText={(caption) => { setCaption(caption) }} placeholder='Caption...' style={styles.caption}></TextInput> : ''}
                <View style={styles.postBtnView}>
                    {!isImage ? <TouchableHighlight underlayColor='#008724' style={styles.cancelBtn} onPress={CancelPost}><Text style={styles.cancelBtnText}>Cancel</Text></TouchableHighlight> : ''}
                    {!isImage ? <TouchableHighlight underlayColor='#008724' style={styles.uploadBtn} onPress={UploadPost}><Text style={styles.uploadBtnText}>Upload</Text></TouchableHighlight> : ''}
                </View>
            </ScrollView>
            <TouchableHighlight style={styles.galleryBtn}>
                <FAB
                    style={{ marginBottom: 100 }}
                    placement='right'
                    size='large'
                    icon={{ name: 'camera', type: 'ionicon', size: 25, color: '#08FF08' }}
                    color="white"
                    onPress={pickImage}
                />
            </TouchableHighlight>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        paddingTop: 150,
        display: 'flex',
        justifyContent: 'center',
    },
    overlay: {
        borderRadius: 20,
    },
    overlayTitle: {
        paddingHorizontal: 50,
        paddingVertical: 20,
        fontSize: 16,
        fontWeight: '600'
    },
    allBtnView: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
        gap: 10
    },
    overlayBtn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#08FF08',
        borderRadius: 14,
        paddingHorizontal: 40,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#08FF08'
    },
    overlayText: {
        color: 'white',
        fontWeight: '900'
    },
    overlayHideBtn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        paddingHorizontal: 40,
        paddingVertical: 10,
        backgroundColor: '#08FF08'
    },
    overlayHideText: {
        color: 'white',
        fontWeight: '900'
    },
    viewImage: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 400,
        width: 400,
    },
    nullView: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 200
    },
    image: {
        width: 400,
        height: 400,
        borderRadius: 10
    },
    caption: {
        backgroundColor: '#f3f3f3',
        height: 'fitContent',
        maxHeight: 200,
        padding: 10,
        borderRadius: 7,
        marginTop: 50,
        marginHorizontal: 10
    },
    galleryBtn: {
        display: 'flex',
        top: 65,
        marginTop: 100
    },
    postBtnView: {
        display: 'flex',
        justifyContent: 'center',
        gap: 10,
        alignItems: 'center',
        marginHorizontal: 30,
        marginBottom: 200,
        marginTop: 40,
        flexDirection: 'row'
    },
    cancelBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 14,
        backgroundColor: '#08ff08',
        paddingHorizontal: 50
    },
    cancelBtnText: {
        color: 'white',
        fontWeight: '900',
        fontSize: 15,
    },
    uploadBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 14,
        backgroundColor: '#08ff08',
        paddingHorizontal: 50
    },
    uploadBtnText: {
        color: 'white',
        fontWeight: '900',
        fontSize: 15,
    },
});
