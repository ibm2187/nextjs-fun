import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/db/user';
import jwt from 'jsonwebtoken';
import LoginResponse from '../../../models/response/login'
import { json } from 'stream/consumers';

export default async function login(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = req.body;

    await connectToDatabase();

    const existingUser = await User.findOne({ email });


    if (!existingUser) {
        return res.status(400).json({ message: 'password or email are incorrect' });
    }

    console.log("user does not exist")

    const validLogin = await bcrypt.compare(password, existingUser.password)

    if (!validLogin) {
        return res.status(400).json({ message: 'password or email are incorrect' });
    }

    console.log("user does not exis2t")


    const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    const loginResponse = new LoginResponse(
        existingUser.name,
        existingUser.email,
        token
    )

    console.log("uresult!", existingUser)

      
      console.log("uresult!", loginResponse); // Log the actual object
      
      return res.status(200).json(loginResponse); // Directly return the object

}
