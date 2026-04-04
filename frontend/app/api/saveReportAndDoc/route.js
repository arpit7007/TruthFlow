import connectDb from "../../connectDb";
import User from "../../models/User";
import Document from "../../models/Document";
import { encryptData } from "../../utils/encryption";

export async function POST(request) {
    const formData = await request.formData();

    await connectDb();

    const text = formData.get("text");
    const userId = formData.get("userId");

    // get user details
    const userData = await User.findById(userId);
    console.log(userData)

    console.log(formData);

    formData.append("userData", JSON.stringify(userData));

    const response = await fetch("http://127.0.0.1:8000/generate-report", {
        method: "POST",
        body: formData
    });

    const data = await response.json();
    console.log("-------------------------------------------")
    console.log(data)


    const createDocument = await Document.create({
        note: encryptData(text),
        report: encryptData(data.data)
    })

    const updateUserHistory = await User.findByIdAndUpdate(userId, { $push: { DocumentHistory: createDocument._id } });


    return Response.json({ data: data, docId: createDocument._id });

}