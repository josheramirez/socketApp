
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
} from 'react-native';
import SocketIOClient from 'socket.io-client/dist/socket.io.js'



export default class App extends React.Component{
  constructor(props){
    super(props);
    this.socket = SocketIOClient('http://192.168.0.14:3000');

    this.socket.emit("join", {
      userId: "joshe_movil"
    });

    this.socket.emit("mensaje","mensaje_movil");

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
      data:null
    }
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
  this.socket.emit('msj_movil_to_server',data);
}

  render(){
    return(
      <View style={styles.container}>
        <Button
          title="ENVIAR AL SERVER"
          onPress={()=>{this.sendTo({long:33.3,lat:22.4})}}
        />
        <Text>
          {this.state.data}
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
