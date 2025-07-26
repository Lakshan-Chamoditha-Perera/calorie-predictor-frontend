"use client"

import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import axios from 'axios'
import { FileText, User, Users, Ruler, Scale, Clock, Heart, Thermometer, Activity, X, Check } from 'lucide-react'
import FormSelect from './FormSelect'
import FormInput from './FormInput'



type FormValues = {
    age: number
    height: number
    weight: number
    duration: number
    heartRate: number
    bodyTemp: number
    sex: string
}

export default function HealthForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormValues>()

    const [caloriesBurned, setCaloriesBurned] = useState<number | null>(null)

    // Mutation logic using TanStack Query
    const mutation = useMutation({
        mutationFn: async (data: FormValues) => {
            const response = await axios.post('/api/health-assessment', data)
            return response.data
        },
        onSuccess: (data) => {
            setCaloriesBurned(data.caloriesBurned)
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Something went wrong'
            setCaloriesBurned(null)
            console.error(message)
        },
    })

    const onSubmit = (data: FormValues) => {
        setCaloriesBurned(null)
        mutation.mutate(data)
    }

    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="text-left border-b px-8 py-6 flex items-center  gap-2">
                    {/* <FileText className="w-6 h-6 text-gray-800" /> */}
                    <h2 className="text-2xl font-semibold text-gray-800">Health Assessment - Calorie Predictor</h2>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Form Fields */}
                        <FormInput
                            id="age"
                            label="Age"
                            Icon={User}
                            register={register}
                            error={errors.age?.message}
                            options={{ required: 'Age is required', min: 1, max: 120 }}
                        />
                        <FormSelect
                            id="sex"
                            label="Sex"
                            Icon={Users}
                            register={register}
                            error={errors.sex?.message}
                            options={{ required: 'Sex is required' }}
                        />
                        <FormInput
                            id="height"
                            label="Height (cm)"
                            Icon={Ruler}
                            register={register}
                            error={errors.height?.message}
                            options={{ required: 'Height is required', min: 50, max: 300 }}
                        />
                        <FormInput
                            id="weight"
                            label="Weight (kg)"
                            Icon={Scale}
                            step="0.1"
                            register={register}
                            error={errors.weight?.message}
                            options={{ required: 'Weight is required', min: 1, max: 500 }}
                        />
                        <FormInput
                            id="duration"
                            label="Duration (minutes)"
                            Icon={Clock}
                            register={register}
                            error={errors.duration?.message}
                            options={{ required: 'Duration is required', min: 1, max: 1440 }}
                        />
                        <FormInput
                            id="heartRate"
                            label="Heart Rate (bpm)"
                            Icon={Heart}
                            register={register}
                            error={errors.heartRate?.message}
                            options={{ required: 'Heart rate is required' }}
                        />
                    </div>

                    <FormInput
                        id="bodyTemp"
                        label="Body Temperature (°C)"
                        Icon={Thermometer}
                        step="0.1"
                        register={register}
                        error={errors.bodyTemp?.message}
                        options={{ required: 'Body temperature is required' }}
                    />

                    {/* Results Display */}
                    <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-gray-800" />
                            <h3 className="text-lg font-medium text-gray-800">Results</h3>
                        </div>
                        {mutation.isPending && <p className="text-gray-600 mt-2">Calculating calories burned...</p>}
                        {mutation.isError && (
                            <p className="text-red-500 mt-2">{(mutation.error as any)?.response?.data?.message || 'Failed to calculate'}</p>
                        )}
                        {caloriesBurned !== null && (
                            <p className="text-green-600 font-semibold mt-2">
                                Estimated Calories Burned: {caloriesBurned.toFixed(2)} kcal
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-row items-center justify-end gap-4 p-4">
                        <button
                            type="reset"
                            onClick={() => {
                                reset()
                                setCaloriesBurned(null)
                            }}
                            className="max-w-[80px] w-full h-12 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 flex items-center justify-center gap-2"
                        >
                            <X className="w-5 h-5" />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`max-w-[80px] w-full h-12 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2 ${mutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            disabled={mutation.isPending}
                        >
                            <Check className="w-5 h-5" />
                            {mutation.isPending ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}