const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userExample = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    pawword: {
        type: String,
        required: true,
    },
    createdAt: {
        typr: Date,
        default: Date.now
    }
})