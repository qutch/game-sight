import { useState, useEffect } from "react";
import steamLogo from "./assets/steam-logo.png";
import "./index.css";

function LoginComponent() {
    return (
        <>
            <div>
                <h1 class="text-blue-500">Login Page</h1>
                <a class="
                flex flex-row items-center justify-center
                gap-3 px-6 py-3 bg-slate-700 hover:bg-slate-600
                rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl w-80"
                href="/auth/steam/login"
                >
                        <img src={steamLogo} class="w-8 h-8 brightness-0 invert"/>
                        <p class="text-lg font-semibold text-white">Login with Steam</p>
                </a>
            </div>
        </>
    )
}

export default LoginComponent;