import connectDb from "../../connectDb";
import User from "../../models/User";
import Document from "../../models/Document";

export async function POST(request) {
    const formData = await request.formData();

    await connectDb();

    const text = formData.get("text");
    const userId = formData.get("userId");

    const userData = await User.findById(userId);
    console.log(userData)


    const createDocument = await Document.create({
        note: text,
    })

    if (userId) {
        await User.findByIdAndUpdate(userId, { $push: { DocumentHistory: createDocument._id } });
    }

    return Response.json({ docId: createDocument._id });
}