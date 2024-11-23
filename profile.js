import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, ScrollView, View, TextInput, TouchableHighlight, Image, Dimensions, useColorScheme, RefreshControl } from 'react-native';
import { Avatar, Icon, Overlay, Skeleton } from '@rneui/themed';
import { Divider } from '@rneui/themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore/lite';
import AsyncStorage from '@react-native-async-storage/async-storage'

const firebaseConfig = {
    apiKey: "AIzaSyAyuglecfsmXSPXwYrKDo851mWCKoBw_js",
    authDomain: "hashtaginfo-5e124.firebaseapp.com",
    projectId: "hashtaginfo-5e124",
    storageBucket: "hashtaginfo-5e124.appspot.com",
    messagingSenderId: "210582425078",
    appId: "1:210582425078:web:fd7cca1767cea8f58c8bd7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const num = Dimensions.get('window').width;
const singleNum = (num / 3) - 2;



export default function Profile(props) {
    const [refresh, setRefresh] = useState(false)
    const [profileImg, setProfileImg] = useState('https://everydaynutrition.co.uk/wp-content/uploads/2015/01/default-user-avatar.png');
    const [bioShowText, setBioShowText] = useState(<Skeleton circle={false} style={[{ marginHorizontal: 10, marginVertical: 5, marginBottom: 10 }]} width={200} height={16} animation='pulse'></Skeleton>)
    const [items, setItems] = useState([])
    const navigation = useNavigation();
    const [show, setShow] = useState(false)
    const [data, setData] = useState([]);

    const doRefresh = () => {
        setRefresh(true)
        fetchData1()
        fetchData2()
        fetchData3()
        setTimeout(() => {setRefresh(false)}, 500)
    }

    const fetchData1 = async () => {
        const dataCollection = collection(db, 'UserUploads');
        const dataSnapshot = await getDocs(dataCollection);
        const item = dataSnapshot.docs.map(doc => {
            return {
                id: doc.id,
                pic_id: doc.data().id,
                username: doc.data().username,
                caption: doc.data().caption,
                date: doc.data().date,
                image: doc.data().image,
                profileImage: doc.data().profileImage
            };
        });
        const filter = item.filter((userPost) => userPost.username === props.props.username)
        const sorted = filter.sort((a, b) => { return b.id - a.id })
        setData(sorted);
        
    }

    const fetchData2 = async () => {
        const dataCollection = collection(db, 'UserInfo');
        const dataSnapshot = await getDocs(dataCollection);
        const item = dataSnapshot.docs.map(doc => {
            return {
                username: doc.data().username,
                bio: doc.data().bio
            };

        });
        const filterBio = item.filter((user) => user.username === props.props.username)
        setItems(filterBio)
        if (filterBio.length === 0) {
            setBioShowText(<Text style={[styles.bioText, { fontStyle: 'italic', color: 'gray' }]}>No Bio to show</Text>)
        }
    }

    const fetchData3 = async () => {
        const dataCollection = collection(db, 'UserProfileImage');
        const dataSnapshot = await getDocs(dataCollection);
        const itemss = dataSnapshot.docs.map(doc => {
            return {
                username: doc.data().username,
                image: doc.data().image
            };
        });
        const filters = itemss.filter((Post) => Post.username === props.props.username)
        if (filters.length != 0) {
            setProfileImg(filters[0].image);
        }

    }

    useEffect(() => {
        const fetchData = async () => {
            const dataCollection = collection(db, 'UserUploads');
            const dataSnapshot = await getDocs(dataCollection);
            const item = dataSnapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    pic_id: doc.data().id,
                    username: doc.data().username,
                    caption: doc.data().caption,
                    date: doc.data().date,
                    image: doc.data().image,
                    profileImage: doc.data().profileImage
                };
            });
            const filter = item.filter((userPost) => userPost.username === props.props.username)
            const sorted = filter.sort((a, b) => { return b.id - a.id })
            setData(sorted);
        }
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const dataCollection = collection(db, 'UserInfo');
            const dataSnapshot = await getDocs(dataCollection);
            const item = dataSnapshot.docs.map(doc => {
                return {
                    username: doc.data().username,
                    bio: doc.data().bio
                };

            });
            const filterBio = item.filter((user) => user.username === props.props.username)
            setItems(filterBio)
            if (filterBio.length === 0) {
                setBioShowText(<Text style={[styles.bioText, { fontStyle: 'italic', color: 'gray' }]}>No Bio to show</Text>)
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const dataCollection = collection(db, 'UserProfileImage');
            const dataSnapshot = await getDocs(dataCollection);
            const itemss = dataSnapshot.docs.map(doc => {
                return {
                    username: doc.data().username,
                    image: doc.data().image
                };
            });
            const filters = itemss.filter((Post) => Post.username === props.props.username)
            if (filters.length != 0) {
                setProfileImg(filters[0].image);
            }

        }
        fetchData();
    }, []);

    /*     const LikeStatCount = () => {
            let count = 0;
            for (i = 0; i < data.length; i++) {
                count += Number(data[i].likes)
            }
            return count
        }
    
        const CommentStatCount = () => {
            let count = 0;
            for (i = 0; i < data.length; i++) {
                count += Number(data[i].comments)
            }
            return count
        }
     */

        const Logout = async () => {
            await AsyncStorage.removeItem('@userInfo');
            setTimeout(() => {navigation.navigate('Login')}, 200)
        }

    const Empty = () => {
        if (data.length === 0) {
            return (
                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, paddingVertical: 100 }}>
                    <Icon type='ionicon' name='thunderstorm-outline' color='#08FF08' size={50} />
                    <Text style={{ color: !bgColor ? 'black' : 'white', paddingTop: 15 }}>No HashTags</Text>
                </View>

            )
        }
    }

    const PostCard = () => {
        const returnable = data.map((item, index) => {
            return (
                <TouchableHighlight key={index} style={styles.postsBtn} onPress={() => { navigation.navigate('ImageScreen', { ImagePost: item.image, ProfileImage: profileImg, ImageUsername: item.username, ImageCaption: item.caption, ImageDate: item.date, DocId: item.id }) }}>
                    <Image style={[styles.postsImg, { width: singleNum, height: singleNum }]} source={{ uri: item.image }}></Image>
                </TouchableHighlight>
            )

        });
        return (
            <View style={styles.posts}>
                {returnable}
            </View>
        )

    }
    const imageStatScreen = (postImage, proImg, caption, date, username, docId) => {
        navigation.navigate('ImageScreen', { ImagePost: postImage, ProfileImage: proImg, ImageUsername: username, ImageCaption: caption, ImageDate: date, DocId: docId })
    }

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
        <View style={{ flex: 1 }}>
            <View style={{ paddingTop: 35, backgroundColor: !bgColor ? 'white' : 'black' }}></View>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl
                tintColor="rgba(0, 0, 0, 0)"
                colors={['#08FF08']}
                refreshing={refresh}
                onRefresh={doRefresh}
            />}>
                <StatusBar style="auto" />
                <SafeAreaView style={[styles.container, { backgroundColor: !bgColor ? 'white' : 'black', minHeight: 1000 }]}>
                    <View style={styles.userView}>
                        <Text onPress={() => { setShow(true) }} style={[styles.userText, { color: bgColor ? 'white' : 'black' }]}>{props.props.username}</Text>
                        {props.props.verified != Number(0) ? <Icon style={{ paddingTop: 2 }} type='material' size={20} color='#08FF08' name='verified' /> : ''}
                        <Icon onPress={() => { setShow(true) }} style={{ paddingTop: 3 }} type='ionicon' color={bgColor ? 'white' : 'black'} name={show ? 'chevron-up' : 'chevron-down'} underlayColor={bgColor ? 'black' : 'white'} />
                    </View>
                    <Overlay backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} overlayStyle={[styles.overlay, { backgroundColor: !bgColor ? 'white' : 'rgb(26, 26, 26)' }]} isVisible={show} onBackdropPress={() => { setShow(false) }}>
                        <Text style={[styles.overlayTitle, { color: bgColor ? 'white' : 'black' }]}>Do you want to Log Out?</Text>
                        <View style={styles.allBtnView}>
                            <TouchableHighlight underlayColor='#8eff8a' style={styles.overlayBtn} onPress={() => { Logout() }}>
                                <Text style={styles.overlayText}>
                                    Log Out
                                </Text>
                            </TouchableHighlight>
                            <TouchableHighlight underlayColor='gray' style={styles.overlayCancelBtn} onPress={() => { setShow(false) }}>
                                <Text style={styles.overlayCancelText}>
                                    Cancel
                                </Text>
                            </TouchableHighlight>
                        </View>
                    </Overlay>
                    <View style={styles.header}>

                        <View style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                            {/* <View style={styles.profileImg}>
                                <Image style={{ flex: 1, borderRadius: 400 }} source={{ uri: profileImg }}></Image>
                            </View> */}
                            <Avatar
                                source={{ uri: profileImg }}
                                size={400}
                                rounded
                                style={styles.profileImg}
                            >
                                <Avatar.Accessory name='brush' color='white' containerStyle={{
                                    backgroundColor: '#08FF08',
                                    padding: 3, borderRadius: 20
                                }} size={27} style={{ transform: 'translate(-5px, -10px)' }} onPress={() => {navigation.navigate("Settings")}} underlayColor='rgba(0, 0, 0, 0)' />
                            </Avatar>
                            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={[styles.statNumber, { color: bgColor ? 'white' : 'black' }]}>
                                    {data.length}
                                </Text>
                                <Text style={[styles.statText, { color: bgColor ? 'white' : 'black' }]}>
                                    Posts
                                </Text>
                            </View>

                        </View>
                        {/* <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <Text style={[styles.statNumber, { color: bgColor ? 'white' : 'black' }]}>
                                {LikeStatCount()}
                            </Text>
                            <Text style={[styles.statText, { color: bgColor ? 'white' : 'black' }]}>
                                Likes
                            </Text>
                        </View>
                        <View style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                            <Text style={[styles.statNumber, { color: bgColor ? 'white' : 'black' }]}>
                                {CommentStatCount()}
                            </Text>
                            <Text style={[styles.statText, { color: bgColor ? 'white' : 'black' }]}>
                                Comments
                            </Text>
                        </View> */}
                    </View>
                    <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
                        <Text style={[styles.usernameText, { color: bgColor ? 'white' : 'black' }]}>
                            {props.props.firstname} {props.props.lastname}
                        </Text>
                        <View>
                            {items.length != 0 ? <Text style={[styles.bioText, { color: bgColor ? 'white' : 'black' }]}>{items[0].bio}</Text> : bioShowText}
                        </View>
                    </View>
                    <View style={styles.dividerStyle}>
                        <Divider color={!bgColor ? '#dbdbdb' : '#3b3b3b'} />
                    </View>
                    <Empty />
                    <PostCard />
                    {/* <TouchableHighlight style={styles.postsBtn} underlayColor='white' onPress={() => {imageStatScreen('./assets/icon.png')}}>
                        <Image style={[styles.postsImg, {width: singleNum, height: singleNum}]} source={require('./assets/icon.png')}></Image>
                    </TouchableHighlight> */}
                </SafeAreaView>
            </ScrollView>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 250
    },
    userView: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    overlay: {
        borderRadius: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
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
        flexDirection: 'row',
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
    overlayCancelBtn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        paddingHorizontal: 40,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#08FF08'
    },
    overlayCancelText: {
        color: '#08FF08',
        fontWeight: '900'
    },
    userText: {
        fontSize: 25,
        fontWeight: '800'
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 25,
        paddingBottom: 10,
        paddingLeft: 10,
    },
    profileImg: {
        borderWidth: 1,
        borderColor: '#08FF08',
        padding: 5,
        marginTop: 10,
        marginBottom: 35,
        height: 150,
        width: 150,
        borderRadius: 110
    },
    statText: {
        fontSize: 15,
        fontWeight: '400',
    },
    statNumber: {
        fontWeight: '700',
        fontSize: 30
    },
    usernameText: {
        fontWeight: '500',
        paddingRight: 25,
        paddingLeft: 10,
    },
    bioText: {
        height: 'fitContent',
        paddingVertical: 5,
        paddingRight: 25,
        paddingBottom: 10,
        paddingLeft: 10,
    },
    dividerStyle: {
        paddingHorizontal: 10,
        paddingTop: 5,
        paddingBottom: 15,
    },
    posts: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    postsBtn: {
        paddingHorizontal: 1,
        paddingVertical: 1,
    },
    postsImg: {
        borderRadius: 0
    }
});
