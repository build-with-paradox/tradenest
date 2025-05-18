export interface UserInterface{ 
    username: string;
    email: string;
    password: string
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