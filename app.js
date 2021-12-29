
import { initializeApp } from 'firebase/app';
import { getDatabase , ref, set , onValue } from "firebase/database";
import psList from "ps-list"
import express from 'express'
import { createServer } from "http"
import { Server } from "socket.io"

const app = express();
const server = createServer(app);
const socketio = new Server(server);


const firebaseConfig = {
  apiKey: "AIzaSyBtnpZJVgkykipjGWBL9qYtJLOwO_91i1Y",
  authDomain: "process-f6f96.firebaseapp.com",
  databaseURL: "https://process-f6f96-default-rtdb.europe-west1.firebasedatabase.app",
  storageBucket: "process-f6f96.appspot.com",
};
let list = await psList();
const doc_true = list.filter(i => i.cpu > 0,1);
const doc_false = list.filter(i => i.cpu === 0);

const appp = initializeApp(firebaseConfig);
const db = getDatabase(appp);

server.listen(3000 , ()=> {
    console.log(" server is running ")
})

socketio.on('connection', (socket) => {
    console.log('connected and ready')
    set(ref(db, 'process/'), {
        doc_true,
        doc_false
    });
})