import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "./config";
import Toast from "react-native-toast-message";

// Helper → convert expo-image-picker asset to RN FormData file object
const toFile = (img) => {
    if (!img) return null;

    return {
        uri: img.uri,
        name: img.fileName || `photo_${Date.now()}.jpg`,
        type: img.mimeType || "image/jpeg",
    };
};

export async function addPhotos({ img0, img1, img2, img3, img4, img5 }) {
    try {
        const token = await AsyncStorage.getItem("token");
        
        const form = new FormData();
        
        if (img0) form.append("img0", toFile(img0));
        if (img1) form.append("img1", toFile(img1));
        if (img2) form.append("img2", toFile(img2));
        if (img3) form.append("img3", toFile(img3));
        if (img4) form.append("img4", toFile(img4));
        if (img5) form.append("img5", toFile(img5));
        
        const response = await axios.post(
            config.BASE_URL + "/photos/addPhotos",
            form,
            {
                headers: {
                    token,
                    "Content-Type": "multipart/form-data"

                },
            }
        );
        return response.data;
    } catch (error) {
        console.log("addPhotos error:", error);
        Toast.show({ type: "error", text1: "Photo upload failed" });
        return null;
    }
}

export async function fetchPhotos() {
    try {
        const token = await AsyncStorage.getItem("token");

        const response = await axios.get(
            config.BASE_URL + "/photos/userphotos",
            { headers: { token } }
        );

        if (response.data.status) {
            return response.data.data;
        }

        return [];
    } catch (error) {
        console.log("fetchPhotos error:", error);
        return [];
    }
}
