import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import connectToDatabase from '../../../lib/mongodb';
import User from '../../../models/db/user';


export default async function signup(req: NextApiRequest, res: NextApiResponse) {
    const { name, email, password } = req.body;
console.log("connecting to db")
    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
    });

   let result = await newUser.save();
console.log("user saved ${result}")
    return res.status(201).json({ message: 'User registered successfully' });
}
