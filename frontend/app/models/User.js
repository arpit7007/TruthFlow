const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: {type: String, required: true, unique: true},
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
