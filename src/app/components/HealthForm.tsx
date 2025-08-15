"use client"

import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import axios from 'axios'
import {
    User, Users, Ruler, Scale, Clock, Heart,
    Thermometer, Activity, Check, Calculator,
    Target, Zap, TrendingUp, Flame, Info,
    AlertCircle, Loader2, CheckCircle2
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
    const [activeSection, setActiveSection] = useState<'form' | 'results'>('form')
    const { mutate, isPending, isError } = useMutation({
        mutationFn: async (data: FormValues) => {
            const base_url = process.env.NEXT_PUBLIC_BASE_URL;
            const reqData = {
                age: Number(data.age),
                height: Number(data.height),
                weight: Number(data.weight),
                duration: Number(data.duration),
                heartRate: Number(data.heartRate),
                bodyTemp: Number(data.bodyTemp),
                sex: data.sex 
            };

           
            const response = await axios.post(base_url + '/predict', reqData);
            return response.data;
        },
        onMutate: () => {
            toast.loading('Calculating calories...', { toastId: 'calculation' });
        },
        onSuccess: (result) => {
            setCaloriesBurned(result?.data?.prediction);
            setActiveSection('results');
            toast.update('calculation', {
                render: 'Calculation complete!',
                type: 'success',
                isLoading: false,
                autoClose: 3000,
            });
        },
        onError: (error) => {
            toast.update('calculation', {
                render: 'Error calculating calories',
                type: 'error',
                isLoading: false,
                autoClose: 3000,
            });
        },
    });

    const onSubmit = (data: FormValues) => {
        setCaloriesBurned(null)
        mutate(data)
    }

    return (
        <div className="">
            {/* Mobile Header */}
            <header className="lg:hidden bg-gradient-to-r from-indigo-700 to-blue-600 text-white p-6">
                <div className="flex items-center justify-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Flame className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold">
                        Calorie <span className="text-yellow-300">Estimator</span>
                    </h1>
                </div>
            </header>

            <div className=" mx-auto ">
                <div className="bg-white shadow-xl overflow-hidden">
                    {/* Desktop Hero + Form Layout */}
                    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-8rem)]">
                        {/* Hero Section - Left Side */}
                        <div className="lg:w-1/2 bg-gradient-to-br from-indigo-700 to-blue-600 p-8 lg:p-12 text-white">
                            <div className="h-full flex flex-col justify-center">
                                <div className="max-w-md mx-auto lg:mx-0 text-center lg:text-left">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full backdrop-blur-sm mb-6 animate-pulse">
                                        <Flame className="w-8 h-8" />
                                    </div>
                                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                                        Calorie Burn <span className="text-yellow-300">Calculator</span>
                                    </h1>
                                    <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                                        Get precise estimates of calories burned during physical activities using our AI-powered metabolic algorithm.
                                    </p>

                                    <div className="hidden lg:block space-y-6 mt-12">
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 p-2 bg-white/10 rounded-lg">
                                                <Target className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">High Accuracy</h3>
                                                <p className="text-blue-100 text-sm">Uses multiple biometric inputs for precise results</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 p-2 bg-white/10 rounded-lg">
                                                <Zap className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">Instant Results</h3>
                                                <p className="text-blue-100 text-sm">Get your calculation in seconds</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1 p-2 bg-white/10 rounded-lg">
                                                <TrendingUp className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">Personalized</h3>
                                                <p className="text-blue-100 text-sm">Tailored to your unique physiology</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Section - Right Side */}
                        <div className="lg:w-1/2  flex justify-center items-center   ">
                            <div className="p-6 sm:m-8  rounded-2xl shadow-lg  ">
                                {/* Mobile Navigation Tabs */}
                                <div className="lg:hidden flex mb-8 bg-white rounded-xl p-1 ">
                                    <button
                                        onClick={() => setActiveSection('form')}
                                        className={`flex-1 py-3 px-4 rounded-lg text-center font-medium transition-colors ${activeSection === 'form' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                                    >
                                        Input Form
                                    </button>
                                    <button
                                        onClick={() => setActiveSection('results')}
                                        className={`flex-1 py-3 px-4 rounded-lg text-center font-medium transition-colors ${activeSection === 'results' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
                                        disabled={!caloriesBurned}
                                    >
                                        Results
                                    </button>
                                </div>

                                {/* Form Content */}
                                <div className={`${activeSection === 'form' ? 'block' : 'hidden'} lg:block`}>
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                <Calculator className="w-5 h-5 text-blue-600" />
                                            </div>
                                            Activity Calculator
                                        </h2>
                                        <p className="text-gray-500 mt-2">
                                            Fill in your details to calculate calories burned
                                        </p>
                                    </div>

                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        {/* Activity Section */}
                                        <section className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                                <Activity className="w-5 h-5 text-blue-600" />
                                                Activity Metrics
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormInput
                                                    id="duration"
                                                    label="Duration (Minites)"
                                                    description="Activity time in minutes"
                                                    Icon={Clock}
                                                    type="number"
                                                    register={register}
                                                    error={errors.duration?.message}
                                                    options={{
                                                        required: 'Duration is required',
                                                        min: { value: 1, message: 'Minimum 1 min' },
                                                        max: { value: 1440, message: 'Maximum 24h' }
                                                    }}
                                                    unit="min"
                                                />
                                                <FormInput
                                                    id="heartRate"
                                                    label="Heart Rate"
                                                    description="Average during activity"
                                                    Icon={Heart}
                                                    type="number"
                                                    register={register}
                                                    error={errors.heartRate?.message}
                                                    options={{
                                                        required: 'Heart Rate is required',
                                                        min: { value: 30, message: 'Minimum 30 bpm' },
                                                        max: { value: 220, message: 'Maximum 220 bpm' }
                                                    }}
                                                    unit="bpm"
                                                />
                                                <FormInput
                                                    id="bodyTemp"
                                                    label="Body Temp"
                                                    description="Post-activity temperature"
                                                    Icon={Thermometer}
                                                    type="number"
                                                    step="0.1"
                                                    register={register}
                                                    error={errors.bodyTemp?.message}
                                                    options={{
                                                        required: 'Body Temp is required',
                                                        min: { value: 35, message: 'Minimum 35°C' },
                                                        max: { value: 42, message: 'Maximum 42°C' }
                                                    }}
                                                    unit="°C"
                                                />
                                            </div>
                                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
                                                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                <p className="text-sm text-blue-800">
                                                    For best accuracy, measure heart rate and temperature immediately after activity.
                                                </p>
                                            </div>
                                        </section>

                                        {/* Personal Info Section */}
                                        <section className="space-y-4">
                                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                                <User className="w-5 h-5 text-blue-600" />
                                                Personal Details
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormInput
                                                    id="age"
                                                    label="Age"
                                                    description="In years"
                                                    Icon={User}
                                                    type="number"
                                                    register={register}
                                                    error={errors.age?.message}
                                                    options={{
                                                        required: 'Age is required',
                                                        min: { value: 1, message: 'Minimum 1 year' },
                                                        max: { value: 120, message: 'Maximum 120' }
                                                    }}
                                                    unit="yrs"
                                                />
                                                <FormSelect
                                                    id="sex"
                                                    label="Sex"
                                                    description="Biological sex"
                                                    Icon={Users}
                                                    register={register}
                                                    error={errors.sex?.message}
                                                    options={{ required: 'Sex is required' }}
                                                    choices={[
                                                        { value: 'male', label: 'Male' },
                                                        { value: 'female', label: 'Female' }
                                                    ]}
                                                />
                                                <FormInput
                                                    id="height"
                                                    label="Height"
                                                    description="In centimeters"
                                                    Icon={Ruler}
                                                    type="number"
                                                    register={register}
                                                    error={errors.height?.message}
                                                    options={{
                                                        required: 'Height is required',
                                                        min: { value: 50, message: 'Minimum 50 cm' },
                                                        max: { value: 300, message: 'Maximum 300 cm' }
                                                    }}
                                                    unit="cm"
                                                />
                                                <FormInput
                                                    id="weight"
                                                    label="Weight"
                                                    description="In kilograms"
                                                    Icon={Scale}
                                                    type="number"
                                                    step="0.1"
                                                    register={register}
                                                    error={errors.weight?.message}
                                                    options={{
                                                        required: 'Weight is required',
                                                        min: { value: 1, message: 'Minimum 1 kg' },
                                                        max: { value: 500, message: 'Maximum 500 kg' }
                                                    }}
                                                    unit="kg"
                                                />
                                            </div>
                                        </section>

                                        {/* Form Actions */}
                                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
                                            <button
                                                type="reset"
                                                onClick={() => {
                                                    reset()
                                                    setCaloriesBurned(null)
                                                }}
                                                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                                disabled={isPending}
                                            >
                                                Reset
                                            </button>
                                            <button
                                                type="submit"
                                                // disabled={isPending || !isValid}
                                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {isPending ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Calculating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Flame className="w-4 h-4" />
                                                        Calculate
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Results Content */}
                                <div className={`${activeSection === 'results' ? 'block' : 'hidden'} lg:block`}>
                                    <div className="flex flex-col items-center justify-center h-full py-8 lg:py-12">
                                        {isPending ? (
                                            <div className="text-center space-y-4">
                                                <div className="inline-flex items-center justify-center p-4 bg-blue-50 rounded-full">
                                                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-800">Processing your data</h3>
                                                <p className="text-gray-500">This usually takes just a few seconds...</p>
                                            </div>
                                        ) : isError ? (
                                            <div className="text-center space-y-4 max-w-md">
                                                <div className="inline-flex items-center justify-center p-4 bg-red-50 rounded-full">
                                                    <AlertCircle className="w-8 h-8 text-red-600" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-800">Calculation Error</h3>
                                                <p className="text-gray-500 mb-6">
                                                    We encountered an issue processing your request. Please check your inputs and try again.
                                                </p>
                                                <button
                                                    onClick={() => setActiveSection('form')}
                                                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    Back to Form
                                                </button>
                                            </div>
                                        ) : caloriesBurned ? (
                                            <div className="text-center space-y-6 animate-fade-in">
                                                <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-full">
                                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Results</h3>
                                                    <p className="text-gray-500">Estimated calories burned during activity</p>
                                                </div>
                                                <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-8 rounded-2xl border border-gray-200 w-full max-w-xs">
                                                    <p className="text-5xl font-bold text-gray-900">
                                                        {caloriesBurned.toFixed(0)}
                                                        <span className="text-xl text-gray-500 ml-1">kcal</span>
                                                    </p>
                                                </div>
                                                <div className="pt-4">
                                                    <button
                                                        onClick={() => setActiveSection('form')}
                                                        className="text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center justify-center gap-2 mx-auto"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                        Calculate Again
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center space-y-4">
                                                <div className="inline-flex items-center justify-center p-4 bg-gray-100 rounded-full">
                                                    <Activity className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-800">No Results Yet</h3>
                                                <p className="text-gray-500 mb-6">
                                                    Submit the form to see your calorie burn calculation
                                                </p>
                                                {/* <button
                                                onClick={() => setActiveSection('form')}
                                                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Go to Form
                                            </button> */}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Footer */}
            {/* <footer className="bg-gray-800 text-white py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Calorie Burn Estimator. For informational purposes only.</p>
                </div>
            </footer> */}

            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    )
}