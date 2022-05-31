import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    structTeia: {
        type: String,
        required: true
    },
    structFxhash: {
        type: String,
        required: true
    }
})

export default schema;