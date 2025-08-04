"use client"

import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import axios from 'axios'
import {
    User, Users, Ruler, Scale, Clock, Heart,
    Thermometer, Activity, Check, Calculator,
    Target, Zap, TrendingUp, Flame, Info,
    AlertCircle,
    Loader2,
    CheckCircle2
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
        formState: { errors, isValid },
        reset,
        watch
    } = useForm<FormValues>({
        mode: 'onChange'
    })

    const [caloriesBurned, setCaloriesBurned] = useState<number | null>(null)
    const toastId = useRef<any>(null)

    const { mutate, isPending, isError } = useMutation({
        mutationFn: async (data: FormValues) => {
            const base_url = process.env.NEXT_PUBLIC_BASE_URL
            const response = await axios.post(base_url + '/predict', data)
            return response.data
        },
        onMutate: () => {
            toastId.current = toast.loading('Calculating calories...')
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

    const formValues = watch()

    return (
        <div className=" bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
            {/* Main Content */}
            <div className="">
                <div className="flex flex-col lg:flex-row ">
                    {/* Hero Section */}
                    <div className="lg:w-1/2 bg-gradient-to-r from-indigo-700 via-blue-600 to-blue-500  overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        <div className="relative p-6 sm:p-8 lg:p-12 flex flex-col justify-center h-full">
                            <div className="text-center flex flex-col items-center  h-1/2 gap-4">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm mb-6 animate-pulse">
                                    <Flame className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                                    Calorie Burn
                                    <span className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent"> Estimator</span>
                                </h1>
                                <p className="text-base sm:text-lg text-blue-100  max-w-md mx-auto lg:mx-0 leading-relaxed">
                                    Calculate calories burned during your activities with our AI-powered tool
                                </p>
                                <div className="flex flex-wrap justify-center  gap-4 mt-6">
                                    <div className="flex items-center gap-2 text-blue-100 bg-white/10 px-4 py-2 rounded-full">
                                        <Target className="w-5 h-5" />
                                        <span className="text-sm font-medium">High Precision</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-blue-100 bg-white/10 px-4 py-2 rounded-full">
                                        <Zap className="w-5 h-5" />
                                        <span className="text-sm font-medium">Fast Results</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-blue-100 bg-white/10 px-4 py-2 rounded-full">
                                        <TrendingUp className="w-5 h-5" />
                                        <span className="text-sm font-medium">Tailored Insights</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Form */}
                    <div className="lg:w-1/2 bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
                        {/* Form Header */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-8">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                                    <Calculator className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Calculate Your Burn</h2>
                                    <p className="text-sm sm:text-base text-gray-500 mt-1">
                                        Input your activity and health metrics below
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-8">
                            {/* Activity & Health Data */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-blue-600" />
                                    Activity & Health Data
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                    <FormInput
                                        id="duration"
                                        label="Duration"
                                        description="How long was your activity?"
                                        Icon={Clock}
                                        type="number"
                                        register={register}
                                        error={errors.duration?.message}
                                        options={{
                                            required: 'Duration is required',
                                            min: { value: 1, message: 'Must be at least 1 minute' },
                                            max: { value: 1440, message: 'Cannot exceed 1440 minutes' }
                                        }}
                                        unit="min"
                                        className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                    />
                                    <FormInput
                                        id="heartRate"
                                        label="Heart Rate"
                                        description="Average heart rate during activity"
                                        Icon={Heart}
                                        type="number"
                                        register={register}
                                        error={errors.heartRate?.message}
                                        options={{
                                            required: 'Heart rate is required',
                                            min: { value: 30, message: 'Must be at least 30 bpm' },
                                            max: { value: 220, message: 'Cannot exceed 220 bpm' }
                                        }}
                                        unit="bpm"
                                        className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                    />
                                    <FormInput
                                        id="bodyTemp"
                                        label="Body Temp"
                                        description="Temperature post-activity"
                                        Icon={Thermometer}
                                        type="number"
                                        step="0.1"
                                        register={register}
                                        error={errors.bodyTemp?.message}
                                        options={{
                                            required: 'Body temperature is required',
                                            min: { value: 35, message: 'Must be at least 35°C' },
                                            max: { value: 42, message: 'Cannot exceed 42°C' }
                                        }}
                                        unit="°C"
                                        className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                    />
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
                                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-blue-800">
                                        Measure heart rate and temperature right after your activity for accurate results.
                                    </p>
                                </div>
                            </section>

                            {/* Personal Information */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-600" />
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <FormInput
                                        id="age"
                                        label="Age"
                                        description="Your current age"
                                        Icon={User}
                                        type="number"
                                        register={register}
                                        error={errors.age?.message}
                                        options={{
                                            required: 'Age is required',
                                            min: { value: 1, message: 'Must be at least 1 year' },
                                            max: { value: 120, message: 'Cannot exceed 120 years' }
                                        }}
                                        unit="years"
                                        className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                    />
                                    <FormSelect
                                        id="sex"
                                        label="Sex"
                                        description="Select your biological sex"
                                        Icon={Users}
                                        register={register}
                                        error={errors.sex?.message}
                                        options={{ required: 'Sex is required' }}
                                        choices={[
                                            { value: 'male', label: 'Male' },
                                            { value: 'female', label: 'Female' }
                                        ]}
                                        className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                    />
                                </div>
                            </section>

                            {/* Physical Measurements */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <Scale className="w-5 h-5 text-blue-600" />
                                    Physical Measurements
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <FormInput
                                        id="height"
                                        label="Height"
                                        description="Your height in centimeters"
                                        Icon={Ruler}
                                        type="number"
                                        register={register}
                                        error={errors.height?.message}
                                        options={{
                                            required: 'Height is required',
                                            min: { value: 50, message: 'Must be at least 50 cm' },
                                            max: { value: 300, message: 'Cannot exceed 300 cm' }
                                        }}
                                        unit="cm"
                                        className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                    />
                                    <FormInput
                                        id="weight"
                                        label="Weight"
                                        description="Your weight in kilograms"
                                        Icon={Scale}
                                        type="number"
                                        step="0.1"
                                        register={register}
                                        error={errors.weight?.message}
                                        options={{
                                            required: 'Weight is required',
                                            min: { value: 1, message: 'Must be at least 1 kg' },
                                            max: { value: 500, message: 'Cannot exceed 500 kg' }
                                        }}
                                        unit="kg"
                                        className="w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                    />
                                </div>
                            </section>

                            <section className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Calculator className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Activity Results</h3>
                                </div>

                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                                    {isPending && (
                                        <div className="flex flex-col items-center justify-center py-8 gap-3">
                                            <div className="relative">
                                                <div className="w-12 h-12 bg-blue-50 rounded-full animate-pulse"></div>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                                                </div>
                                            </div>
                                            <p className="text-blue-600 font-medium">Calculating your results...</p>
                                        </div>
                                    )}

                                    {caloriesBurned !== null && (
                                        <div className="animate-fade-in-up">
                                            <div className="flex flex-col items-center py-4">
                                                <div className="mb-4 p-3 bg-gradient-to-br from-green-100 to-blue-100 rounded-full">
                                                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                                                </div>
                                                <p className="text-sm font-medium text-gray-500 mb-1">CALORIES BURNED</p>
                                                <div className="flex items-end gap-1">
                                                    <span className="text-4xl font-bold text-gray-900">
                                                        {caloriesBurned.toFixed(1)}
                                                    </span>
                                                    <span className="text-lg text-gray-400 mb-1">kcal</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {!isPending && !isError && caloriesBurned === null && (
                                        <div className="flex flex-col items-center py-8 gap-4">
                                            <div className="p-4 bg-gray-50 rounded-full">
                                                <Activity className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <div className="text-center space-y-1">
                                                <p className="font-medium text-gray-500">Ready to calculate</p>
                                                <p className="text-sm text-gray-400">Enter your details to see your results</p>
                                            </div>
                                        </div>
                                    )}

                                    {isError && (
                                        <div className="flex flex-col items-center py-8 gap-3">
                                            <div className="p-3 bg-red-50 rounded-full">
                                                <AlertCircle className="w-6 h-6 text-red-500" />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-medium text-red-600">Calculation error</p>
                                                <p className="text-sm text-red-400 mt-1">Please check your inputs and try again</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                                <button
                                    type="reset"
                                    onClick={() => {
                                        reset()
                                        setCaloriesBurned(null)
                                    }}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isPending}
                                >
                                    Reset Form
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending || !isValid}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                                >
                                    {isPending ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                            Calculating...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <Flame className="w-4 h-4" />
                                            Calculate Calories
                                        </span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-6 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
                    <p>&copy; 2025 Calorie Burn Estimator. Results are estimates based on metabolic algorithms. Consult a professional for precise health advice.</p>
                </div>
            </footer>

            {/* Custom Animation Styles */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out;
                }
            `}</style>
        </div>
    )
}