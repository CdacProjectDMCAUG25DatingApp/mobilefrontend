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

export const addPhotos = async (imgObj,token) => {
    try {

        const formData = new FormData();

        for (let i = 0; i < 6; i++) {
            const img = imgObj[`img${i}`];

            if (!img || !img.uri) {
                throw new Error(`Missing img${i}`);
            }

            formData.append("photos", {
                uri: img.uri,
                name: `photo${i}.jpg`,
                type: "image/jpeg",
            });
        }

        const res = await axios.post(
            config.BASE_URL + "/photos/upload",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    token: token,
                },
            }
        );

        return res.data;

    } catch (err) {
        console.log("UPLOAD ERROR:", err);
        return null;
    }
};


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
