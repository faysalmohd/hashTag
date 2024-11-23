import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, ScrollView, View, TextInput, TouchableHighlight, Image, Button, useColorScheme, ToastAndroid } from 'react-native';
import { Divider, Icon, Tooltip, Overlay } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Progress from 'react-native-progress';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { getApp } from "firebase/app";
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, updateDoc } from 'firebase/firestore/lite';
import { useNavigation } from '@react-navigation/native';

const CTooltip = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <Tooltip
      visible={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      {...props}
    />
  );
};

const app = getApp()
const db = getFirestore(app)

export default function Settings(props) {
  const navigation = useNavigation()
  const [bgColor, stetBgColor] = useState(false)
  const [password, setPassword] = useState(false)
  const [errorAvailable, setErrorAvailable] = useState(false)
  const [oldPassword, setOldPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState(false)
  const [showProfilePicture, setShowProfilePicture] = useState(false)
  const [showUsername, setShowUsername] = useState(false)
  const [showFirstname, setShowFirstname] = useState(false)
  const [showLastname, setShowLastname] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showBio, setShowBio] = useState(false)
  const [showDeleteAccount, setShowDeleteAccount] = useState(false)
  const [deleteText, setDeleteText] = useState('')
  const [usernameText, setUsernameText] = useState('')
  const [firstnameText, setFirstnameText] = useState('')
  const [lastnameText, setLastnameText] = useState('')
  const [passwordText, setPasswordText] = useState('')
  const [confirmPasswordText, setConfirmPasswordText] = useState('')
  const [oldPasswordText, setOldPasswordText] = useState('')
  const [bioText, setBioText] = useState('')
  const [show, setShow] = useState(false)
  const [progress, setProgress] = useState(0)
  const [image, setImage] = useState(null);
  const [isImage, setIsImage] = useState(true);

  const showToast = (text) => {
    ToastAndroid.show(text, ToastAndroid.SHORT);
  }

  const updateFirstname = async () => {
    await updateDoc(doc(db, 'Users', props.props.id), { firstname: firstnameText });
    setShowFirstname(false)
    setFirstnameText('')
    showToast("Re-Login to see changes")
  }

  const updateLastname = async () => {
    await updateDoc(doc(db, 'Users', props.props.id), { lastname: lastnameText });
    setShowLastname(false)
    setLastnameText('')
    showToast("Re-Login to see changes")
  }

  const updatePassword = async () => {
    if (passwordText === confirmPasswordText) {
      if (oldPasswordText === props.props.password) {
        if (passwordText.length >= 8) {
          await updateDoc(doc(db, "Users", props.props.id), { password: passwordText })
          navigation.navigate('Login')
        } else {
          showToast("Password length must be 8 or above")
        }

      } else {
        showToast("Passwords dont match")
      }
    } else {
      showToast("New password does not match with Confirm password")
    }
    setShowPassword(false)
    setConfirmPassword(false)
    setPassword(false)
    setOldPassword(false)
    setOldPasswordText('')
    setPasswordText('')
    setConfirmPasswordText('')
  }

  const updateBio = async () => {
    const dataCollection = collection(db, 'UserInfo');
    const dataSnapshot = await getDocs(dataCollection);
    const item = dataSnapshot.docs.map(doc => {
      return {
        id: doc.id,
        username: doc.data().username,
        bio: doc.data().bio
      };
    });
    const filterBio = item.filter((user) => user.username === props.props.username)
    if (filterBio.length != 0) {
      await updateDoc(doc(db, "UserInfo", filterBio[0].id), { bio: bioText })
    } else {
      await addDoc(collection(db, 'UserInfo'), { username: props.props.username, bio: bioText });
    }
    setShowBio(false)
    setBioText('')
  }

  const AccountDelete = async () => {
    if (deleteText === props.props.password) {
      const dataCollection1 = collection(db, 'UserUploads');
      const dataSnapshot1 = await getDocs(dataCollection1);
      const item1 = dataSnapshot1.docs.map(doc => {
        return {
          id: doc.id,
          username: doc.data().username,
        };
      });
      const filter1 = item1.filter((userPost1) => userPost1.username === props.props.username)
      if (filter1.length != 0) {
        for (i of filter1) {
          await deleteDoc(doc(db, "UserUploads", i.id))
        }
      }

      const dataCollection2 = collection(db, 'UserInfo');
      const dataSnapshot2 = await getDocs(dataCollection2);
      const item2 = dataSnapshot2.docs.map(doc => {
        return {
          id: doc.id,
          username: doc.data().username,
        };
      });
      const filter2 = item2.filter((userPost2) => userPost2.username === props.props.username)
      if (filter2.length != 0) {
        for (i of filter2) {
          await deleteDoc(doc(db, "UserInfo", i.id))
        }
      }

      const dataCollection3 = collection(db, 'UserProfileImage');
      const dataSnapshot3 = await getDocs(dataCollection3);
      const item3 = dataSnapshot3.docs.map(doc => {
        return {
          id: doc.id,
          username: doc.data().username,
        };
      });
      const filter3 = item3.filter((userPost3) => userPost3.username === props.props.username)
      if (filter3.length != 0) {
        for (i of filter3) {
          await deleteDoc(doc(db, "UserProfileImage", i.id))
        }
      }


      await deleteDoc(doc(db, "Users", props.props.id))

    }
    else {
      showToast("Password does not match")
    }
    setDeleteText('')
    setShowDeleteAccount(false)
    navigation.navigate('Login')
  }

  const noAction = () => {
    setShowProfilePicture(false)
    setShowFirstname(false)
    setShowLastname(false)
    setShowPassword(false)
    setErrorAvailable(false)
    setShowBio(false)
    setShowDeleteAccount(false)
    setFirstnameText('')
    setLastnameText('')
    setPasswordText('')
    setConfirmPasswordText('')
    setOldPasswordText('')
    setBioText('')
    setPassword(false)
    setConfirmPassword(false)
    setDeleteText('')
    setImage(null);
    setIsImage(true)
    setShowPassword(false)
    setOldPassword(false)
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

  /* const fetchData = async () => {
    const dataCollection = collection(db, 'UserProfileImage');
    const dataSnapshot = await getDocs(dataCollection);
    const items = dataSnapshot.docs.map(doc => {
      return {
        id: doc.id,
        username: doc.data().username,
        image: doc.data().image,
      };
    })
    const filter = items.filter((user) => user.username === props.props.username)
    console.log(filter)
    return filter
  }; */

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
            const dataCollection = collection(db, 'UserProfileImage');
            const dataSnapshot = await getDocs(dataCollection);
            const items = dataSnapshot.docs.map(doc => {
              return {
                id: doc.id,
                username: doc.data().username,
                image: doc.data().image,
              };
            })
            const filter = items.filter((user) => user.username === props.props.username)
            if (filter.length != 0) {
              await updateDoc(doc(db, 'UserProfileImage', filter[0].id), { image: downloadURL });
            } else {
              let newUser = { image: downloadURL, username: props.props.username }
              await addDoc(collection(db, 'UserProfileImage'), newUser);
            }
          })
          .then(() => {
            setShow(false);
            setImage(null);
            setIsImage(true);
            setProgress(0);
            setShowProfilePicture(false)
          })
      })

  }


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
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



  let colorScheme = useColorScheme();

  useEffect(() => {


    if (colorScheme === 'dark') {
      stetBgColor(true)
    } else {
      stetBgColor(false)
    }
  }, [colorScheme])

  const handlePress = async (site) => {
    await WebBrowser.openBrowserAsync(site);
  };

  return (
    <View style={{ flex: 1, paddingTop: 35, backgroundColor: !bgColor ? 'white' : 'black' }}>
      <StatusBar style="auto" />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <View>
          <Icon type='ionicon' name='construct-outline' size={100} color='#08FF08' style={{ paddingBottom: 70 }} />
        </View>
        {/* --------------------------------------------------------overlays-------------------------------------------------------------------------------------------------------- */}

        <Overlay backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} overlayStyle={[styles.overlay, { backgroundColor: !bgColor ? 'white' : 'rgb(26, 26, 26)', flex: 0.5 }]} isVisible={showProfilePicture} onBackdropPress={() => { noAction() }}>
          <Text style={[styles.overlayTitle, { color: bgColor ? 'white' : 'black' }]}>Profile Picture</Text>
          {image ? image && <View style={styles.imageView}><Image source={{ uri: image }} style={styles.image} /></View> : ''}
          <TouchableHighlight underlayColor='#8eff8a' style={[styles.overlayBtn, { width: 260, marginVertical: 20 }]} onPress={() => { pickImage() }}>
            <Text style={styles.overlayText}>
              Select Image
            </Text>
          </TouchableHighlight>
          <View style={styles.allBtnView}>
            <TouchableHighlight underlayColor='#8eff8a' style={styles.overlayBtn} onPress={() => { UploadPost() }}>
              <Text style={styles.overlayText}>
                Upload
              </Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor='gray' style={styles.overlayCancelBtn} onPress={() => { noAction() }}>
              <Text style={styles.overlayCancelText}>
                Cancel
              </Text>
            </TouchableHighlight>
          </View>
        </Overlay>


        {/* <Overlay backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} overlayStyle={[styles.overlay, { backgroundColor: !bgColor ? 'white' : 'rgb(26, 26, 26)' }]} isVisible={showUsername} onBackdropPress={() => { noAction() }}>
          <Text style={[styles.overlayTitle, { color: bgColor ? 'white' : 'black' }]}>Username</Text>
          <TextInput keyboardType='visible-password' autoCapitalize='none' value={usernameText} onChangeText={(usernameText) => { setUsernameText(usernameText) }} style={styles.textInputStyle} placeholder='Username' ></TextInput>
          <View style={styles.allBtnView}>
            <TouchableHighlight underlayColor='gray' style={styles.overlayCancelBtn} onPress={() => { noAction() }}>
              <Text style={styles.overlayCancelText}>
                Cancel
              </Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor='#8eff8a' style={styles.overlayBtn} onPress={() => { updateUsername() }}>
              <Text style={styles.overlayText}>
                Done
              </Text>
            </TouchableHighlight>

          </View>
        </Overlay> */}


        <Overlay backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} overlayStyle={[styles.overlay, { backgroundColor: !bgColor ? 'white' : 'rgb(26, 26, 26)' }]} isVisible={showFirstname} onBackdropPress={() => { noAction() }}>
          <Text style={[styles.overlayTitle, { color: bgColor ? 'white' : 'black' }]}>Firstname</Text>
          <TextInput value={firstnameText} onChangeText={(firstnameText) => { setFirstnameText(firstnameText) }} style={styles.textInputStyle} placeholder='Firstname' ></TextInput>
          <View style={styles.allBtnView}>
            <TouchableHighlight underlayColor='gray' style={styles.overlayCancelBtn} onPress={() => { noAction() }}>
              <Text style={styles.overlayCancelText}>
                Cancel
              </Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor='#8eff8a' style={styles.overlayBtn} onPress={() => { updateFirstname() }}>
              <Text style={styles.overlayText}>
                Done
              </Text>
            </TouchableHighlight>
          </View>
        </Overlay>


        <Overlay backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} overlayStyle={[styles.overlay, { backgroundColor: !bgColor ? 'white' : 'rgb(26, 26, 26)' }]} isVisible={showLastname} onBackdropPress={() => { noAction() }}>
          <Text style={[styles.overlayTitle, { color: bgColor ? 'white' : 'black' }]}>Lastname</Text>
          <TextInput value={lastnameText} onChangeText={(lastnameText) => { setLastnameText(lastnameText) }} style={styles.textInputStyle} placeholder='Lastname' ></TextInput>
          <View style={styles.allBtnView}>
            <TouchableHighlight underlayColor='gray' style={styles.overlayCancelBtn} onPress={() => { noAction() }}>
              <Text style={styles.overlayCancelText}>
                Cancel
              </Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor='#8eff8a' style={styles.overlayBtn} onPress={() => { updateLastname() }}>
              <Text style={styles.overlayText}>
                Done
              </Text>
            </TouchableHighlight>
          </View>
        </Overlay>


        <Overlay backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} overlayStyle={[styles.overlay, { backgroundColor: !bgColor ? 'white' : 'rgb(26, 26, 26)' }]} isVisible={showPassword} onBackdropPress={() => { noAction() }}>
          <Text style={[styles.overlayTitle, { color: bgColor ? 'white' : 'black' }]}>Password</Text>

          <View style={styles.viewPassword}>
            <TextInput autoCapitalize='none' value={oldPasswordText} onChangeText={(oldPasswordText) => { setOldPasswordText(oldPasswordText) }} style={styles.password} placeholder='Current Password' secureTextEntry={!oldPassword} ></TextInput>
            <View style={{ borderRadius: 14 }}>
              <Icon
                onPress={() => { setOldPassword(!oldPassword) }}
                style={{ padding: 5 }}
                name={oldPassword ? "visibility-off" : "visibility"}
                color='#a3a3a3'
                underlayColor='#f3f3f3' />
            </View>
          </View>


          <View style={styles.viewPassword}>
            <TextInput autoCapitalize='none' value={passwordText} onChangeText={(passwordText) => { setPasswordText(passwordText) }} style={styles.password} placeholder='New Password' secureTextEntry={!password} ></TextInput>
            <View style={{ borderRadius: 14 }}>
              <Icon
                onPress={() => { setPassword(!password) }}
                style={{ padding: 5 }}
                name={password ? "visibility-off" : "visibility"}
                color='#a3a3a3'
                underlayColor='#f3f3f3' />
            </View>
          </View>

          <View style={[styles.viewPassword, { marginBottom: 40 }]}>
            <TextInput autoCapitalize='none' value={confirmPasswordText} onChangeText={(confirmPasswordText) => { setConfirmPasswordText(confirmPasswordText) }} style={styles.password} placeholder='Confirm Password' secureTextEntry={!confirmPassword} ></TextInput>
            <View style={{ borderRadius: 14 }}>
              <Icon
                onPress={() => { setConfirmPassword(!confirmPassword) }}
                style={{ padding: 5 }}
                name={confirmPassword ? "visibility-off" : "visibility"}
                color='#a3a3a3'
                underlayColor='#f3f3f3' />
            </View>
          </View>
          {errorAvailable ? <View style={{ paddingHorizontal: 30, paddingBottom: 30 }}>
            <Text style={{ color: 'red', paddingBottom: 5 }}>Possible reasons for seeing this error:</Text>
            <Text style={{ color: 'red', paddingBottom: 5 }}>1. Current password does not match with old password.</Text>
            <Text style={{ color: 'red', paddingBottom: 5 }}>2. New password does not match with Confirm password.</Text>
          </View> : ''}
          <View style={styles.allBtnView}>
            <TouchableHighlight underlayColor='gray' style={styles.overlayCancelBtn} onPress={() => { noAction() }}>
              <Text style={styles.overlayCancelText}>
                Cancel
              </Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor='#8eff8a' style={styles.overlayBtn} onPress={() => { updatePassword() }}>
              <Text style={styles.overlayText}>
                Done
              </Text>
            </TouchableHighlight>
          </View>
        </Overlay>


        <Overlay backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} overlayStyle={[styles.overlay, { backgroundColor: !bgColor ? 'white' : 'rgb(26, 26, 26)' }]} isVisible={showBio} onBackdropPress={() => { noAction() }}>
          <Text style={[styles.overlayTitle, { color: bgColor ? 'white' : 'black' }]}>Bio</Text>
          <TextInput value={bioText} onChangeText={(bioText) => { setBioText(bioText) }} style={styles.textInputStyle} placeholder='Bio' ></TextInput>
          <View style={styles.allBtnView}>
            <TouchableHighlight underlayColor='gray' style={styles.overlayCancelBtn} onPress={() => { noAction() }}>
              <Text style={styles.overlayCancelText}>
                Cancel
              </Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor='#8eff8a' style={styles.overlayBtn} onPress={() => { updateBio() }}>
              <Text style={styles.overlayText}>
                Done
              </Text>
            </TouchableHighlight>

          </View>
        </Overlay>


        <Overlay backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} overlayStyle={[styles.overlay, { backgroundColor: !bgColor ? 'white' : 'rgb(26, 26, 26)' }]} isVisible={showDeleteAccount} onBackdropPress={() => { noAction() }}>
          <Text style={[styles.overlayTitle, { color: bgColor ? 'white' : 'black' }]}>Delete Account</Text>
          <TextInput value={deleteText} keyboardType='visible-password' autoCapitalize='none' onChangeText={(deleteText) => { setDeleteText(deleteText) }} style={styles.textInputStyle} placeholder='Password' ></TextInput>
          <View style={styles.allBtnView}>
            <TouchableHighlight underlayColor='#8eff8a' style={[styles.overlayBtn, { backgroundColor: 'red', borderColor: 'red' }]} onPress={() => { AccountDelete() }}>
              <Text style={styles.overlayText}>
                DELETE
              </Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor='gray' style={styles.overlayCancelBtn} onPress={() => { noAction() }}>
              <Text style={styles.overlayCancelText}>
                Cancel
              </Text>
            </TouchableHighlight>
          </View>
        </Overlay>




        <Overlay backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }} overlayStyle={[styles.overlay, { backgroundColor: !bgColor ? 'white' : 'rgb(26, 26, 26)' }]} isVisible={show}>
          <Text style={[styles.overlayTitle, { color: bgColor ? 'white' : 'black' }]}>Uploading Your Masterpiece</Text>

          <View style={styles.allBtnView}>
            <Progress.Bar
              progress={progress}
              width={250}
              indeterminate={progress === 0 ? false : false}
              color='#08FF08'
              style={{ marginVertical: 10, marginBottom: 20,  }}
            />
          </View>

        </Overlay>



        {/* --------------------------------------------------------end overlay----------------------------------------------------------------------------------------------------- */}
        {/* PROFILE */}
        <View style={styles.title}>
          <Text style={styles.titleText}>
            Profile
          </Text>
        </View>

        <View style={{ paddingBottom: 70 }}>
          <TouchableHighlight onPress={() => { setShowProfilePicture(true) }} underlayColor='rgba(220, 220, 220, 0.15)'>
            <View style={styles.btnView}>
              <Icon style={styles.btnIcon} type='ionicon' name='image-outline' size={35} color='#08FF08' />
              <Text style={[styles.btnText, { color: bgColor ? 'white' : 'black' }]}>Profile Picture</Text>
            </View>
          </TouchableHighlight>
          <Divider color='#cfcfcf' />
          {/* <TouchableHighlight onPress={() => { setShowUsername(true) }} underlayColor='rgba(220, 220, 220, 0.15)'>
            <View style={styles.btnView}>
              <Icon style={styles.btnIcon} type='ionicon' name='person-outline' size={35} color='#08FF08' />
              <Text style={[styles.btnText, { color: bgColor ? 'white' : 'black' }]}>Username</Text>
            </View>
          </TouchableHighlight>
          <Divider color='#cfcfcf' /> */}
          <TouchableHighlight onPress={() => { setShowFirstname(true) }} underlayColor='rgba(220, 220, 220, 0.15)'>
            <View style={styles.btnView}>
              <Icon style={styles.btnIcon} type='material' name='looks-one' size={35} color='#08FF08' />
              <Text style={[styles.btnText, { color: bgColor ? 'white' : 'black' }]}>Firstname</Text>
            </View>
          </TouchableHighlight>
          <Divider color='#cfcfcf' />
          <TouchableHighlight onPress={() => { setShowLastname(true) }} underlayColor='rgba(220, 220, 220, 0.15)'>
            <View style={styles.btnView}>
              <Icon style={styles.btnIcon} type='material' name='looks-two' size={35} color='#08FF08' />
              <Text style={[styles.btnText, { color: bgColor ? 'white' : 'black' }]}>Lastname</Text>
            </View>
          </TouchableHighlight>
          <Divider color='#cfcfcf' />
          <TouchableHighlight onPress={() => { setShowPassword(true) }} underlayColor='rgba(220, 220, 220, 0.15)'>
            <View style={styles.btnView}>
              <Icon style={styles.btnIcon} type='ionicon' name='lock-closed-outline' size={35} color='#08FF08' />
              <Text style={[styles.btnText, { color: bgColor ? 'white' : 'black' }]}>Password</Text>
            </View>
          </TouchableHighlight>
          <Divider color='#cfcfcf' />
          <TouchableHighlight onPress={() => { setShowBio(true) }} underlayColor='rgba(220, 220, 220, 0.15)'>
            <View style={styles.btnView}>
              <Icon style={styles.btnIcon} type='ionicon' name='text-outline' size={35} color='#08FF08' />
              <Text style={[styles.btnText, { color: bgColor ? 'white' : 'black' }]}>Bio</Text>
            </View>
          </TouchableHighlight>


          {/* ACCOUNT */}
          <View style={styles.title}>
            <Text style={styles.titleText}>
              Account
            </Text>
          </View>
          <TouchableHighlight onPress={() => { setShowDeleteAccount(true) }} underlayColor='rgba(220, 220, 220,  0.15)'>
            <View style={styles.btnView}>
              <Icon style={styles.btnIcon} type='ionicon' name='trash-outline' size={35} color='red' />
              <Text style={[styles.btnText, { color: 'red' }]}>Delete Account</Text>
            </View>
          </TouchableHighlight>



          {/* DEVELOPER */}
          <View style={styles.title}>
            <Text style={styles.titleText}>
              About Developer
            </Text>
          </View>
          <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 120, paddingTop: 30, paddingBottom: 10 }}>
            <TouchableHighlight onPress={() => { handlePress('https://www.instagram.com/_.f4ysal.mohd03/') }} underlayColor='rgba(220, 220, 220,  0.15)' >
              <Icon style={styles.btnIcon} type='ionicon' name='logo-instagram' size={35} color='#08FF08' />
            </TouchableHighlight>
            <TouchableHighlight onPress={() => { handlePress('https://www.snapchat.com/add/faysal.mohd?share_id=a2mHD3veZHo&locale=en-GB') }} underlayColor='rgba(220, 220, 220,  0.15)' >
              <Icon style={styles.btnIcon} type='ionicon' name='logo-snapchat' size={35} color='#08FF08' />
            </TouchableHighlight>
            <TouchableHighlight onPress={() => { handlePress('https://www.facebook.com/profile.php?id=100077576431605') }} underlayColor='rgba(220, 220, 220,  0.15)' >
              <Icon style={styles.btnIcon} type='ionicon' name='logo-facebook' size={35} color='#08FF08' />
            </TouchableHighlight>
          </View>


          {/* APPS USED */}
          <View style={styles.title}>
            <Text style={styles.titleText}>
              Developing Tools
            </Text>
          </View>
          <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 50, paddingTop: 30, paddingBottom: 10 }}>
            <CTooltip onPress={() => { console.log('js') }} backgroundColor='#08FF08' popover={<Text style={{ color: 'white', fontWeight: '700' }}>JavaScript</Text>}>
              <Icon style={styles.btnIcon} type='ionicon' name='logo-javascript' size={35} color='#08FF08' />
            </CTooltip>
            <CTooltip onPress={() => { console.log('npm') }} width={300} backgroundColor='#08FF08' popover={<Text style={{ color: 'white', fontWeight: '700' }}>npm (Node Package Manager)</Text>}>
              <Icon style={styles.btnIcon} type='ionicon' name='logo-npm' size={35} color='#08FF08' />
            </CTooltip>
            <CTooltip onPress={() => { console.log('react native') }} backgroundColor='#08FF08' popover={<Text style={{ color: 'white', fontWeight: '700' }}>React Native</Text>}>
              <Icon style={styles.btnIcon} type='ionicon' name='logo-react' size={35} color='#08FF08' />
            </CTooltip>
            <CTooltip onPress={() => { console.log('windows 10') }} backgroundColor='#08FF08' popover={<Text style={{ color: 'white', fontWeight: '700' }}>Windows 10 pro</Text>}>
              <Icon style={styles.btnIcon} type='ionicon' name='logo-windows' size={35} color='#08FF08' />
            </CTooltip>
            <CTooltip onPress={() => { console.log('firebase') }} backgroundColor='#08FF08' popover={<Text style={{ color: 'white', fontWeight: '700' }}>Firebase</Text>}>
              <Icon style={styles.btnIcon} type='ionicon' name='logo-firebase' size={35} color='#08FF08' />
            </CTooltip>
          </View>

        </View>

        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ paddingBottom: 85, fontSize: 12, color: 'gray', fontStyle: 'italic' }}>HashTag Version 1.0.0</Text>
        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    paddingVertical: 70,
  },
  overlay: {
    borderRadius: 20,
    width: '90%',
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
  overlayHideText: {
    color: 'white',
    fontWeight: '900'
  },
  imageView: {
    padding: 5,
    borderRadius: 150,
    borderWidth: 2,
    borderColor: '#08FF08',
    marginVertical: 20
  },
  image: {
    height: 150,
    width: 150,
    borderRadius: 150
  },
  overlayCancelText: {
    color: '#08FF08',
    fontWeight: '900'
  },
  textInputStyle: {
    backgroundColor: '#f3f3f3',
    width: 300,
    padding: 10,
    paddingLeft: 14,
    fontSize: 15,
    borderRadius: 14,
    marginBottom: 40,
    marginTop: 10,
  },
  viewPassword: {
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    borderColor: '#f3f3f3',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    paddingRight: 10,
    borderRadius: 14,
    width: 300,
  },
  password: {
    padding: 10,
    paddingLeft: 14,
    fontSize: 15,
    flex: 1
  },
  title: {
    paddingTop: 25,
    paddingVertical: 5,
    paddingHorizontal: 5
  },
  titleText: {
    color: 'gray',
    fontWeight: '700'
  },
  btnView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 10,
    paddingVertical: 10
  },
  btnText: {
    display: 'flex',
    flex: 1,
    fontSize: 15
  }
});
