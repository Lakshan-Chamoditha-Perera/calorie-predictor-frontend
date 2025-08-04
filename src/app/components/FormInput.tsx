'use client'

export default function FormInput({ id, label, register, options = {}, step, error, Icon, description }: any) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm text-gray-700 font-medium mb-1 flex items-center gap-2">
                <Icon className="w-5 h-5 text-gray-600" />
                {label}
            </label>
            <p className="text-xs text-gray-500 mb-2">{description ?? " .wfr"}</p>
            {/* Input Field */}
            <input
                id={id}
                type="number"
                step={step}
                placeholder={`Enter ${label.toLowerCase()}`}
                {...register(id, options)}
                className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    )
}
