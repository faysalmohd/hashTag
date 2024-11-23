import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, ScrollView, View, Image, Dimensions, BackHandler, useColorScheme, ImageBackground, ToastAndroid, RefreshControl, ActivityIndicator } from 'react-native';
import { Icon } from '@rneui/themed';
import { useState, useRef, useCallback, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { GestureHandlerRootView, TapGestureHandler } from 'react-native-gesture-handler';
// import Animated, { useAnimatedStyle, useSharedValue, withSpring, withDelay } from 'react-native-reanimated';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore/lite';

const firebaseConfig = {
    apiKey: "AIzaSyAyuglecfsmXSPXwYrKDo851mWCKoBw_js",
    authDomain: "hashtaginfo-5e124.firebaseapp.com",
    projectId: "hashtaginfo-5e124",
    storageBucket: "hashtaginfo-5e124.appspot.com",
    messagingSenderId: "210582425078",
    appId: "1:210582425078:web:fd7cca1767cea8f58c8bd7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



// const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function Home({ navigation }) {
    const [loading, setLoading] = useState(true)
    const [refresh, setRefresh] = useState(false)
    const [data, setData] = useState([])
    const num = Dimensions.get('window').width - 20;
    // const doubleTapRef = useRef();
    // const scale = useSharedValue(0);
    // const rStyle = useAnimatedStyle(() => ({ transform: [{ scale: Math.max(scale.value, 0) }] }))
    const showToast = () => {
        ToastAndroid.show('Function in building process', ToastAndroid.SHORT);
    }

    const [bgColor, stetBgColor] = useState(false)

    const doRefresh = () => {
        setRefresh(true)
        fetchData()
    }

    const fetchData = async () => {
        setData([])
        setLoading(true)
        const dataCollection = collection(db, 'UserUploads');
        const dataSnapshot = await getDocs(dataCollection);
        const item = dataSnapshot.docs.map(doc => {
            return {
                id: doc.data().id,
                username: doc.data().username,
                caption: doc.data().caption,
                date: doc.data().date,
                image: doc.data().image,
                profileImage: doc.data().profileImage
            };
        });
        const sorted = item.sort((a, b) => { return b.id - a.id })
        setData(sorted);
        setRefresh(false)
        setLoading(false)
    }

    useEffect(() => {
        const fetchData = async () => {
            const dataCollection = collection(db, 'UserUploads');
            const dataSnapshot = await getDocs(dataCollection);
            const item = dataSnapshot.docs.map(doc => {
                return {
                    id: doc.data().id,
                    username: doc.data().username,
                    caption: doc.data().caption,
                    date: doc.data().date,
                    image: doc.data().image,
                    profileImage: doc.data().profileImage
                };
            });
            const sorted = item.sort((a, b) => { return b.id - a.id })
            setData(sorted);
        }
        fetchData();
        setLoading(false)
    }, []);

    let colorScheme = useColorScheme();

    useEffect(() => {


        if (colorScheme === 'dark') {
            stetBgColor(true)
        } else {
            stetBgColor(false)
        }
    }, [colorScheme])

    /* const liked = (a) => {
        let i = 0;
        while (i < data.length) {
            if (data[i].id == a) {

                data[i].likes = (Number(data[i].likes) + 1).toString()
                console.log(data[i].likes)
            }
            i++
        }
    }

    const onDoubleTap = useCallback(() => {

        scale.value = withSpring(1, undefined, (isFinished) => {
            if (isFinished) {
                scale.value = withDelay(400, withSpring(0));
            }
        });
    }, []); */

    /* const captionShrink = (cap) => {

        let capCopy = cap.match(/.{2,61}/g);
        return (
            <Text>
                <Text style={styles.postCaptionText}>{capCopy[0]}</Text>
                <Text onPress={() => { pressed(cap) }} style={{ color: 'gray', fontWeight: '500', fontSize: 15 }}>{pressed(cap)}</Text>
            </Text>
        )
    } 

    const pressed = (cap) => {
        let capCopy = cap.match(/.{2,51}/g);
        return (
            <Text style={{ color: 'gray', fontWeight: '400', fontSize: 15 }}>more...</Text>
        )
    } */

    useEffect(() => {
        const backAction = () => {
            if (navigation.getState().index == 0) {
                BackHandler.exitApp()
            } else {
                navigation.goBack()
                BackHandler.removeEventListener()
            }
            return true;
        };
        if (navigation.getState().index == 0) {
            const backHandler = BackHandler.addEventListener(
                'hardwareBackPress',
                backAction,
            );
            return () => backHandler.remove();
        }
    }, []);

    const Empty = () => {
        if (data.length === 0 && !loading){
            return (
                <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingVertical: 300 }}>
                    <Icon
                        type='ionicon'
                        name='thunderstorm-outline'
                        size={60}
                        color='#08FF08'
                        />
                    <Text style={{color: !bgColor ? 'black' : 'white', paddingVertical: 20, fontSize: 15, fontStyle: 'italic'}}>
                        Opps...No HashTags !
                    </Text>
                </View>
            )
        }
    }

    const PostCard = () => {
        const returnable = data.map((item, index) => {
            // const link = 'https://reactnative.dev/img/logo-og.png'
            return (
                <View key={index} style={styles.postsView}>
                    {/* <Divider color={!bgColor ? '#dbdbdb' : '#3b3b3b'} /> */}
                    <View style={styles.postAccount}>
                        <Image style={styles.postAccountImage} source={{ uri: item.profileImage }}></Image>
                        <Text style={[styles.postAccountUsername, { color: bgColor ? 'white' : 'black' }]}>{item.username}</Text>
                    </View>
                    <Image style={[styles.postImage, { width: num, height: num }]} source={{ uri: item.image }}></Image>
                    {/* <GestureHandlerRootView>
                        <TapGestureHandler
                            waitFor={doubleTapRef}
                        >
                            <TapGestureHandler
                                maxDelayMs={400}
                                ref={doubleTapRef}
                                numberOfTaps={2}
                                onActivated={onDoubleTap}
                            >
                                <Animated.View>
                                    <ImageBackground style={[styles.postImage, { width: num, height: num }]} source={{ uri: item.image }}>
                                        <AnimatedImage source={require('./assets/favorite.png')} style={[{ width: 140, height: 140, }, rStyle]} />
                                    </ImageBackground>
                                </Animated.View>
                            </TapGestureHandler>
                        </TapGestureHandler>
                    </GestureHandlerRootView> */}

                    <View style={styles.allTextView}>
                        {/* <View style={styles.postReaction}>
                            <Icon style={styles.postLike} onPress={() => { liked(index) }} type='ionicon' underlayColor={bgColor ? 'black' : 'white'} name='heart-outline' size={30} color={bgColor ? 'white' : 'black'} />
                            <Icon style={styles.postComment} onPress={showToast} type='ionicon' underlayColor={bgColor ? 'black' : 'white'} name='chatbubble-outline' size={25} color={bgColor ? 'white' : 'black'} />
                            <Icon style={styles.postShare} onPress={showToast} type='ionicon' underlayColor={bgColor ? 'black' : 'white'} name='paper-plane-outline' size={25} color={bgColor ? 'white' : 'black'} />
                        </View>
                        <Text style={[styles.postLikeStat, { color: bgColor ? 'white' : 'black' }]}>{item.likes} Likes </Text> */}
                        <View style={[styles.postCaption, { color: bgColor ? 'white' : 'black' }]}>
                            <Text style={[styles.postCaptionUsername, { color: bgColor ? 'white' : 'black' }]}>{item.username} <Text style={{ fontWeight: '400' }}>{item.caption}</Text></Text>
                        </View>

                        <Text style={styles.date}>{item.date}</Text>
                    </View>

                </View>
            )
        });
        return (
            <ScrollView>
                {returnable}
                {data.length != 0 ? <View style={styles.endView}>
                    <Icon
                        onPress={showToast} type='ionicon' underlayColor={bgColor ? 'black' : 'white'}
                        name='trophy'
                        size={100}
                        color='#08FF08'
                    />
                    <Text style={[styles.endText, { color: bgColor ? 'white' : 'black' }]}>
                        You have reached the end !
                    </Text>
                </View> : ''}
            </ScrollView>
        )
    }

    return (
        <View style={{ paddingTop: 35, backgroundColor: !bgColor ? 'white' : 'black', flex: 1 }}>

            <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl
                colors={['#08FF08']}
                refreshing={refresh}
                onRefresh={doRefresh}
            />}>
                <StatusBar style="auto" />

                <SafeAreaView style={styles.container}>
                    {/* <View style={styles.postsView}>
                    <Divider color='#dbdbdb' />
                    <View style={styles.postAccount}>
                        <Image style={styles.postAccountImage} source={require('./assets/icon.png')}></Image>
                        <Text style={styles.postAccountUsername}>Faysal Mohammed</Text>
                    </View>
                    <GestureHandlerRootView>
                        <TapGestureHandler
                            waitFor={doubleTapRef}
                        >
                            <TapGestureHandler
                                maxDelayMs={400}
                                ref={doubleTapRef}
                                numberOfTaps={2}
                                onActivated={onDoubleTap}
                            >
                                <Animated.View>
                                    <ImageBackground style={[styles.postImage, { width: num, height: num }]} source={require('./assets/icon.png')}>
                                        <AnimatedImage source={require('./assets/favorite.png')} style={[{ width: 140, height: 140, }, rStyle]} />
                                    </ImageBackground>
                                </Animated.View>
                            </TapGestureHandler>
                        </TapGestureHandler>
                    </GestureHandlerRootView>

                    <View style={styles.postReaction}>
                        <Icon style={styles.postLike} onPress={showToast} type='ionicon' underlayColor={bgColor ? 'black' : 'white'} name='heart-outline' size={33} color='black' />
                        <Icon style={styles.postComment} onPress={showToast} type='ionicon' underlayColor={bgColor ? 'black' : 'white'} name='chatbubble-outline' size={28} color='black' />
                        <Icon style={styles.postShare} onPress={showToast} type='ionicon' underlayColor={bgColor ? 'black' : 'white'} name='paper-plane-outline' size={28} color='black' />
                    </View>
                    <Text style={styles.postLikeStat}>232 Likes • 34 Comments</Text>
                    <View style={styles.postCaption}>
                        <Text style={styles.postCaptionUsername}>Faysal Mohammed{captionShrink(' My firsthsssja app based on instagram, more cooler and stylish...hehehe')}</Text>
                    </View>

                    <Text style={styles.date}>23 Jul 2023</Text>

                </View> */}
                    {loading ? <ActivityIndicator color='#08FF08' size={50} style={{paddingVertical: 350}} /> : ''}
                    {!loading ? <Empty /> : ''}
                    <PostCard />
                </SafeAreaView>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    postsView: {
        paddingVertical: 1,
        backgroundColor: 'rgba(200, 200, 200, 0.12)',
        marginBottom: 7,
        marginHorizontal: 10,
        borderRadius: 15,
    },
    postAccount: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    postAccountImage: {
        width: 40,
        height: 40,
        borderRadius: 80,
    },
    postAccountUsername: {
        fontSize: 14,
        fontWeight: '500',
        paddingLeft: 15,
    },
    postImage: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    allTextView: {
        paddingHorizontal: 20,
        paddingBottom: 5
    },
    postCaption: {
        display: 'flex',
        marginTop: 15,
        flexDirection: 'row',
    },
    postCaptionUsername: {
        fontSize: 14,
        fontWeight: '700',
        marginRight: 5
    },
    postCaptionText: {
        fontSize: 14,
        display: 'flex',
        flexWrap: 'wrap',
        marginBottom: 10,
        fontWeight: '400'
    },
    date: {
        color: 'gray',
        fontSize: 12,
        marginTop: 15,
        marginBottom: 8
    },
    endView: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 150
    },
    endText: {
        fontSize: 18
    }
});
