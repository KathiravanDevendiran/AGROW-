"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, BrainCircuit, Sparkles, Navigation, Info, Zap } from 'lucide-react';

interface Message {
    id: number;
    text: string;
    sender: 'ai' | 'user';
    timestamp: Date;
    actions?: { label: string; action: () => void }[];
}

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    id: 1,
                    text: "Hello! 👋 I am the AGROW Agentic AI Assistant. I can help you navigate our organization, explain our benefits, or summarize our vision. What would you like to explore? 🚀",
                    sender: 'ai',
                    timestamp: new Date(),
                    actions: [
                        { label: "Summarize Site 📝", action: () => handleBotResponse("summarize") },
                        { label: "Show Benefits 💎", action: () => handleBotResponse("benefits") },
                        { label: "Navigate Map 📍", action: () => scrollToSection('ecosystem') },
                    ]
                }
            ]);
        }
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            const sectionName = id.charAt(0).toUpperCase() + id.slice(1);
            addMessage(`user`, `Navigate to ${sectionName} 📍`);
            setTimeout(() => {
                addBotMessage(`Certainly. I've moved you to the ${sectionName} section. What else can I show you? 😊`);
            }, 800);
            setIsOpen(false);
        }
    };

    const addMessage = (sender: 'ai' | 'user', text: string) => {
        setMessages(prev => [...prev, {
            id: Date.now(),
            text,
            sender,
            timestamp: new Date()
        }]);
    };

    const addBotMessage = (text: string, actions?: { label: string; action: () => void }[]) => {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, {
                id: Date.now(),
                text,
                sender: 'ai',
                timestamp: new Date(),
                actions
            }]);
        }, 1200);
    };

    const handleExternalResearch = (topic: string) => {
        const url = `https://www.google.com/search?q=${encodeURIComponent(topic + " agriculture agrow organisation agentic ai")}`;
        window.open(url, '_blank');
        addBotMessage(`I've opened a deep research tab for "${topic}" with top industry references. 🔍 Is there anything specific from those results you'd like me to analyze? 📊`);
    };

    const handleBotResponse = (query: string) => {
        const q = query.toLowerCase().trim();
        addMessage('user', query);

        if (q.includes("google") || q.includes("reference") || q.includes("research") || q.includes("source")) {
            addBotMessage("I can pull deep references from global agricultural databases. 🌐 What specific topic should I research for you?", [
                { label: "Research Agentic AI 🤖", action: () => handleExternalResearch("Agentic AI in Agriculture") },
                { label: "Research Crop Disease 🔬", action: () => handleExternalResearch("Global Crop Disease Trends 2026") },
                { label: "Research Fair Trade 🤝", action: () => handleExternalResearch("Blockchain Fair Trade Agriculture") }
            ]);
        } else if (q === "summarize" || q.includes("summary") || q.includes("what is this site")) {
            addBotMessage("AGROW is a global Agentic AI Organization dedicated to rural intelligence. 🌍 We provide a plant disease detection app, a fair-trade marketplace, a regulatory agency, and a social grower network—all coordinated by our central AI core. 🧠", [
                { label: "Deep Strategy 📈", action: () => handleBotResponse("strategy") },
                { label: "External Refs 🔗", action: () => handleBotResponse("reference") }
            ]);
        } else if (q === "benefits" || q.includes("benefit") || q.includes("why use agrow")) {
            addBotMessage("By using AGROW, farmers receive: 1. Real-time disease diagnosis 📸, 2. Direct access to bulk buyers 💸, 3. Secure social connectivity 👥, and 4. Transparent, data-driven farming advice. ✨", [
                { label: "Real Problems ⚠️", action: () => handleBotResponse("problems") },
                { label: "Search Authority 🔍", action: () => handleExternalResearch("Benefits of AI in smallholder farming") }
            ]);
        } else if (q.includes("hi") || q.includes("hello") || q.includes("hey") || q.includes("hola")) {
            addBotMessage("Hello there! 👋 I'm the AGROW Agentic AI. How can I help you explore our agricultural revolution today? 🌱", [
                { label: "Summarize Org 📝", action: () => handleBotResponse("summarize") },
                { label: "Show the Plan 🗺️", action: () => scrollToSection('plan') }
            ]);
        } else if (q.includes("strategy") || q.includes("marketing") || q.includes("growth")) {
            addBotMessage("Our strategy is built on 'Digital Inclusion.' 🤝 We partner with local cooperatives to onboard farmers, use 'Agentic Trust' to verify quality, and scale through a B2B model that connects rural regions directly to global supply chains. 🚀", [
                { label: "Platform Mechanics ⚙️", action: () => handleBotResponse("mechanics") },
                { label: "View Pillars 🏛️", action: () => scrollToSection('about') }
            ]);
        } else if (q.includes("problem") || q.includes("real world") || q.includes("challenges")) {
            addBotMessage("AGROW solves critical issues: 1. Food insecurity caused by undiagnosed crop diseases 🍂, 2. Middle-man exploitation that bleeds farmer profits 📉, and 3. Fragmented data that prevents efficient logistics. 🚚", [
                { label: "Search FAO Data 📊", action: () => handleExternalResearch("FAO crop disease impact statistics") },
                { label: "Ecosystem View 🗺️", action: () => scrollToSection('ecosystem') }
            ]);
        } else if (q.includes("how it works") || q.includes("mechanics") || q.includes("technology")) {
            addBotMessage("The platform operates via an 'Agentic Core'—an AI that doesn't just predict, but acts. ⚡ It coordinates seed distribution, validates harvest quality via blockchain, and autonomously matches supply with demand in real-time. ⛓️", [
                { label: "Agentic Tech Refs 🔗", action: () => handleExternalResearch("Agentic AI workflows and blockchain agriculture") },
                { label: "Future Frontier 🚀", action: () => scrollToSection('frontiers') }
            ]);
        } else if (q.includes("who are you") || q.includes("what are you") || q.includes("help")) {
            addBotMessage("I am the AGROW Assistant, an autonomous agent designed to guide you through our ecosystem. 🤖 I can summarize our mission, explain benefits, provide research, or navigate you to any section. 🧭", [
                { label: "Summarize 📝", action: () => handleBotResponse("summarize") },
                { label: "Research 🔍", action: () => handleBotResponse("research") }
            ]);
        } else if (q.includes("thanks") || q.includes("thank you") || q.includes("bye") || q.includes("goodbye")) {
            addBotMessage("You're very welcome! 😊 Feel free to ask if you need anything else. Happy farming! 🌱", [
                { label: "One more thing... ✨", action: () => setInputValue("What else?") }
            ]);
        } else if (q.includes("login") || q.includes("access") || q.includes("phone number")) {
            addBotMessage("We've simplified access for everyone! 📲 Now, farmers can log in using just their phone number. No complex passwords required—our Social Team manages the onboarding to ensure digital inclusion for all. 🤝", [
                { label: "Go to Login 🔑", action: () => window.location.href = '/login' },
                { label: "How it works ⚙️", action: () => handleBotResponse("mechanics") }
            ]);
        } else if (q.includes("card") || q.includes("identity") || q.includes("qr code")) {
            addBotMessage("Every AGROW member receives a digital Identity Card with a unique QR code. 💳 This card allows you to verify your crop analytics, access marketplaces, and connect with our Social Team in the field! 📍", [
                { label: "View Dashboard 📊", action: () => window.location.href = '/farmer/dashboard' },
                { label: "Digital Trust 🛡️", action: () => handleBotResponse("strategy") }
            ]);
        } else if (q.includes("social team") || q.includes("field workers") || q.includes("outreach")) {
            addBotMessage("Our Social Team is the human heart of AGROW. ❤️ They work directly in rural regions, onboarding farmers with QR-coded cards and helping those with less tech experience to use our Agentic AI tools effectively. 👥", [
                { label: "Our Network 🗺️", action: () => scrollToSection('ecosystem') },
                { label: "Search Outreach 🔍", action: () => handleExternalResearch("Agricultural social outreach and technology adoption") }
            ]);
        } else if (q.includes("agentic ai") || q.includes("doing in agrow") || q.includes("what does ai do")) {
            addBotMessage("Most AIs just analyze; our 'Agentic AI' acts. 🤖 Within AGROW, I am the autonomous coordinator that monitors crop health, validates data, calculates fair pricing, and optimizes routes—all without human oversight. ✨", [
                { label: "Deep Mechanics ⚙️", action: () => handleBotResponse("technology") },
                { label: "Coordination Map 🗺️", action: () => scrollToSection('ecosystem') }
            ]);
        } else {
            addBotMessage("That's an interesting question. 🤔 As an Agentic AI, I'm constantly learning about our organization's soil and soul. I can also pull external research from Google if you'd like! 🔍", [
                { label: "Search Google 🔍", action: () => handleExternalResearch(query) },
                { label: "Show Summary 📝", action: () => handleBotResponse("summarize") }
            ]);
        }
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;
        const val = inputValue;
        setInputValue('');
        handleBotResponse(val);
    };

    return (
        <>
            {/* Floating Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 z-60 bg-green-600 text-white p-4 rounded-full shadow-2xl shadow-green-600/40 group"
            >
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20 group-hover:opacity-40" />
                {isOpen ? <X className="relative z-10 w-6 h-6" /> : <BrainCircuit className="relative z-10 w-7 h-7" />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 100, transformOrigin: 'bottom right' }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 100 }}
                        className="fixed bottom-28 right-8 z-60 w-96 max-w-[calc(100vw-4rem)] bg-white/95 backdrop-blur-xl border border-stone-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-green-600 p-6 text-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <BrainCircuit className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">AGROW Assistant</h3>
                                    <div className="flex items-center gap-1.5 text-xs text-green-100">
                                        <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                                        Agentic AI Online
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[450px]"
                        >
                            {messages.map((m) => (
                                <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div
                                        className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${m.sender === 'user'
                                            ? 'bg-green-600 text-white rounded-tr-none'
                                            : 'bg-stone-100 text-gray-800 rounded-tl-none border border-stone-200 shadow-sm'
                                            }`}
                                    >
                                        {m.text}
                                    </div>

                                    {m.actions && (
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {m.actions.map((act, i) => (
                                                <button
                                                    key={i}
                                                    onClick={act.action}
                                                    className="bg-white border border-green-200 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-green-50 transition-colors shadow-sm"
                                                >
                                                    {act.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isTyping && (
                                <div className="flex gap-1 items-center p-4 bg-stone-100 rounded-2xl rounded-tl-none w-16">
                                    <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce" />
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-stone-100 bg-stone-50">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask about AGROW..."
                                    className="w-full bg-white border border-stone-200 rounded-2xl px-5 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                                />
                                <button
                                    onClick={handleSend}
                                    className="absolute right-2 top-1.5 p-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-md shadow-green-600/20"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AIAssistant;
