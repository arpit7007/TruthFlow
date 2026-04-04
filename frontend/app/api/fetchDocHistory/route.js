import connectDb from "../../connectDb";
import User from "../../models/User";
import Document from "../../models/Document";
import { decryptData } from "../../utils/encryption";

export async function GET(request) {
    await connectDb();

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId')


    console.log(userId)


    const user = await User.findById(userId).populate({
        path: "DocumentHistory"
    }).lean();

    console.log("POPULATED:", user);

    if (user && user.DocumentHistory) {
        user.DocumentHistory = user.DocumentHistory.map(doc => {
            if (doc.note) doc.note = decryptData(doc.note);
            if (doc.report) doc.report = decryptData(doc.report);
            return doc;
        });
    }

    return Response.json({ DocHistory: user?.DocumentHistory || [] });

}