import connectDb from "../../connectDb";
import User from "../../models/User";
import Document from "../../models/Document";

export async function POST(request) {
    const formData = await request.formData();

    await connectDb();

    const text = formData.get("text");
    const docId = formData.get("docId");
    const userId = formData.get("userId")

    // get user details
    const userData = await User.findById(userId);
    console.log(userData)

    const combinedText = `${text}\n${JSON.stringify(userData)}`;
    formData.set("text", combinedText);

    console.log(formData);

    const response = await fetch("http://127.0.0.1:8000/generate-report", {
        method: "POST",
        body: formData
    });

    const data = await response.json();
    console.log(data)


    const updateDocument = await Document.findByIdAndUpdate(
        docId,
        {
            note: text,
            report: data.data
        }, { returnDocument: "after" })

    console.log(updateDocument)

    return Response.json({ data });

}