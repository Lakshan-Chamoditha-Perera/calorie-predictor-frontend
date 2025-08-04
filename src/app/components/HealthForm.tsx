"use client"

import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import axios from 'axios'
import {
    User, Users, Ruler, Scale, Clock, Heart,
    Thermometer, Activity, Check, Calculator
} from 'lucide-react'
import { toast } from 'react-toastify'
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
    const toastId = useRef<any>(null)

    const { mutate, isPending, isError } = useMutation({
        mutationFn: async (data: FormValues) => {
            const base_url = process.env.NEXT_PUBLIC_BASE_URL
            const response = await axios.post(base_url + '/predict', data)
            return response.data
        },
        onMutate: () => {
            toastId.current = toast.loading('Calculating calories burned...')
        },
        onSuccess: (result) => {
            setCaloriesBurned(result?.data?.prediction)
            toast.update(toastId.current!, {
                render: 'Calories calculated successfully!',
                type: 'success',
                isLoading: false,
                autoClose: 3000,
            })
        },
        onError: () => {
            toast.update(toastId.current!, {
                render: 'Error calculating calories.',
                type: 'error',
                isLoading: false,
                autoClose: 3000,
            })
        },
    })

    const onSubmit = (data: FormValues) => {
        setCaloriesBurned(null)
        mutate(data)
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                        <Calculator className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Calorie Burn Calculator</h1>
                        <p className="text-sm sm:text-base text-gray-500 mt-1">Enter your metrics to estimate calories burned during activity</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Personal Information */}
                    <section>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <FormInput
                                id="age"
                                label="Age (years)"
                                Icon={User}
                                type="number"
                                register={register}
                                error={errors.age?.message}
                                options={{ required: 'Age is required', min: { value: 1, message: 'Age must be at least 1' }, max: { value: 120, message: 'Age cannot exceed 120' } }}
                                className="w-full"
                            />
                            <FormSelect
                                id="sex"
                                label="Sex"
                                Icon={Users}
                                register={register}
                                error={errors.sex?.message}
                                options={{ required: 'Sex is required' }}
                                className="w-full"
                            />
                        </div>
                    </section>

                    {/* Physical Measurements */}
                    <section>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Physical Measurements</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            <FormInput
                                id="height"
                                label="Height (cm)"
                                Icon={Ruler}
                                type="number"
                                register={register}
                                error={errors.height?.message}
                                options={{ required: 'Height is required', min: { value: 50, message: 'Height must be at least 50 cm' }, max: { value: 300, message: 'Height cannot exceed 300 cm' } }}
                                className="w-full"
                            />
                            <FormInput
                                id="weight"
                                label="Weight (kg)"
                                Icon={Scale}
                                type="number"
                                step="0.1"
                                register={register}
                                error={errors.weight?.message}
                                options={{ required: 'Weight is required', min: { value: 1, message: 'Weight must be at least 1 kg' }, max: { value: 500, message: 'Weight cannot exceed 500 kg' } }}
                                className="w-full"
                            />
                        </div>
                    </section>

                    {/* Activity & Health Data */}
                    <section>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Activity & Health Data</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                            <FormInput
                                id="duration"
                                label="Duration (min)"
                                Icon={Clock}
                                type="number"
                                register={register}
                                error={errors.duration?.message}
                                options={{ required: 'Duration is required', min: { value: 1, message: 'Duration must be at least 1 minute' }, max: { value: 1440, message: 'Duration cannot exceed 1440 minutes' } }}
                                className="w-full"
                            />
                            <FormInput
                                id="heartRate"
                                label="Heart Rate (bpm)"
                                Icon={Heart}
                                type="number"
                                register={register}
                                error={errors.heartRate?.message}
                                options={{ required: 'Heart rate is required', min: { value: 30, message: 'Heart rate must be at least 30 bpm' }, max: { value: 220, message: 'Heart rate cannot exceed 220 bpm' } }}
                                className="w-full"
                            />
                            <FormInput
                                id="bodyTemp"
                                label="Body Temp (°C)"
                                Icon={Thermometer}
                                type="number"
                                step="0.1"
                                register={register}
                                error={errors.bodyTemp?.message}
                                options={{ required: 'Body temperature is required', min: { value: 35, message: 'Temperature must be at least 35°C' }, max: { value: 42, message: 'Temperature cannot exceed 42°C' } }}
                                className="w-full"
                            />
                        </div>
                    </section>

                    {/* Results */}
                    <section>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Results</h2>
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 transition-all duration-300">
                            {isPending && (
                                <div className="text-center py-6 text-blue-600 font-medium flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                                    Calculating...
                                </div>
                            )}
                            {caloriesBurned !== null && (
                                <div className="text-center py-6">
                                    <div className="inline-flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                            <Check className="w-5 h-5 text-green-600" />
                                        </div>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-1">Estimated Calories Burned</p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {caloriesBurned.toFixed(1)}
                                        <span className="text-lg text-gray-500 ml-2">kcal</span>
                                    </p>
                                </div>
                            )}
                            {!isPending && !isError && caloriesBurned === null && (
                                <div className="text-center py-10">
                                    <Activity className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm">Enter your metrics and click "Calculate" to see results</p>
                                </div>
                            )}
                            {isError && (
                                <div className="text-center py-6 text-red-600 font-medium">
                                    Error calculating calories. Please try again.
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3">
                        <button
                            type="reset"
                            onClick={() => {
                                reset()
                                setCaloriesBurned(null)
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
                            disabled={isPending}
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? 'Calculating...' : 'Calculate'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}