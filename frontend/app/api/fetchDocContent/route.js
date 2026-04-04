import connectDb from "../../connectDb";
import User from "../../models/User";
import Document from "../../models/Document";
import { encrypt, decrypt } from "../../utils/crypto"

export async function GET(request) {
    await connectDb();

    const searchParams = request.nextUrl.searchParams;
    const docId = searchParams.get('docId')
    console.log("THIS IS THE DOCUMENT ID: ", docId)

    const document = await Document.findById(docId);
    console.log("THIS IS THE DOCUMENT CONTENT: ", document)

    if (document) {
        document.note = decrypt(document.note);
        document.report = decrypt(document.report);
    }

    return Response.json({ document: document });

}