import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDb from "../../../connectDb";
import bcrypt from 'bcryptjs'
import User from "../../../models/User";


// custom function for role based authentication
// 1. patient login function
const userLogin = async (email, password) => {
  const findUser = await User.findOne({ email: email })

  if (findUser) {
    if (bcrypt.compareSync(password, findUser.password)) {
      return {
        id: findUser._id.toString(),
        name: findUser.name,
      }
    }
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        connectDb();

        const { email, password } = credentials;

        return userLogin(email, password)
      },
    }),

  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    // add mongoose user ID and user role to the session as well
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
});

export { handler as GET, handler as POST };
