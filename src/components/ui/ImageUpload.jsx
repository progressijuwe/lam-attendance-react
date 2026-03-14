import { useState, useRef } from 'react'
import Camera from '../../assets/svg/camera.svg?react'

export default function ImageUpload({ id, name, label, required, onFileChange }) {
  const [preview, setPreview] = useState(null)
  const inputRef = useRef(null)

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    onFileChange(file)
  }

  return (
    <div className="flex flex-col border border-gray-200 rounded overflow-hidden">

      <div
        className="flex items-center justify-center bg-gray-50 h-48 cursor-pointer"
        onClick={() => inputRef.current.click()}
      >
        {preview ? (
          <img src={preview} alt="preview" className="h-45 w-88.5 object-contain" />
        ) : (
          <Camera className="size-12 text-gray-300" />
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        id={id}
        name={name}
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />

      <div className="flex justify-center px-3 py-2 bg-gray-100 border-t border-gray-200">
        <span className="text-sm italic text-gray-600 text-center">
          Please take this photo against the provided background
        </span>
      </div>

    </div>
  )
}