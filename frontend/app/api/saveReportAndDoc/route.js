import connectDb from "../../connectDb";
import User from "../../models/User";
import Document from "../../models/Document";

export async function POST(request) {
    const formData = await request.formData();

    await connectDb();

    const text = formData.get("text");
    const userId = formData.get("userId");

    console.log(formData);

    const response = await fetch("http://127.0.0.1:8000/generate-report", {
        method: "POST",
        body: formData
    });

    const data = await response.json();
    console.log("-------------------------------------------")
    console.log(data)


    const createDocument = await Document.create({
        note: text,
        report: data.data
    })

    const updateUserHistory = await User.findByIdAndUpdate(userId, { $push: { DocumentHistory: createDocument._id } });


    return Response.json({ data: data, docId: createDocument._id });

}