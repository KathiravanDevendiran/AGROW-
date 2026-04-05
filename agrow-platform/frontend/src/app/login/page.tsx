"use client";

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Leaf, Phone, ArrowRight, Loader2, CreditCard, ShieldCheck, MapPin, User, CheckCircle, Camera, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Details
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        crop: ''
    });
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmitPhone = (e: React.FormEvent) => {
        e.preventDefault();
        if (phoneNumber.length < 10) {
            setError('Please enter a valid 10-digit phone number.');
            return;
        }
        setIsLoading(true);
        setError('');

        // Mocking API call
        setTimeout(() => {
            setIsLoading(false);
            setStep(2);
        }, 800);
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp !== '123456') {
            setError('Invalid OTP. Use 123456 for demo.');
            return;
        }
        setIsLoading(true);
        setError('');

        setTimeout(() => {
            setIsLoading(false);
            setStep(3);
        }, 800);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.location || !formData.crop) {
            setError('Please fill in all details.');
            return;
        }
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone: phoneNumber,
                    name: formData.name,
                    farmDetails: {
                        location: formData.location,
                        crop: formData.crop,
                        area: "Smallholder"
                    }
                })
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                router.push('/farmer/dashboard');
            } else {
                setError('Login failed. Please try again.');
            }
        } catch (err) {
            setError('Server connection failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
                <div className="flex justify-center gap-2 items-center mb-4">
                    <div className="bg-green-600 p-2 rounded-xl shadow-lg shadow-green-600/20">
                        <Leaf className="h-7 w-7 text-white" />
                    </div>
                </div>
                <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">
                    {step === 1 && "Simple Farmer Login"}
                    {step === 2 && "OTP Verification"}
                    {step === 3 && "Identity Card Details"}
                </h2>
                <p className="mt-2 text-sm text-stone-500 font-medium">
                    {step === 1 && "Just enter your phone number to start"}
                    {step === 2 && `Enter the 6-digit code sent to ${phoneNumber}`}
                    {step === 3 && "Final step for your verified Identity Card"}
                </p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
                <div className="bg-white py-8 px-6 shadow-2xl shadow-stone-200/50 sm:rounded-[2.5rem] sm:px-10 border border-stone-100">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                                onSubmit={handleSubmitPhone}
                            >
                                <div>
                                    <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2">
                                        Phone Number
                                    </label>
                                    <div className="mt-1 relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-stone-300 group-focus-within:text-green-600 transition-colors" />
                                        </div>
                                        <input
                                            type="tel"
                                            required
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                            className="block w-full pl-12 rounded-2xl border-stone-100 bg-stone-50 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 sm:text-lg py-4 border-2 transition-all outline-none"
                                            placeholder="Enter your number"
                                            maxLength={10}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group relative flex w-full justify-center rounded-2xl bg-green-600 py-4 px-6 text-lg font-bold text-white shadow-xl shadow-green-600/30 hover:bg-green-700 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : "Send OTP code"}
                                </button>
                            </motion.form>
                        )}

                        {step === 2 && (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                                onSubmit={handleVerifyOtp}
                            >
                                <div>
                                    <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2">
                                        Verification Code
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        className="block w-full text-center tracking-[1em] rounded-2xl border-stone-100 bg-stone-50 focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 text-2xl py-4 border-2 transition-all outline-none"
                                        placeholder="000000"
                                        maxLength={6}
                                    />
                                    <p className="mt-4 text-center text-xs text-stone-400">
                                        Demo OTP: <span className="font-bold text-green-600">123456</span>
                                    </p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group relative flex w-full justify-center rounded-2xl bg-stone-900 py-4 px-6 text-lg font-bold text-white shadow-xl shadow-stone-900/20 hover:bg-black hover:-translate-y-0.5 transition-all disabled:opacity-50"
                                >
                                    {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : "Verify & Continue"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-full text-center text-sm font-bold text-stone-400 hover:text-stone-600 transition-colors"
                                >
                                    Change Number
                                </button>
                            </motion.form>
                        )}

                        {step === 3 && (
                            <motion.form
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                                onSubmit={handleRegister}
                            >
                                {/* Photo Upload Section */}
                                <div className="flex flex-col items-center mb-2">
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-24 h-24 rounded-3xl bg-stone-50 border-2 border-dashed border-stone-200 flex flex-col items-center justify-center cursor-pointer hover:bg-green-50 hover:border-green-200 transition-all overflow-hidden group relative"
                                    >
                                        {profileImage ? (
                                            <>
                                                <img src={profileImage} alt="Passport" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <Camera className="w-6 h-6 text-white" />
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <Camera className="w-8 h-8 text-stone-300 group-hover:text-green-500 transition-colors mb-1" />
                                                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider group-hover:text-green-600">Photo</span>
                                            </>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    <p className="text-[10px] text-stone-400 font-bold mt-2 uppercase tracking-tight">Passport Size Photo</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1.5 ml-1">
                                            Full Name
                                        </label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-300 group-focus-within:text-green-600 transition-colors" />
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="block w-full pl-10 pr-4 rounded-xl border-stone-100 bg-stone-50 focus:bg-white focus:border-green-500 border-2 py-2.5 text-sm outline-none transition-all"
                                                placeholder="Ex: Rajesh Kumar"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1.5 ml-1">
                                                Farm Location
                                            </label>
                                            <div className="relative group">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-300 group-focus-within:text-green-600 transition-colors" />
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.location}
                                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                    className="block w-full pl-9 pr-3 rounded-xl border-stone-100 bg-stone-50 focus:bg-white focus:border-green-500 border-2 py-2.5 text-sm outline-none transition-all"
                                                    placeholder="City/State"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1.5 ml-1">
                                                Primary Crop
                                            </label>
                                            <div className="relative group">
                                                <Leaf className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-300 group-focus-within:text-green-600 transition-colors" />
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.crop}
                                                    onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                                                    className="block w-full pl-9 pr-3 rounded-xl border-stone-100 bg-stone-50 focus:bg-white focus:border-green-500 border-2 py-2.5 text-sm outline-none transition-all"
                                                    placeholder="Crop Name"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group relative flex w-full justify-center rounded-2xl bg-green-600 py-3.5 px-6 text-base font-bold text-white shadow-xl shadow-green-600/30 hover:bg-green-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 mt-4"
                                >
                                    {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Generate ID Card"}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {error && (
                        <div className="mt-4 rounded-xl bg-red-50 p-4 border border-red-100 transition-all animate-pulse">
                            <p className="text-sm font-bold text-red-800 text-center">{error}</p>
                        </div>
                    )}
                </div>

                <p className="mt-6 text-center text-sm text-stone-400">
                    <Link href="/" className="hover:text-green-600 transition-colors font-medium">← Back to AGROW Home</Link>
                </p>
            </div>
        </div>
    );
}
