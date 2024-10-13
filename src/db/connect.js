import mongoose from 'mongoose';
import { DATA_BASE_NAME } from '../constants.js';

export const dbConnect = async() => {
    try {
        await mongoose.connect(`${process.env.DATA_BASE_URI}/${DATA_BASE_NAME}`)
    } catch (error) {
        console.log(`${error} while connecting database!`)
    }
}