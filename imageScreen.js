import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, ScrollView, View, TextInput, TouchableHighlight, Image, BackHandler, useColorScheme, ToastAndroid } from 'react-native';
import { Icon } from '@rneui/themed';
import { useEffect, useState } from 'react';
import { Divider, Overlay } from '@rneui/base';
import { deleteDoc, doc, getFirestore, updateDoc } from 'firebase/firestore/lite';
import { getApp } from 'firebase/app';

const app = getApp();
const db = getFirestore(app);

export default function ImageScreen(props) {
  const [showCaption, setShowCaption] = useState(false)
  const [captionText, setCaptionText] = useState('')
  const [show, setShow] = useState(false)
  const showToast = (text) => {
    ToastAndroid.show(text, ToastAndroid.SHORT);
  }
  const { route } = props;
  const { params } = route;
  useEffect(() => {
    const backAction = () => {
      props.navigation.navigate('Profile')
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  const [bgColor, stetBgColor] = useState(false)

  let colorScheme = useColorScheme();

  useEffect(() => {


    if (colorScheme === 'dark') {
      stetBgColor(true)
    } else {
      stetBgColor(false)
    }
  }, [colorScheme])

  const updateCaption = async () => {
    await updateDoc(doc(db, 'UserUploads', params.DocId), { caption: captionText })
    setShowCaption(false)
    setCaptionText('')
  }

  const deletePost = async (deleteId) => {
    deleteDoc(doc(db, "UserUploads", deleteId));
    showToast('Post deleted successfully')
    props.navigation.navigate('Profile')
  }

  return (
    <View style={{ flex: 1, paddingTop: 35, backgroundColor: !bgColor ? 'white' : 'black' }}>
      <StatusBar style="auto" />
      <View style={styles.backView}>
        <Icon
          underlayColor={bgColor ? 'black' : 'white'}
          style={styles.back}
          size={30}
          color={bgColor ? 'white' : 'black'}
          name='arrow-back'
          onPress={() => { props.navigation.navigate('Profile') }}
        />
        <Text style={[styles.backText, { color: bgColor ? 'white' : 'black' }]}>Post</Text>
      </View>
      <Divider color={!bgColor ? '#dbdbdb' : '#3b3b3b'} />
      <ScrollView showsVerticalScrollIndicator={false} style={{ height: '100%' }}>
        <Overlay backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} overlayStyle={[styles.overlay, { backgroundColor: !bgColor ? 'white' : 'rgb(26, 26, 26)' }]} isVisible={show} onBackdropPress={() => { setShow(false) }}>
          <Text style={[styles.overlayTitle, { color: bgColor ? 'white' : 'black' }]}>Are you sure that you want to delete this post? Deleted post cannot be restored later.</Text>
          <View style={styles.allBtnView}>
            <TouchableHighlight underlayColor='#8eff8a' style={styles.overlayBtn} onPress={() => { deletePost(params.DocId) }}>
              <Text style={styles.overlayText}>
                Delete
              </Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor='gray' style={styles.overlayCancelBtn} onPress={() => { setShow(false) }}>
              <Text style={styles.overlayCancelText}>
                Cancel
              </Text>
            </TouchableHighlight>
          </View>
        </Overlay>

        <Overlay backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} overlayStyle={[styles.overlay, { backgroundColor: !bgColor ? 'white' : 'rgb(26, 26, 26)' }]} isVisible={showCaption} onBackdropPress={() => { setShowCaption(false); setCaptionText('') }}>
          <Text style={[styles.overlayTitle, { color: bgColor ? 'white' : 'black' }]}>Caption Update</Text>
          <TextInput multiline={true} value={captionText} onChangeText={(captionText) => { setCaptionText(captionText) }} style={styles.textInputStyle} placeholder='New Caption...' ></TextInput>
          <View style={styles.allBtnView}>
            <TouchableHighlight underlayColor='gray' style={styles.overlayCancelBtn} onPress={() => { setShowCaption(false); setCaptionText('') }}>
              <Text style={styles.overlayCancelText}>
                Cancel
              </Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor='#8eff8a' style={styles.overlayBtn} onPress={() => { updateCaption() }}>
              <Text style={styles.overlayText}>
                Done
              </Text>
            </TouchableHighlight>
          </View>
        </Overlay>

        <View style={styles.postAccount}>
          <Image style={styles.postAccountImage} source={{ uri: params.ProfileImage }}></Image>
          <Text style={[styles.postAccountUsername, { color: bgColor ? 'white' : 'black' }]}>{params.ImageUsername}</Text>
          <View style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10, paddingRight: 5, flexDirection: 'row' }}>
            <Icon
              onPress={() => { setShow(true) }}
              underlayColor={!bgColor ? 'white' : 'black'}
              type='ionicon'
              name='trash-outline'
              color='red'
              size={25}
            />
            <Icon
              onPress={() => { setShowCaption(true) }}
              underlayColor={!bgColor ? 'white' : 'black'}
              type='ionicon'
              name='ellipsis-vertical-outline'
              color={!bgColor ? 'black' : 'white'}
              size={25}
            />
          </View>
        </View>
        <View style={styles.container}>
          <Image style={{ height: 400, width: '100%' }} resizeMode='cover' source={{ uri: params.ImagePost }} />
        </View>
        <View style={styles.allTextView}>
          {/* <View style={styles.postReaction}>
            <Icon style={styles.postLike} type='ionicon' name='heart' size={33} color={bgColor ? 'red' : 'black'} />
            <Icon style={styles.postComment} type='ionicon' name='chatbubble-outline' size={28} color={bgColor ? 'white' : 'black'} />
            <Icon style={styles.postShare} type='ionicon' name='paper-plane-outline' size={28} color={bgColor ? 'white' : 'black'} />
          </View>
          <Text style={[styles.postLikeStat, {color: bgColor ? 'white' : 'black'}]}>{params.ImageLikes} Likes</Text> */}
          <View style={styles.postCaption}>
            <Text style={[styles.postCaptionUsername, { color: bgColor ? 'white' : 'black' }]}>{params.ImageUsername} {<Text style={styles.postCaptionText}>{params.ImageCaption}</Text>}</Text>
          </View>

          <Text style={styles.date}>{params.ImageDate}</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backView: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 60,
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  back: {
    paddingHorizontal: 8,
  },
  backText: {
    fontWeight: '600',
    fontSize: 22,
    paddingHorizontal: 3,
    paddingBottom: 2
  },
  postAccount: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 13,
    paddingTop: 17
  },
  postAccountImage: {
    width: 40,
    height: 40,
    borderRadius: 80,
  },
  postAccountUsername: {
    fontSize: 14,
    fontWeight: '500',
    paddingLeft: 7,
  },
  allTextView: {
    paddingHorizontal: 20,
    paddingTop: 5
  },
  overlay: {
    borderRadius: 20,
    width: '80%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  overlayTitle: {
    paddingHorizontal: 30,
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
  textInputStyle: {
    backgroundColor: '#f3f3f3',
    width: 250,
    padding: 10,
    paddingLeft: 14,
    fontSize: 15,
    borderRadius: 14,
    marginBottom: 20,
    marginTop: 10,
  },
  postCaption: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10
  },
  postCaptionUsername: {
    fontSize: 14,
    fontWeight: '500',
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
    marginTop: 20,
    marginBottom: 15
  },
});
