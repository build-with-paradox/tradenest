export interface UserInterface{ 
    username: String;
    email: String;
    password: String
}

export interface CreateUserResponseInterface {
    success: boolean;
    message: string;
}
  
export interface UserProfileInterface{ 
    username: string;
    email:string;
    phone:string;
    address:string;
}