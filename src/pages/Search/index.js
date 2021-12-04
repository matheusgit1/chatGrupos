import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Keyboard,
  FlatList
} from 'react-native';

import {auth, firestore, database, firebase} from '../../services/firebase'
import { useIsFocused } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';

import ChatList from '../../components/ChatList';

export default function Search() {
  const isFocused = useIsFocused();

  const [input, setInput] = React.useState('');
  const [user, setUser] = React.useState(null);
  const [chats, setChats] = React.useState([]);

  React.useEffect(() => {

    const hasUser = auth.currentUser ? auth.currentUser.toJSON() : null;
    setUser(hasUser);


  }, [isFocused]);


  const handleSearch = async (e) =>{
    if(input === '') return;

    const responseSearch = await firestore.collection('MESSAGE_THREADS')
    .where('name', '>=', input)
    .where('name', '<=', input + '\uf8ff')
    .get()
    .then( (querySnapshot) => {

      const threads = querySnapshot.docs.map( documentSnapshot => {
        return{
          _id: documentSnapshot.id,
          name: '',
          lastMessage: { text: '' },
          ...documentSnapshot.data()
        }
      })

      setChats(threads);
      console.log(threads)
      setInput('');
      Keyboard.dismiss();

    }).catch((error)=>{
      console.log(error)
    })

  }

 return (
   <SafeAreaView style={styles.container}>
     <View style={styles.containerInput}>
      <TextInput
        placeholder="Digite o nome da sala?"
        value={input}
        onChangeText={ (text) => setInput(text) }
        style={styles.input}
        autoCapitalize={"none"}
      />
      <TouchableOpacity style={styles.buttonSearch} onPress={()=>handleSearch()}>
        <AntDesign name="search1" size={30} color="#fff" />
      </TouchableOpacity>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={chats}
        keyExtractor={ item => item._id}
        renderItem={ ({ item }) => <ChatList data={item} userStatus={user} /> }
      />


     
   </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#FFF'
  },
  containerInput:{
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 14,
  },
  input:{
    backgroundColor: '#EBEBEB',
    marginLeft: 10,
    height: 50,
    width: '80%',
    borderRadius: 4,
    padding: 5,
  },
  buttonSearch:{
    backgroundColor: '#75dc5e',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: '15%',
    marginLeft: 5,
    marginRight: 10,
  }
})