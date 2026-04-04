const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: {type: String, required: true, unique: true},
    birth: {type: Date, required: true},
    address: {type: String, required: true},
    gender: {type: String, required: true},
    contact: {type: Number, required: true},
    password: { type: String, required: true },
    
    DocumentHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document"
    }],
    ChatHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    }]
})

const User = mongoose.models.User || mongoose.model('User', UserSchema)
export default User;
