'use client'

export default function FormSelect({ id, label, register, options = {}, error, Icon }: any) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm text-gray-700 font-medium mb-1 flex items-center gap-2">
                <Icon className="w-5 h-5 text-gray-600" />
                {label}
            </label>
            <select
                id={id}
                {...register(id, options)}
                className="w-full h-12 px-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
    )
}