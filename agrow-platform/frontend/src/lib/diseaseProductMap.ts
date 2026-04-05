export const diseaseProductMapping: Record<string, { products: string[]; severity: 'low' | 'medium' | 'high' | 'critical'; description: string }> = {
    // Tomato diseases
    'early_blight': {
        products: ['Bio-Fungicide X1', 'Copper Shield', 'Eco-Pesticide'],
        severity: 'high',
        description: 'Brown spots with concentric rings on tomato leaves'
    },
    'late_blight': {
        products: ['Copper Shield', 'Bio-Fungicide X1'],
        severity: 'critical',
        description: 'Water-soaked lesions that turn brown/black'
    },
    'powdery_mildew': {
        products: ['Sulphur Plus', 'Eco-Pesticide'],
        severity: 'medium',
        description: 'White powdery coating on leaves'
    },
    'septoria_leaf_spot': {
        products: ['Copper Shield', 'Bio-Fungicide X1'],
        severity: 'high',
        description: 'Small circular spots with dark borders'
    },
    'leaf_curl': {
        products: ['Eco-Pesticide', 'Organic Neem Oil'],
        severity: 'medium',
        description: 'Curled and yellowing leaves'
    },
    'nutrient_deficiency_nitrogen': {
        products: ['Premium Urea', 'NPK 19-19-19'],
        severity: 'medium',
        description: 'Yellowing of lower leaves'
    },
    'nutrient_deficiency_magnesium': {
        products: ['Magnesium Max'],
        severity: 'low',
        description: 'Yellowing between veins'
    },
    'nutrient_deficiency_zinc': {
        products: ['Zinc Booster'],
        severity: 'medium',
        description: 'Interveinal chlorosis on young leaves'
    },
    'nutrient_deficiency_iron': {
        products: ['Iron Chelate'],
        severity: 'medium',
        description: 'Yellowing of upper leaves with green veins'
    },
    'nutrient_deficiency_boron': {
        products: ['Boron Complex'],
        severity: 'medium',
        description: 'Brittle stems and poor fruit set'
    },

    // Rice diseases
    'blast': {
        products: ['Copper Shield', 'Bio-Fungicide X1'],
        severity: 'critical',
        description: 'Diamond-shaped lesions on leaf blade'
    },
    'brown_spot': {
        products: ['Copper Shield', 'Organic Neem Oil'],
        severity: 'high',
        description: 'Circular brown spots on rice leaves'
    },
    'sheath_blight': {
        products: ['Bio-Fungicide X1', 'Eco-Pesticide'],
        severity: 'high',
        description: 'Oval lesions on leaf sheaths'
    },

    // General
    'healthy': {
        products: ['Vermicompost Gold', 'DAP Plus', 'Muriate of Potash'],
        severity: 'low',
        description: 'Preventive nutrients for optimal plant health'
    }
};

export interface Product {
    id: number;
    name: string;
    price: number;
    composition: string;
    description: string;
    diseases: string[];
    rating: number;
    reviews: number;
    inStock: boolean;
    image?: string;
    category?: 'fungicide' | 'fertilizer' | 'insecticide' | 'organic' | 'other';
}

export const products: Product[] = [
    {
        id: 1,
        name: 'Organic Neem Oil',
        price: 450,
        composition: 'AZADIRACHTIN',
        description: 'Broad-spectrum natural pest control and fungicide.',
        diseases: ['leaf_curl', 'powdery_mildew', 'brown_spot'],
        rating: 4.8,
        reviews: 234,
        inStock: true,
        image: '/images/products/neem_oil.svg',
        category: 'organic'
    },
    {
        id: 2,
        name: 'Premium Urea',
        price: 800,
        composition: 'CARBAMIDE',
        description: 'Concentrated nitrogen fertilizer for rapid leafy growth.',
        diseases: ['nutrient_deficiency_nitrogen'],
        rating: 4.6,
        reviews: 189,
        inStock: true,
        image: '/images/products/urea.svg',
        category: 'fertilizer'
    },
    {
        id: 3,
        name: 'Bio-Fungicide X1',
        price: 1200,
        composition: 'TRICHODERMA VIRIDE',
        description: 'Effective against soil-borne and foliar diseases.',
        diseases: ['early_blight', 'late_blight', 'septoria_leaf_spot', 'blast', 'sheath_blight'],
        rating: 4.9,
        reviews: 312,
        inStock: true,
        image: '/images/products/fungicide.svg',
        category: 'fungicide'
    },
    {
        id: 4,
        name: 'Copper Shield',
        price: 650,
        composition: 'COPPER OXYCHLORIDE',
        description: 'Protective fungicide and bactericide.',
        diseases: ['early_blight', 'late_blight', 'septoria_leaf_spot', 'blast', 'brown_spot'],
        rating: 4.7,
        reviews: 154,
        inStock: true,
        image: '/images/products/fungicide.svg',
        category: 'fungicide'
    },
    {
        id: 5,
        name: 'Eco-Pesticide',
        price: 550,
        composition: 'BOTANICAL EXTRACTS',
        description: 'Safe for pollinators, effective against sucking pests.',
        diseases: ['early_blight', 'powdery_mildew', 'sheath_blight', 'leaf_curl'],
        rating: 4.5,
        reviews: 98,
        inStock: true,
        category: 'organic'
    },
    {
        id: 6,
        name: 'Sulphur Plus',
        price: 320,
        composition: 'SULPHUR 80% WP',
        description: 'Controls powdery mildew and mites.',
        diseases: ['powdery_mildew'],
        rating: 4.3,
        reviews: 112,
        inStock: true,
        category: 'fungicide'
    },
    {
        id: 7,
        name: 'NPK 19-19-19',
        price: 1400,
        composition: 'NITROGEN PHOSPHORUS POTASSIUM',
        description: 'Balanced fertilizer for all growth stages.',
        diseases: ['nutrient_deficiency_nitrogen'],
        rating: 4.8,
        reviews: 450,
        inStock: true,
        image: '/images/products/npk.svg',
        category: 'fertilizer'
    },
    {
        id: 8,
        name: 'Magnesium Max',
        price: 480,
        composition: 'MAGNESIUM SULPHATE',
        description: 'Corrects magnesium deficiency promptly.',
        diseases: ['nutrient_deficiency_magnesium'],
        rating: 4.6,
        reviews: 87,
        inStock: false,
        image: '/images/products/npk.svg',
        category: 'fertilizer'
    },
    {
        id: 9,
        name: 'Vermicompost Gold',
        price: 250,
        composition: 'ORGANIC MANURE',
        description: 'Improves soil health and nutrient availability.',
        diseases: ['healthy'],
        rating: 4.9,
        reviews: 567,
        inStock: true,
        category: 'organic'
    },
    {
        id: 13,
        name: 'Zinc Booster',
        price: 380,
        composition: 'ZINC SULFATE',
        description: 'Corrects zinc deficiency, improves yield quality.',
        diseases: ['nutrient_deficiency_zinc'],
        rating: 4.5,
        reviews: 156,
        inStock: true,
        image: '/images/products/npk.svg',
        category: 'fertilizer'
    },
    {
        id: 14,
        name: 'Iron Chelate',
        price: 420,
        composition: 'IRON EDTA',
        description: 'Treats iron chlorosis in acid soils.',
        diseases: ['nutrient_deficiency_iron'],
        rating: 4.6,
        reviews: 142,
        inStock: true,
        image: '/images/products/npk.svg',
        category: 'fertilizer'
    },
    {
        id: 15,
        name: 'Boron Complex',
        price: 340,
        composition: 'BORIC ACID',
        description: 'Essential for flower/fruit development.',
        diseases: ['nutrient_deficiency_boron'],
        rating: 4.4,
        reviews: 128,
        inStock: true,
        image: '/images/products/npk.svg',
        category: 'fertilizer'
    }
];
