import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Modal,
  ActivityIndicator,
  FlatList,
  Alert
} from 'react-native';

import { auth, firestore, database} from '../../services/firebase'

import { useNavigation, useIsFocused } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import FabButton from '../../components/FabButton';
import ModalNewRoom from '../../components/ModalNewRoom'
import ChatList from '../../components/ChatList'

export default function ChatRoom() {

  const userAuth = auth.currentUser;
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [user, setUser] = React.useState(null);
  
  const [threads, setThreads] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [updateScreen, setUpdateScreen] = React.useState(false)

  React.useEffect(() => {
    const hasUser = userAuth ? userAuth.toJSON() : null;
   // console.log(hasUser);
    setUser(hasUser);
  }, [isFocused]);

  const handleSignOut = async (e) => {
 
    await auth.signOut().then(() => {
      setUser(null)
      navigation.navigate("SignIn")
    })
      .catch(() => {
        console.log("NAO POSSUI NENHUM USUARIO")
      })
  }

  React.useEffect(()=>{
    let isActive = true;

    function getChats(){
      firestore.collection('MESSAGE_THREADS').orderBy('lastMessage.createdAt', 'desc').limit(10).get().then((snapshot)=>{
        const threads = snapshot.docs.map( documentSnapshot => {
          return {
            _id:  documentSnapshot.id,
            name: '',
            lastMessage: { text: '' },
            ...documentSnapshot.data()
          }
        })

        if(isActive){
          setThreads(threads);
          setLoading(false);
          console.log(threads)
        }
      })
    }

    getChats();

    return () => {
      isActive = false;
    }

  }, [isFocused, updateScreen]);
  
  
  const deleteRoom = async (ownerId, idRoom) => {
    // Se o cara que está tentando deletar nao é dono dessa sala.
    if(ownerId !== user?.uid) return;

    Alert.alert(
      "Atenção!",
      "Você tem certeza que deseja deletar essa sala?",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => handleDeleteRoom(idRoom)
        }
      ]
    )

  }


  const handleDeleteRoom = async (idRoom) => {
    try{
      await firestore.collection('MESSAGE_THREADS').doc(idRoom).delete();
      setUpdateScreen(!updateScreen);
    }catch(e){
      console.log("error")
    }
  }

  if(loading){
    return(
     <ActivityIndicator size="large" color="#555" />
    )
  }


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRoom}>
        <View style={styles.headerRoomLeft}>
          {user && (
            <TouchableOpacity onPress={handleSignOut}>
              <AntDesign name="arrowleft" size={28} color="#FFF" />
            </TouchableOpacity>
          )}

          <Text style={styles.title}>Grupos</Text>
        </View>

        <TouchableOpacity onPress={ () => navigation.navigate("Search") }>
          <AntDesign name="search1" size={24} color="#fff" />
        </TouchableOpacity>

      </View>

      <FlatList
        data={threads}
        keyExtractor={ item => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={ ({ item }) => (
          <ChatList data={item} deleteRoom={ () => deleteRoom(item.owner, item._id) } userStatus={user}  />
        )}
     />

      <FabButton setVisible={() => setModalVisible(true)} userStatus={user} />

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <ModalNewRoom setVisible={() => setModalVisible(false)} setUpdateScreen = {()=>setUpdateScreen(!updateScreen)} />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRoom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#379c0b',
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },
  headerRoomLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
    paddingLeft: 10,
  }
})