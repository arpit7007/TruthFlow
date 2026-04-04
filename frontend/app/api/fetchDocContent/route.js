import connectDb from "../../connectDb";
import User from "../../models/User";
import Document from "../../models/Document";
import { decryptData } from "../../utils/encryption";

export async function GET(request) {
    await connectDb();

    const searchParams = request.nextUrl.searchParams;
    const docId = searchParams.get('docId')
console.log("THIS IS THE DOCUMENT ID: ", docId)

    
    
    const document = await Document.findById(docId).lean();
    console.log("THIS IS THE DOCUMENT CONTENT: ", document)

    if (document) {
        if (document.note) document.note = decryptData(document.note);
        if (document.report) document.report = decryptData(document.report);
    }

    return Response.json({ document: document });

}