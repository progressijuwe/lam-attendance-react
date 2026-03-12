import glass from '../../assets/images/glass.png'

export default function ConfirmationSection(){


    return(
        <section className="mt-10 px-4">
            <div className="border-4 border-[#A8941F] p-4 flex flex-col gap-4">
                <div className="flex flex-col gap-4 py-[33.5px] px-4 items-center border border-[#D2E1DA]">
                    <p className="font-display text-sm text-black">Your attendance has been recorded</p>
                    <h1 className="font-body text-xl font-semibold">John Okor</h1>
                </div>
                <div className="py-7.5 flex flex-col items-center gap-4">
                    <img src={glass} alt='Celebration Glass Image' />
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-base text-[#423A0C] font-display font-semibold text-center'>Enjoy the service</h2>
                        <p className='text-center text-[#828282] text-xl font-display font-semibold'>And may your service be unto the Lord!!!</p>
                    </div>
                </div>
            </div>
        </section>
    )
}