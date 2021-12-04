import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import { useNavigation }  from '@react-navigation/native'
import MaskedView from "@react-native-community/masked-view";
import LinearGradient from "react-native-linear-gradient";
/**------------------------------ */
import {auth, firebase, firestore, database} from '../../services/firebase';

export default function SignIn() {

  const navigation = useNavigation();

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [confirmeEmail, setConfirmeEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmePassword, setConfirmePassword] = React.useState('');

  const [textNameAlert, setTextNameAlert] = React.useState('');
  const [textEmailAlert, setTextEmailAlert] = React.useState('');
  const [textConfirmeEmailAlert, setTextConfirmeEmailAlert] = React.useState('');
  const [textPasswordAlert, setTextPasswordAlert] = React.useState('');
  const [textConfirmePasswordAlert, setTextConfirmePasswordAlert] = React.useState('');

  const [typeInscrition, setTypeInscrition] = React.useState(false); //false (login) //true (new acount)
  const [loading, setLoading] = React.useState(false);

  const validateInscrition = async (e) => {
 

    if (typeInscrition && name != "" && email == confirmeEmail && password == confirmePassword) {
      //make something (create acount)
      console.log("na função")
      setLoading(true)
      await auth.createUserWithEmailAndPassword(email, password).then((user) => {
        user.user.updateProfile({
          displayName: name
        })
        .then(()=>{
          navigation.navigate("ChatRoom");
        })
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('Email já em uso!');
        }
    
        if (error.code === 'auth/invalid-email') {
          console.log('Email invalido!');
        }
        console.log(error)
      })
      setLoading(false)
    }

    if(typeInscrition==false && email != "" && password !=""){
      //make something (make login
      console.log("na função")
      setLoading(true)
      await auth.signInWithEmailAndPassword(email, password).then(()=>{
        navigation.goBack();
      })
      .catch((error)=>{
        if (error.code === 'auth/invalid-email') {
          console.log('Email invalido!');
        }
      })
      
      setLoading(false)
      console.log("fazer login")
    }
  }

  return (
    
      <SafeAreaView style={styles.container}>

        <Text style={styles.logo}>GroupChats</Text>
        <Text style={{ marginBottom: 20 }}>Ajude, colabore, faça seu networking!</Text>

        {typeInscrition ? (
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={(text) => setName(text)}
            placeholder="Qual seu nome?"
            placeholderTextColor="#99999B"
          />
        ) : null}
        {textNameAlert != '' ? <Text style={styles.alert}>{textNameAlert}</Text> : null}




        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="Seu email"
          placeholderTextColor="#99999B"
        />
        {
          textEmailAlert != '' ? <Text style={styles.alert}>{textEmailAlert}</Text> : null
        }

        {typeInscrition ? (
          <TextInput
            style={styles.input}
            value={confirmeEmail}
            onChangeText={(text) => setConfirmeEmail(text)}
            placeholder="confirme seu email"
            placeholderTextColor="#99999B"
          />
        ) : null}

        {
          textConfirmeEmailAlert != '' ? <Text style={styles.alert}>{textConfirmeEmailAlert}</Text> : null
        }

        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="Sua senha"
          placeholderTextColor="#99999B"
          secureTextEntry
        />
        {
          textPasswordAlert != '' ? <Text style={styles.alert}>{textPasswordAlert}</Text> : null
        }

        {typeInscrition ? (
          <TextInput
            style={styles.input}
            value={confirmePassword}
            onChangeText={(text) => setConfirmePassword(text)}
            placeholder="Confirme sua senha"
            placeholderTextColor="#99999B"
            secureTextEntry
          />
        ) : null}
        {
          textConfirmePasswordAlert != '' ? <Text style={styles.alert}>{textConfirmePasswordAlert}</Text> : null
        }


        <TouchableOpacity style={[styles.buttonLogin, {backgroundColor: typeInscrition ? 'red':'#75dc5e'}]} onPress={(e) => validateInscrition(e)}>
          <Text style={styles.buttonText}>
            {loading ? <ActivityIndicator size={"small"} color="#fff"/> : ((!typeInscrition && !loading )? "Acessar" :  "criar conta")}
            
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={(e) => setTypeInscrition(!typeInscrition)}>
          <Text>
            {!typeInscrition ? "criar umar conta" : "Acessar"}
          </Text>
        </TouchableOpacity>

      </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFF',
    tintColor: '#75dc5e',
    color: '#75dc5e'
  },
  alert: {
    color: 'red',
    fontSize: 12,
    marginBottom: 7,
  },
  logo: {
    marginTop: Platform.OS === 'android' ? 35 : 80,
    fontSize: 28,
    fontWeight: 'bold'
  },
  input: {
    color: '#121212',
    backgroundColor: '#EBEBEB',
    width: '90%',
    borderRadius: 6,
    marginBottom: 10,
    paddingHorizontal: 8,
    height: 50,
  },
  buttonLogin: {
    width: '90%',
    backgroundColor:'#121212',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 19
  }
})