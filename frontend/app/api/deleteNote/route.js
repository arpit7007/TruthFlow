import connectDb from "../../connectDb";
import User from "../../models/User";
import Document from "../../models/Document";

export async function POST(request) {
    const searchParams = request.nextUrl.searchParams;
    const noteId = searchParams.get('noteId');
    console.log(noteId)

    await connectDb();

    const deletedDocument = await Document.findByIdAndDelete(noteId);

    if (deletedDocument) {
        await User.updateMany(
            { DocumentHistory: noteId },
            { $pull: { DocumentHistory: noteId } }
        );
        return Response.json({ docId: deletedDocument?._id ?? null }, {status: 200});
    }else{
        return Response.json({ message: "not able to delete" }, {status: 409});
    }

}