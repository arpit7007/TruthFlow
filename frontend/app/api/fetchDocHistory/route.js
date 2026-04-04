import connectDb from "../../connectDb";
import User from "../../models/User";
import Document from "../../models/Document"; 

export async function GET(request) {
    await connectDb();

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId')


    console.log(userId)


    const user = await User.findById(userId).populate("DocumentHistory");

    console.log("POPULATED:", user);




    return Response.json({ DocHistory: user.DocumentHistory });

}