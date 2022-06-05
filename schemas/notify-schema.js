import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        unique: true
    },
    structTeia: {
        type: Object,
        required: true
    },
    structFxhash: {
        type: Object,
        required: true
    }
})

export default schema;