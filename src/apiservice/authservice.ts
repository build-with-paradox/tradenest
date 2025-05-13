import { UserInterface, CreateUserResponseInterface } from "@/types/userTypes"
import axios from "axios";
import { formatErrorMessages } from "@/utils/utilfunctions";


export const createUserService = async ({
    username,
    email,
    password
}: UserInterface): Promise<CreateUserResponseInterface> => {
    const signupurl = `${process.env.NEXT_PUBLIC_URL}/api/auth/signup/`

    try {
        const response = await axios.post(
            signupurl,
            { username, email, password },
            { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.status === 201) {
            return { success: true, message: response.data.message };
        } else {
            return {
                success: false,
                message: formatErrorMessages(response.data.error) || 'An unknown error occurred.'
            };
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error('Signup error:', error.response.data);

            return {
                success: false,
                message: formatErrorMessages(error.response.data) || 'Signup failed'
            };
        } else {
            console.error('An error occurred:', error);
            return { success: false, message: 'An error occurred. Please try again later.' };
        }
    }
};


