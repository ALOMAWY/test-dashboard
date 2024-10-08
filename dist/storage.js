import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";
const firebaseConfig = {
    apiKey: "AIzaSyAQmrPfxjnuUA__bkqzZF-gsj4F1JLNoOg",
    authDomain: "test-d09cc.firebaseapp.com",
    projectId: "test-d09cc",
    storageBucket: "test-d09cc.appspot.com",
    messagingSenderId: "546762745938",
    appId: "1:546762745938:web:f33924bbf13e82ddd6d78b",
    measurementId: "G-4S9NPQVMK6",
};
const storage = getStorage();
export async function uploadImageAsInputFileRespownse(image) {
    const file = image;
    if (!file)
        return;
    const storageRef = ref(storage, "images/" + file.name);
    await uploadBytes(storageRef, file);
    return file.name;
}
export async function getImageByName(imageName) {
    const storageRef = ref(storage, `images/${imageName}`);
    const imageLink = await getDownloadURL(storageRef);
    console.log(imageLink);
    return imageLink;
}
export async function deleteImageFromDb(imageName) {
    const desertRef = ref(storage, `images/${imageName}`);
    try {
        await deleteObject(desertRef);
        console.log("The Image Has Deleted");
    }
    catch (error) {
        console.log("Some One Has Error", error);
    }
}
export async function deleteAllImagesFromDb(arrayOfImagesName) {
    arrayOfImagesName.forEach((imageName) => deleteImageFromDb(imageName));
}
