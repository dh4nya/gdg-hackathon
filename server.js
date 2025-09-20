
import express from "express";
import cors from "cors";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const app = express();
app.use(cors()); // allow frontend requests
app.use(express.json());

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC5oOb-HZeVRfDXRnfHyCH5BsUHa2NZDqE",
  authDomain: "gdg-hackathon-66535.firebaseapp.com",
  projectId: "gdg-hackathon-66535",
  storageBucket: "gdg-hackathon-66535.firebasestorage.app",
  messagingSenderId: "101280651224",
  appId: "1:101280651224:web:785c67d2be8b13b8d7c4ad",
  measurementId: "G-GV9RN52HMN"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Endpoint to receive SOS alerts
app.post("/sos", async (req, res) => {
  const { name, message, location } = req.body;
  try {
    await addDoc(collection(db, "sos_alerts"), {
      name,
      message,
      location,
      timestamp: serverTimestamp()
    });
    res.status(200).json({ success: true, message: "SOS alert sent!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error sending SOS alert" });
  }
});

// Get all active alerts (for admin dashboard)
app.get("/alerts", async (req, res) => {
  try {
    const snapshot = await collection(db, "sos_alerts").get();
    const alerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(alerts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching alerts" });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
