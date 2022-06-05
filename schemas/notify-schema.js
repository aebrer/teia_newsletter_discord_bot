import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        unique: true
    },
    struct: {
        type: Object,
        required: true
    },
})

export default schema;