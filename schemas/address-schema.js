import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    list: {
        type: String,
        required: true
    }
})

export default schema;