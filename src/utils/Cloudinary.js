import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFileOnCloudinary = async (localPathUrl) => {
    try {
        if (!localPathUrl) return null

        const res = await cloudinary.uploader.upload(localPathUrl, {
            resource_type: 'auto'
        })

        fs.unlinkSync(localPathUrl)
        return res;

    } catch (error) {
        fs.unlinkSync(localPathUrl)
        return null
    }
}

export default uploadFileOnCloudinary