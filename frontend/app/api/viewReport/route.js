import connectDb from "../../connectDb";
import User from "../../models/User";
import Document from "../../models/Document";

import { encrypt, decrypt } from "../../utils/crypto"

export async function GET(request) {
    await connectDb();

    const searchParams = request.nextUrl.searchParams;
    const docId = searchParams.get('docId')

    console.log(docId)

    const document = await Document.findById(docId);

    return Response.json({ data: decrypt(document.report) });

}