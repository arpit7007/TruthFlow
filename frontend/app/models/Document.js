const mongoose = require('mongoose')

const DocumentSchema = new mongoose.Schema({
    note: { type: String, required: true},
    report: { type: mongoose.Schema.Types.Mixed }
})

const Document = mongoose.models.Document || mongoose.model('Document', DocumentSchema)
export default Document;