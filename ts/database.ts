import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
export interface Product {
  id: string;
  type: string;
  imagePath: string;
  imageName: string;
  model: string;
  description: string;
}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQmrPfxjnuUA__bkqzZF-gsj4F1JLNoOg",
  authDomain: "test-d09cc.firebaseapp.com",
  projectId: "test-d09cc",
  storageBucket: "test-d09cc.appspot.com",
  messagingSenderId: "546762745938",
  appId: "1:546762745938:web:f33924bbf13e82ddd6d78b",
  measurementId: "G-4S9NPQVMK6",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(firebaseApp);

let submitForm = document.getElementById("submit-form");

export async function setItemToDb(documentId: string, data: Product) {
  try {
    if (typeof documentId !== "string") {
      throw new TypeError("documentId must be strings");
    }

    const docRef = doc(db, "products", documentId);

    let productHasSetted = await setDoc(docRef, data);

    if (submitForm) {
      submitForm.innerText = "Add New Product";
    }

    return getAllDocuments();
  } catch (error) {
    console.log("Error Adding Document : ", error);
  }
}
export async function getItemFromDb(documentName: string) {
  // Get the document reference
  try {
    const docRef = doc(db, "products", documentName);

    // Fetch the document
    const docSnap = await getDoc(docRef);

    // Check if the document exists
    if (docSnap.exists()) {
      // Get the document data
      console.log("Document data:", docSnap.data());

      return docSnap.data();
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.log("Error Fetching Document ,", error);
  }
}

export async function updateDocument(documentId: string, updatedData: Product) {
  const docRef = doc(db, "products", documentId);

  await updateDoc(docRef, updatedData);

  if (submitForm) {
    submitForm.innerText = "Updated Product";
    setTimeout(() => {
      submitForm.innerText = "Add New Product";
    }, 1000);
  }
}

// getItemToDb("products", "0223");

export async function getAllDocuments() {
  const querySanpshot = await getDocs(collection(db, "products"));

  const docs: Product[] = [];

  if (querySanpshot.empty) {
    return "No Data";
  } else {
    querySanpshot.forEach((document: any) => {
      let doc = document;

      docs.push(doc.data());
    });

    console.log(docs);
    return docs as Product[];
  }
}
export async function deleteDocument(documentName: string) {
  const docRef = doc(db, "products", documentName);

  await deleteDoc(docRef);
}

export async function deleteAllDocuments() {
  let products = (await getAllDocuments()) as Product[];

  products?.forEach((product) => deleteDocument(product.id));
  return [];
}
