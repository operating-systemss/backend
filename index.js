import express from "express"
import psList from "ps-list"
import ps from "ps-node"
import { initializeApp,cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
const app = express();
let list = await psList()

initializeApp({
    credential: cert({
        type: "service_account",
        project_id: "process-f6f96",
        private_key_id: "6dd0940d9515b9da02ea4a2a4fa4c37a0f292991",
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDPFmyHZtPlOfii\nuj3RQLIILZE80TAbGE8EsSdpNb3k6tvA9iPeakKK19QnkKMbFATP016RS8LUUAhf\n5V0uDoYb8hUDmpCUt0Xzijfefq+kP/LtL7/4RcvHAsopG1hwSZR9nvMENONd/FWE\nnIQBglFyCPPVSNiFDByrtCFaCtPWcOJ7jOciRYQf//FUNJO5nYxhuwOY5JdfE3gE\n96oKNAnjkLCBDJNgfqFgNKpC7icpUJM4SKJbpEa+75QJmA4eC2xneM1vPr/9PhBk\nEnvK7CfazCmWxhwIiOiWyiMxlt4QPrZJFDDR+he7+oHi41vz8MCvcxen2qcPYST1\narsuLoxVAgMBAAECggEASpUF40IKYI0fWeP/bYSCWeWnYCLq02dO1h7DVeXwDSj0\nmitLwce9TWnr05AI3jC4huzWKzgA5Bwq1/awN20tqZTnMpQRLC5ReCO4eV5g/aO2\nZuwClHT2rib4DhP2JwKpAxEi7snpdSjy177S4ARCNvK4doE00b4J+WD3fglWP+1j\ntXgVSFEedpMfM+ExMWrd3rhnVCVanISkCLBkoTHs2ShMKnEfHhwLGqye4yzQpMKz\nBw4hTcsU6Zs3WMOEaM977vSfXX/D9ztBoj5aeejPk3lzJiuJo7Lt0+yAUUG96Crs\nKnd+hn4qAD0j7EuMRjfEyCb8IK6bxVsi+PqZDePhxQKBgQD2s83joUphmPH/TGm9\nIJcpAZn8tY5sDwrsOhF+OBc2dSNnbvsUxNy9P2AzedFJpXwdlSsV8TYWIKrN/UkR\nsTWBp07pXj0C03yCcrT9joQ1Zvn/I+2cN5eeje7w64RPVK/JI6NdDEw5Ofyg5O9a\nuxAYcqYT+h5s09YauDROLZJLHwKBgQDW5GoijUPnUndh8LUlNBn+qc2vYwJdOkjF\nQyqpJAx4ND83+BmGgyEdAhWT6Nc8RVpQMvyox3E1VC1805A2ZNUVqe8aBjw3R3YI\n4LHmfFGhpWMjeozAmOUJy3xNKe0gPp/J08M5mGZxQDg1E7HFvqyg6AqQFbKidrsu\noyYRzaJuCwKBgQDhhUDjo+AhE/W1Eh9fOtm0LLid4UKO2bl8dSDkp1Xg/Hge578z\nHztC7Rp+NA/0KQkq6d/3MQfmdnptz+rp93sYSN/ESdewK7CYd0+oso19W+ORL0DZ\nG6DI2qrhJgtPkfUYBDIkr0dG0RF165I6+OIf1z6m6HDDv2rsBhQam2IutQKBgFxk\n5UVp27JQAMh5iEkwt6SJOciZF2EiODuof2Ut/LaKMExOPhtZshkY1lI8IJ7nasdk\nxMGEzyYQxWYQSMc6X2vrHsTfvXA/J371rUfeV/Lae1+7x1zf4Epv1UgQKMZeZrGO\nfTf8UL+Mzx3zE9JkAzFD05bT3XSA/EY3G503/wi1AoGAJ8LViYwTtfzp5DDoHPac\nRqufD8adehrjZwY4/61JDeuTMCRJi1UFf89/hH43IdqsGYkKgHyt+JBIfPD3DTdH\np7sxUfedE8N6KiDPcUdNBGsVn1ewEGba1ZDn7JL/LGV87Nt32bh8w1vvflNL5B9R\nEzIIZ2aSYYwLEarGNMtpvvM=\n-----END PRIVATE KEY-----\n",
        client_email: "firebase-adminsdk-h0mxx@process-f6f96.iam.gserviceaccount.com",
        client_id: "103608160703106211432",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-h0mxx%40process-f6f96.iam.gserviceaccount.com"
      }
      )
});

const db = getFirestore();
let doc = list.filter(i => i.cpu > 0,1);
const docRef = db.collection('data').doc('process');

await docRef.set({ doc }); 


app.get("/process", async (req,res,next) => {
   
    const getData = await db.collection('data').get();
    getData.forEach(doc => {
        let data = doc.data();
        res.send(Object.values(data))
    })
});

app.get("/process/:pid", async (req,res,next) =>{
    const getData = await db.collection('data').doc("process").get();
    if(!getData.exists){
        console.log('no such document!') 
        return; 
    }
    let doc = Object.values(getData.data());
    let pid = req.params.pid;
    let result = doc.filter(i => i.pid == pid)
    res.send(result);
})

app.delete("/process/:pid", async (req,res,next) => {
    ps.kill( parseInt(req.params.pid), async( err ) =>{
        if (err) {
            throw new Error(" process kill error : ", err);
        }
        else {
            console.log( 'Process %s has been killed!');
            let lists = await psList()   
            let doc = lists.filter(i => i.cpu > 0,1);
            const docRef = db.collection('data').doc('process');
            await docRef.set({
                ...doc
            }); 
         }

    });
})

app.listen(3000, ()=> {
    console.log(`server running on ${3000}`)
})