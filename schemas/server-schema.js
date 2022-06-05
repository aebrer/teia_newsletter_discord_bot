import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    channel: {
        type: String,
        required: true
    }
})

export default schema;