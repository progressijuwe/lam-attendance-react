import { Link } from "react-router-dom"


export default function Greeting({ hour }){

    const greeting = 
        hour < 12 ? "Good Morning":
        hour < 18 ? "Good Afternoon":
        "Good Evening"

    return(
        <div className="flex justify-between items-center">
            <h1 className="font-body font-semibold text-3xl capitalize">{greeting}</h1>
            <Link to='/login' className="text-sm font-display p-2 border border-green-700 text-green-700">Admin Login</Link>
        </div>
    )
}