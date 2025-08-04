"use client"

import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import axios from 'axios'
import {
    User, Users, Ruler, Scale, Clock, Heart,
    Thermometer, Activity, Check, Calculator
} from 'lucide-react'

import FormSelect from './FormSelect'
import FormInput from './FormInput'
import { toast } from 'react-toastify'

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
            return response.data // Expected: { prediction: number }
        },
        onMutate: () => {
            toastId.current = toast.loading('Calculating calories burned...')
        },
        onSuccess: (result) => {
            console.log(result)
            setCaloriesBurned(result?.data?.prediction)
            toast.update(toastId.current!, {
                render: 'Calories burned calculated successfully!',
                type: 'success',
                isLoading: false,
                autoClose: 3000,
            })
        },
        onError: () => {
            toast.update(toastId.current!, {
                render: 'An error occurred while calculating calories burned.',
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
        <main className="min-h-screen bg-[#EEEEEE] py-12 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-8">

                {/* Header */}
                <div className="flex flex-row gap-4 mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <Calculator className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className='flex flex-col text-left'>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Calorie Prediction</h1>
                        <p className="text-lg text-gray-600">Enter your health metrics to calculate estimated calories burned</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Personal Information */}
                    <div className="mb-10">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        </div>
                    </div>

                    {/* Physical Measurements */}
                    <div className="mb-10">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Physical Measurements</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        </div>
                    </div>

                    {/* Activity & Health Data */}
                    <div className="mb-10">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Activity & Health Data</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                            <FormInput
                                id="bodyTemp"
                                label="Body Temperature (°C)"
                                Icon={Thermometer}
                                step="0.1"
                                register={register}
                                error={errors.bodyTemp?.message}
                                options={{ required: 'Body temperature is required' }}
                            />
                        </div>
                    </div>

                    {/* Results */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Results</h2>
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            {isPending && (
                                <div className="text-center py-8 text-blue-600 font-medium">
                                    Calculating...
                                </div>
                            )}
                            {caloriesBurned !== null && (
                                <div className="text-center py-8">
                                    <div className="inline-flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                            <Check className="w-6 h-6 text-green-600" />
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-2">Estimated Calories Burned</p>
                                    <p className="text-4xl font-bold text-gray-900">
                                        {caloriesBurned?.toFixed(2)}
                                        <span className="text-xl text-gray-500 ml-2">kcal</span>
                                    </p>
                                </div>
                            )}
                            {!isPending && !isError && caloriesBurned === null && (
                                <div className="text-center py-12">
                                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg">
                                        Complete the form above and click "Calculate" to see your results
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="reset"
                            onClick={() => {
                                reset()
                                setCaloriesBurned(null)
                            }}
                            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
                        >
                            Reset Form
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className={`px-8 py-3 bg-blue-600 text-white font-medium rounded-lg ${isPending
                                ? 'opacity-50 cursor-not-allowed'
                                : 'hover:bg-blue-700'
                                }`}
                        >
                            {isPending ? 'Calculating...' : 'Calculate Calories'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}