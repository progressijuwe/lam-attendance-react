import Star from '../../assets/svg/star.svg?react'
import FormField from '../../components/ui/FormField'
import { formFields } from './formFields'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api'

export default function FormSection() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [formToken, setFormToken] = useState(null)

    const [formValues, setFormValues] = useState(
        formFields.reduce((acc, field) => ({ ...acc, [field.id]: '' }), {})
    )

    useEffect(() => {
        api.get('/api/form-token')
        .then(res => setFormToken(res.data.token))
        .catch(() => setError('Failed to load form. Please refresh the page.'))
    }, [])

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

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
        const formData = new FormData()
        formData.append('first_name', formValues.firstName)
        formData.append('last_name',  formValues.lastName)
        formData.append('department', formValues.department)
        formData.append('live_image', formValues.liveImage)

        await api.post('/api/attendance', formData, {
            headers: { 'X-Form-Token': formToken }
        })

        navigate('/confirmed', {
            state: {
            firstName: formValues.firstName,
            lastName:  formValues.lastName,
            }
        })
        } catch (err) {
        setError('Something went wrong. Please try again.')
        } finally {
        setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4 w-full px-4 pb-10">
        <div className="flex gap-2 items-center font-display font-medium text-[#828282] text-[10px] py-3">
            <p>Fields tagged with this star are required</p>
            <Star className="size-3" />
        </div>
        <div className="flex flex-col gap-4">
            {formFields.map((field) => (
            <FormField key={field.id} {...field} onChange={handleChange} />
            ))}
        </div>
        {error && (
            <p className="text-red-500 text-xs text-center">{error}</p>
        )}
        <button
            type='submit'
            disabled={!isComplete || loading || !formToken}
            className={`font-display h-10 w-full text-sm font-semibold border transition-colors
            ${isComplete && !loading && formToken
                ? 'text-[#000000] border-[#033B21] bg-[#1DDF85] cursor-pointer'
                : 'text-[#999999] border-[#D2E1DA] bg-[#E9ECEB] cursor-not-allowed'
            }`}
        >
            {loading ? 'Submitting...' : 'Submit'}
        </button>
        </form>
    )
}