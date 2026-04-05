import { motion, AnimatePresence } from 'framer-motion';
import { Users, Building, Handshake, Truck, ShoppingBag, BrainCircuit, X } from 'lucide-react';
import { useState } from 'react';

const nodes = [
    {
        id: 'social',
        label: 'Social Team',
        icon: Users,
        x: 0,
        y: -250,
        color: 'blue',
        description: 'Our community outreach division that connects farmers to local support groups and social initiatives.'
    },
    {
        id: 'agency',
        label: 'Agency',
        icon: Building,
        x: 220,
        y: -80,
        color: 'indigo',
        description: 'Regulatory and standard-setting body ensuring quality control and fair trade practices across the platform.'
    },
    {
        id: 'partners',
        label: 'Partnerships',
        icon: Handshake,
        x: 180,
        y: 180,
        color: 'violet',
        description: 'Strategic alliances with tech providers, banks, and NGOs to provide comprehensive agricultural services.'
    },
    {
        id: 'dist',
        label: 'Distribution',
        icon: Truck,
        x: -180,
        y: 180,
        color: 'cyan',
        description: 'Logistics network handling the movement of seeds, fertilizers, and products from farm to market.'
    },
    {
        id: 'market',
        label: 'Marketplace',
        icon: ShoppingBag,
        x: -220,
        y: -80,
        color: 'sky',
        description: 'The digital trade floor where farmers sell their high-yield produce directly to bulk buyers.'
    },
];

const EcosystemGraph = () => {
    const [selectedNode, setSelectedNode] = useState<null | typeof nodes[0]>(null);

    return (
        <div className="relative w-full h-[800px] flex items-center justify-center overflow-hidden bg-stone-50/50 rounded-3xl border border-stone-100 shadow-inner">

            {/* Background Hint */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-stone-400 text-sm font-medium animate-pulse">
                Click a node to explore the ecosystem
            </div>

            {/* Central Node: AGROW Agentic AI */}
            <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", duration: 1.5 }}
                className="relative z-20 flex flex-col items-center justify-center cursor-help"
                onClick={() => setSelectedNode({
                    id: 'ai',
                    label: 'AGROW Agentic AI',
                    icon: BrainCircuit,
                    x: 0,
                    y: 0,
                    color: 'green',
                    description: 'The "Brain" of the organization. An autonomous agentic system that coordinates activities, predicts yields, and manages logistics in real-time.'
                } as any)}
            >
                <div className="w-40 h-40 bg-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30 relative">
                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
                    <BrainCircuit className="w-20 h-20 text-white" />
                </div>
                <div className="mt-4 bg-white px-6 py-2 rounded-full shadow-lg border border-green-100 font-bold text-green-800 text-lg">
                    AGROW Agentic AI
                </div>
            </motion.div>

            {/* Connected Nodes */}
            {nodes.map((node, i) => (
                <motion.div
                    key={node.id}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    whileInView={{ opacity: 1, scale: 1, x: node.x, y: node.y }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 + 0.5, type: "spring" }}
                    onClick={() => setSelectedNode(node)}
                    className="absolute z-10 flex flex-col items-center w-40 cursor-pointer group"
                >
                    <div className={`w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl border-2 border-${node.color}-100 group-hover:scale-110 group-hover:border-${node.color}-300 transition-all duration-300`}>
                        <node.icon className={`w-12 h-12 text-${node.color}-500`} />
                    </div>
                    <div className="mt-4 font-bold text-gray-800 text-base text-center bg-white/90 backdrop-blur px-4 py-1.5 rounded-xl shadow-sm border border-stone-100">
                        {node.label}
                    </div>
                </motion.div>
            ))}

            {/* Connecting Beams */}
            {nodes.map((node, i) => (
                <motion.div
                    key={`beam-${i}`}
                    className="absolute left-1/2 top-1/2 h-1 bg-linear-to-r from-green-500/40 to-transparent origin-left z-0"
                    style={{
                        width: '260px',
                        rotate: `${Math.atan2(node.y, node.x) * (180 / Math.PI)}deg`,
                    }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileInView={{ scaleX: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 + 0.5, duration: 0.8 }}
                />
            ))}

            {/* Dynamic Card Context Overlay */}
            <AnimatePresence>
                {selectedNode && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, x: selectedNode.x, y: selectedNode.y }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            x: selectedNode.x,
                            y: selectedNode.y > 0 ? selectedNode.y - 200 : selectedNode.y + 200
                        }}
                        exit={{ opacity: 0, scale: 0.5, x: selectedNode.x, y: selectedNode.y }}
                        className="absolute z-50 w-80 bg-white/95 backdrop-blur-xl border border-stone-200 rounded-2xl shadow-2xl p-6 pointer-events-auto"
                        style={{
                            marginLeft: '-160px', // Center the card relative to its placement
                            marginTop: '-100px'  // Adjust for card height
                        }}
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedNode(null);
                            }}
                            className="absolute top-3 right-3 p-1.5 hover:bg-stone-100 rounded-full transition-colors text-stone-400"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className={`p-3 bg-${selectedNode.color}-50 rounded-xl mb-4`}>
                                <selectedNode.icon className={`w-6 h-6 text-${selectedNode.color}-600`} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedNode.label}</h3>
                            <p className="text-gray-600 leading-relaxed text-xs">
                                {selectedNode.description}
                            </p>
                            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider text-green-600">
                                <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse" />
                                Active Service
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EcosystemGraph;
