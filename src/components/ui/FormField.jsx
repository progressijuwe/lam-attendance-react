import Star from '../../assets/svg/star.svg?react'
import ImageUpload from './ImageUpload'

export default function FormField({ type, id, name, label, required, placeholder, options, onChange }) {
    
    const handleChange = (e) => {
        onChange(id, e.target.value)
    }

    const renderField = () => {
        if (type === 'select') {
        return (
            <select id={id} defaultValue="" name={name} onChange={handleChange} className="border rounded px-3 py-2 w-full">
                <option value="" disabled>Select {label}</option>
                {options?.filter(opt => opt.value !== '').map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        )
    }
    if (type === 'file') {
      return (
        <ImageUpload id={id} name={name} label={label} required={required} onFileChange={(file) => onChange(id, file)} />
      )
    }
    return (
      <input type={type} id={id} name={name} placeholder={placeholder} className="px-2 py-3.75 w-full text-sm font-semibold placeholder:italic text-black" required={required} onChange={handleChange} />
    )
  }

  return (
    <div className="flex flex-col font-display border border-[#D2E1DA]">
      <label htmlFor={id} className="flex gap-0.5 items-center text-xs font-medium p-2 bg-[#E9ECEB]">
        {label}
        {required && <Star className='size-2' />}
      </label>
      {renderField()}
    </div>
  )
}