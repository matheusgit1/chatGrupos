import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import { firebase, firestore, auth, database } from '../../services/firebase'

console.disableYellowBox = true;


function ModalNewRoom({ setVisible, setUpdateScreen }) {

  const [roomName, setRoomName] = useState('');
  const user = auth.currentUser.toJSON();

  const handleButtonCreate = async () => {
    if (roomName === '') return;
    //deixar cada usuario criar 15 salas maximo
    await firestore.collection('MESSAGE_THREADS').get().then((snapshot)=>{
      let myThreads = 0
      snapshot.docs.map(docItem => {
        if(docItem.owner == user.uid){
          myThreads++
        }
      })

      if(myThreads >=15){
        Alert.alert("Você atingiu o numero de grupos por usuario")
        return;
      }

    }).catch((error)=>{

    })
    createRoom();
  }

  // Criar nova sala no firestore (banco do firebase)
  const createRoom = async (e) => {

    try {
      firestore.collection('MESSAGE_THREADS').add({
        name: roomName,
        owner: user.uid,
        lastMessage: {
          text: `Grupo ${roomName} criado. Bem vindo(a)!`,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        }
      })
      .then((docRef) => {
          docRef.collection('MESSAGES').add({
          text: `Grupo ${roomName} criado. Bem vindo(a)!`,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          system: true,
        })
        .then(() => {
          setVisible();
          setUpdateScreen();
        })
      })
      .catch((err) => {
        console.log(err);
      })

    } catch (e) {

      console.error("Error adding document: ", e);

    }

  }

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={setVisible}>
        <View style={styles.modal}></View>
      </TouchableWithoutFeedback>

      <View style={styles.modalContent}>
        <Text style={styles.title}>Criar um novo Grupo?</Text>
        <TextInput
          value={roomName}
          onChangeText={(text) => setRoomName(text)}
          placeholder="Nome para sua sala?"
          style={styles.input}
        />

        <TouchableOpacity style={styles.buttonCreate} onPress={handleButtonCreate}>
          <Text style={styles.buttonText}>Criar sala</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={setVisible}>
          <Text>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ModalNewRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(34, 34, 34, 0.4)'
  },
  modal: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 15,
  },
  title: {
    marginTop: 14,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 19,
  },
  input: {
    borderRadius: 4,
    height: 45,
    backgroundColor: '#DDD',
    marginVertical: 15,
    fontSize: 16,
    paddingHorizontal: 5,
  },
  buttonCreate: {
    borderRadius: 4,
    backgroundColor: '#75dc5e',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#FFF'
  }
})