import { useEffect, useState } from "react";
import Greeting from "../../components/ui/Greeting";
import Info from "../../components/ui/Info";


export default function TimeSection (){
    const [timeParts,setTimeParts] = useState({time: '', ampm: '', dayContext: '', hour24: 0, minute: 0});

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hour24 = now.getHours();

            const formatter = new Intl.DateTimeFormat('en-US', {
                hour: "numeric",
                minute: "2-digit",
                hour12: true
            })

            const parts = formatter.formatToParts(now);

            const hour = parts.find(p => p.type === 'hour').value;
            const minute = parts.find(p => p.type === 'minute').value;
            const dayPeriod = parts.find(p => p.type === 'dayPeriod').value;

            const dayName = new Intl.DateTimeFormat('en-US', {
                weekday: 'long'
            }).format(now);

            let timeOfDay = 'night'
            if(hour24 >= 5 && hour24 < 12) timeOfDay = 'morning';
            else if(hour24 >= 12 && hour24 < 17) timeOfDay = 'afternoon';
            else if(hour24 >= 17 && hour24 < 21) timeOfDay = 'evening';

            setTimeParts({
                time: `${hour}:${minute}`,
                ampm: dayPeriod,
                hour24,
                dayContext: `${dayName} ${timeOfDay}`,
                minute: now.getMinutes(),
                dayName
            })
        }
        
        updateTime();
        const interval = setInterval(updateTime, 1000);

        return ()=> clearInterval(interval)
    }, [])

    return(
        <section className="flex flex-col gap-4 pt-10 px-4">
            <Greeting hour ={timeParts.hour24}/>
            <div className="flex flex-col font-body text-[#423A0C]">
                <div className="flex justify-center w-full p-10 bg-[#FFF098]">
                    <div className="flex items-end">
                        <span className="text-6xl font-semibold">{timeParts.time}</span> 
                        <span className="text-2xl">{timeParts.ampm}</span> 
                    </div>
                </div>
                <div className="flex justify-center py-3 px-10 bg-[#FFE654]">
                    <p className="text-xl">This <span className="text-xl font-bold">{timeParts.dayContext}</span></p> 
                </div>
            </div>
            <div className="flex flex-col gap-1 font-display text-[#606060]">
               <h2 className="font-medium">Welcome to Church</h2> 
               <p>Fill out the form below to mark your attendance.</p>
            </div>
            <Info hour24={timeParts.hour24} minute={timeParts.minute} dayName={timeParts.dayName} />
        </section>
    )
}