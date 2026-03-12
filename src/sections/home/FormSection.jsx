import Star from '../../assets/svg/star.svg?react'
import FormField from '../../components/ui/FormField'
import { formFields } from './formFields'
import { useState } from 'react'


export default function FormSection() {

    const [formValues, setFormValues] = useState(
        formFields.reduce((acc, field) => ({ ...acc, [field.id]: '' }), {})
    )

    const handleChange = (id, value) => {
        setFormValues(prev => ({ ...prev, [id]: value }))
    }

    const requiredFields = formFields.filter(f => f.required).map(f => f.id)
    const isComplete = requiredFields.every(id => {
    const value = formValues[id]
    if (value === null || value === undefined) return false
    if (typeof value === 'string') return value.trim() !== ''
        return true
    })

    return (
        <form className="flex flex-col gap-4 mt-4 w-full px-4 pb-10">
            <div className="flex gap-2 items-center font-display font-medium text-[#828282] text-[10px] py-3">
                <p>Fields tagged with this star are required</p>
                <Star className="size-3" />
            </div>
            <div className="flex flex-col gap-4">
                {formFields.map((field) => (
                    <FormField key={field.id} {...field} onChange={handleChange}/>
                ))}
            </div>
            <button 
                type='submit' 
                id='submitForm' 
                disabled={!isComplete}
                className={`font-display h-10 w-full text-sm font-semibold border transition-colors
                ${isComplete
                    ? 'text-[#000000] border-[#033B21] bg-[#1DDF85] cursor-pointer'
                    : 'text-[#999999] border-[#D2E1DA] bg-[#E9ECEB] cursor-not-allowed'
                }`}
                >
                Submit
            </button>
        </form>
    )
}