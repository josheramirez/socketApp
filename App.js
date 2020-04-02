
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  Alert
} from 'react-native';
import SocketIOClient from 'socket.io-client/dist/socket.io.js'
import Geolocation from '@react-native-community/geolocation';
import axios from "axios";


export default class App extends React.Component{
  constructor(props){
    super(props);
    this.socket = SocketIOClient('http://192.168.0.14:3000');


    this.socket.emit("join", {
      userId: "joshe_movil"
    });



    // this.socket.emit("mensaje","mensaje_movil");

    //bind the functions
    this._sendPing = this._sendPing.bind(this);
    this._getReply = this._getReply.bind(this);

    this.socket.on('msj_to_all', (data)=>{
      console.log("msj_to_all: "+data);
      // io.emit('msj_server_to_client',"mensaje recibido por el server");
    });

    this.socket.on('msj_server_to_all', (data)=>{
      console.log("mesaje enviado por server: "+data);
      // io.emit('msj_server_to_client',"mensaje recibido por el server");
      this.setState({data:data})
    });

    this.state={
      data:null,
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      userDetails : {
        civilianId: null,
        location: {
            address: "Indiranagar, Bengaluru, Karnataka 560038, India",
            latitude: 12.9718915,
            longitude: 77.64115449999997
        }
      }
      
    };

  
  }

  getUserDetailsFromServer(userId){
    try {  
    axios
        .get("http://192.168.0.13:8080/users")
        .then(response => {
        const posts = response;
        // setPosts(posts);
        console.log(JSON.stringify(response.data));
      }).catch(function(error) {
        console.log(error);
      });
    }catch(error){
      console.log(err);
    }
  }

  postUserDetails(userDetails){

     console.log(userDetails);
    // try {
    // axios({
    //   method: "put",
    //   url: "http://192.168.0.13:8080/users",
    //   data: userDetails,
    //   config: { headers: { "Content-Type": "multipart/form-data" } }
    // })
    // .then(response => {
    //   callback();
    // })
    // .catch(function(error) {
    //   console.log("hay error en el catch de axios");
    // });
    // }catch(error){
    //   console.log(err);
    // }
  }

  watchID: ?number = null;
  componentDidMount() {
    Geolocation.getCurrentPosition(
      position => {
        const initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
      },
      error => Alert.alert('Error', JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
    this.watchID = Geolocation.watchPosition(position => {
      const lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
      postUserDetails({"id":1,"password":"zerotraxu","latitude":this.state.location.latitude,"longitude":this.state.location.longitude})
      console.log("ultima posicicon: "+this.state.lastPosition)
    });
  }
  
  componentWillUnmount() {
    this.watchID != null && Geolocation.clearWatch(this.watchID);
  }

  _sendPing(data){
    //emit a dong message to socket server
    console.log('enviando al servidor: '+data);
    // this.socket.emit('msj_client_to_server',this.state.data);
}

  _getReply(data){
    //get reply from socket server, log it to console
    console.log('Reply from server:' + data);
}

_enviar(data){
  //emit a dong message to socket server
  console.log('enviando al servidor: '+data.lat);
  this.socket.emit('msj_client_to_server',data);
}

sendTo(data){
  //emit a dong message to socket server
  data.reciver="3oZtjbbyWUmT1JdTAAAF";
  console.log('enviando al servidor: '+JSON.stringify(data));
  // this.socket.emit('msj_client_to_client',data);
  this.socket.emit('userUpdateLocation',data);
}


  render(){
    return(
      <View style={styles.container}>
        <Text>
          {this.state. initialPosition}
        </Text>
        <Button
          title="ENVIAR AL SERVER"
          onPress={()=>{
            // this.sendTo({long:33.3,lat:22.4});
            this.getUserDetailsFromServer("1");
          }
          }
        />
        <Text>
          {this.state.lastPosition}
        </Text>
      </View>
    )
  }
}

const styles= StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  }
})
