"use client"

import { AuthContextType } from "@/types/authTypes";
import { createContext } from "react";


const AuthContext = createContext<AuthContextType | undefined>(undefined);


export default AuthContext