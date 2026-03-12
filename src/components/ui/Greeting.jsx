

export default function Greeting({ hour }){

    const greeting = 
        hour < 12 ? "Good Morning":
        hour < 18 ? "Good Afternoon":
        "Good Evening"

    return(
        <h1 className="font-body font-semibold text-3xl capitalize">{greeting}</h1>
    )
}