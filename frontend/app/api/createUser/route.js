import connectDb from "../../connectDb";
import bcrypt from 'bcryptjs'
import User from "../../models/User";

export async function POST(request) {
    const body = await request.json();

    console.log(body);

    await connectDb();

    try{
        const {name, email, birth, address, gender, contact, password} = body

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const newUser = await User.create({
            name: name,
            email: email,
            birth: birth,
            address: address,
            gender: gender,
            contact: contact,
            password: hash
        })

        return new Response(JSON.stringify({ newUser }), {status: 200})
    }catch(err){
        console.log("not able to create user ERR:  ", err);
        return new Response(JSON.stringify({ message: "not able to create user"}), {status: 500})
    }

}