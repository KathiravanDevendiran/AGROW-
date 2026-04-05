import { NextResponse } from 'next/server';
import https from 'https';

/**
 * Helper to make requests using native https module when fetch fails
 */
function httpsRequest(options: any, data?: any): Promise<{ status: number, data: any }> {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode || 0, data: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode || 0, data: body });
                }
            });
        });
        req.on('error', (e) => reject(e));
        if (data) req.write(typeof data === 'string' ? data : JSON.stringify(data));
        req.end();
    });
}

const MOCK_PLANTS = [
    {
        plantName: "Tomato",
        scientificName: "Solanum lycopersicum",
        diseaseName: "Early Blight (Alternaria solani)",
        confidence: 94.8,
        remedy: "1. Apply copper-based fungicide.\n2. Prune lower leaves to improve airflow.\n3. Avoid overhead watering to keep foliage dry."
    },
    {
        plantName: "Maize (Corn)",
        scientificName: "Zea mays",
        diseaseName: "Common Rust (Puccinia sorghi)",
        confidence: 89.2,
        remedy: "1. Use resistant hybrids in future plantings.\n2. Apply foliar fungicides if infection is severe.\n3. Ensure balanced soil nutrition to strengthen plant immunity."
    },
    {
        plantName: "Potato",
        scientificName: "Solanum tuberosum",
        diseaseName: "Late Blight (Phytophthora infestans)",
        confidence: 91.5,
        remedy: "1. Remove and destroy infected plants immediately.\n2. Apply preventative fungicides (e.g., Mancozeb).\n3. Improve drainage and avoid high humidity conditions."
    },
    {
        plantName: "Rice",
        scientificName: "Oryza sativa",
        diseaseName: "Rice Blast (Magnaporthe oryzae)",
        confidence: 87.4,
        remedy: "1. Avoid excessive nitrogen fertilization.\n2. Use silicon-based fertilizers to improve cell wall strength.\n3. Apply systemic fungicides like Tricyclazole if symptoms persist."
    }
];

function getMockResult() {
    const index = Math.floor(Math.random() * MOCK_PLANTS.length);
    return MOCK_PLANTS[index];
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { image } = body;

        if (!image) {
            return NextResponse.json({ error: 'Image is required (base64 string)' }, { status: 400 });
        }

        // Clean base64 string
        const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

        const results: any = {
            plantName: null,
            scientificName: null,
            diseaseName: null,
            confidence: null,
            remedy: null,
            raw: {
                perenual: null,
                kindwise: null,
                perenualStatus: null,
                kindwiseStatus: null,
            },
        };

        // Connectivity Test (Disabled for clean demo flow)
        /*
        try {
            console.log('Testing native https connectivity...');
            const testRes = await httpsRequest({
                hostname: 'jsonplaceholder.typicode.com',
                path: '/posts/1',
                method: 'GET'
            });
            results.raw.connectivityTest = testRes.status;
        } catch (e: any) {
            results.raw.connectivityTestError = e.message;
        }
        */

        // PRIORITY 1: Try Local Python AI Server (The research tool)
        try {
            console.log('--- ATTEMPTING LOCAL AI BRIDGE ---');

            const localRes = await fetch('http://127.0.0.1:5000/api/analyze-crop', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: base64Image }),
            });

            if (localRes.ok) {
                const data = await localRes.json();
                console.log('Local AI Data:', data);

                if (data.error || !data.detections || data.detections.length === 0) {
                    return NextResponse.json({
                        plantName: null,
                        scientificName: null,
                        diseaseName: null,
                        confidence: 0,
                        remedy: null,
                        error: data.error || "No detections found",
                    });
                }

                const topDetection = data.detections[0];

                return NextResponse.json({
                    plantName: topDetection.name,
                    scientificName: `${topDetection.name} spp.`,
                    diseaseName: topDetection.name.toLowerCase().includes('healthy') ? null : topDetection.name,
                    confidence: topDetection.confidence,
                    remedy: topDetection.solutions ? topDetection.solutions.join('\n') : topDetection.reason,
                    debug: {
                        note: "Results provided by local research AI model.",
                        raw: data
                    }
                });
            } else {
                console.log('Local AI responded with status:', localRes.status);
            }
        } catch (e: any) {
            console.log('Local Research AI (Port 5000) unavailable. Switching to fallback modes.', e.message);
        }

        // PRIORITY 2: Smart Demo Mode (Fallback for common crops if local AI fails)
        const isDefaultKey = (key?: string) => !key || key.includes('your_') || key.length < 10;

        if (isDefaultKey(process.env.PERENUAL_API_KEY) || isDefaultKey(process.env.KINDWISE_API_KEY)) {
            console.log('--- SMART DEMO MODE FALLBACK ---');
            const { crop } = body;

            let mock = getMockResult(); // Default to random

            if (crop) {
                const matched = MOCK_PLANTS.find(p => p.plantName === crop || p.plantName.includes(crop));
                if (matched) mock = matched;
            }

            return NextResponse.json({
                ...mock,
                debug: { note: "Smart Demo Mode active. (Local AI bridge unavailable)" }
            });
        }

        /**
     * 1. CALL PERENUAL IDENTIFY API
     */
        try {
            const buffer = Buffer.from(base64Image, 'base64');
            const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);

            const header = Buffer.from([
                `--${boundary}`,
                'Content-Disposition: form-data; name="file[]"; filename="leaf.jpg"',
                'Content-Type: image/jpeg',
                '',
                ''
            ].join('\r\n'));

            const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
            const bodyBuffer = Buffer.concat([header, buffer, footer]);

            const options = {
                hostname: 'perenual.com',
                path: `/api/plant-identify?key=${process.env.PERENUAL_API_KEY}`,
                method: 'POST',
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${boundary}`,
                    'Content-Length': bodyBuffer.length
                }
            };

            const perenualRes = await httpsRequest(options, bodyBuffer);
            results.raw.perenualStatus = perenualRes.status;
            results.raw.perenual = perenualRes.data;

            if (perenualRes.status >= 200 && perenualRes.status < 300) {
                const data = perenualRes.data;
                if (data.data && data.data.length > 0) {
                    const topMatch = data.data[0];
                    results.plantName = topMatch.common_name;
                    results.scientificName = Array.isArray(topMatch.scientific_name)
                        ? topMatch.scientific_name[0]
                        : topMatch.scientific_name;
                    results.confidence = topMatch.probability;
                }
            }
        } catch (e: any) {
            results.raw.perenualError = e.message;
        }

        /**
         * 2. CALL KINDWISE PLANT HEALTH API
         */
        try {
            const options = {
                hostname: 'api.kindwise.com',
                path: '/v1/plant_health/identifications',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Api-Key': process.env.KINDWISE_API_KEY || '',
                }
            };

            const kindwiseRes = await httpsRequest(options, {
                images: [`data:image/jpeg;base64,${base64Image}`],
            });

            results.raw.kindwiseStatus = kindwiseRes.status;
            results.raw.kindwise = kindwiseRes.data;

            if (kindwiseRes.status >= 200 && kindwiseRes.status < 300) {
                const data = kindwiseRes.data;
                if (!results.plantName && data.result?.classification?.suggestions?.[0]) {
                    const plantSuggest = data.result.classification.suggestions[0];
                    results.plantName = plantSuggest.name;
                    results.scientificName = plantSuggest.scientific_name;
                }

                if (data.result?.disease?.suggestions?.[0]) {
                    const disease = data.result.disease.suggestions[0];
                    results.diseaseName = disease.name;
                    if (disease.details?.treatment) {
                        const t = disease.details.treatment;
                        const remedySteps = [
                            ...(t.biological || []),
                            ...(t.chemical || []),
                            ...(t.prevention || []),
                        ];
                        results.remedy = remedySteps.length > 0 ? remedySteps.join('\n') : "Monitor closely.";
                    }
                }
            }
        } catch (e: any) {
            results.raw.kindwiseError = e.message;
        }

        // Final Validation
        if (!results.plantName && !results.diseaseName) {
            let specificError = "Unable to identify plant or pathogens. Please ensure the target leaf is in focus.";

            if (results.raw.perenualStatus === 403) {
                specificError = "Perenual AI identification rejected with 403 (Forbidden). Your API key might need a premium subscription for this feature.";
            } else if (results.raw.kindwiseStatus === 401) {
                specificError = "Kindwise Health API rejected the key with 401 (Unauthorized). Please check your Kindwise API key.";
            } else if (results.raw.perenualError || results.raw.kindwiseError) {
                specificError = `Neural connection failed: ${results.raw.perenualError || results.raw.kindwiseError}`;
            }

            // FALLBACK TO MOCK DATA IF PERENUAL/KINDWISE FAILED (Network/DNS issues)
            if (results.raw.perenualError || results.raw.kindwiseError) {
                console.log('External API Connectivity failed. Falling back to Smart Demo Mode.');
                const { crop } = body;
                let mock = getMockResult();
                if (crop) {
                    const matched = MOCK_PLANTS.find(p => p.plantName === crop || p.plantName.includes(crop));
                    if (matched) mock = matched;
                }
                return NextResponse.json({
                    ...mock,
                    debug: {
                        note: "Smart Demo Mode active. (External Network Unavailable)",
                        perenualError: results.raw.perenualError,
                        kindwiseError: results.raw.kindwiseError
                    }
                });
            }

            return NextResponse.json({
                plantName: null,
                scientificName: null,
                diseaseName: null,
                confidence: null,
                remedy: null,
                error: specificError,
                debug: {
                    perenualStatus: results.raw.perenualStatus,
                    perenualError: results.raw.perenualError,
                    kindwiseStatus: results.raw.kindwiseStatus,
                    kindwiseError: results.raw.kindwiseError,
                }
            }, { status: 200 });
        }

        return NextResponse.json({
            ...results,
            debug: {
                perenualStatus: results.raw.perenualStatus,
                kindwiseStatus: results.raw.kindwiseStatus,
            }
        });

    } catch (error: any) {
        console.error('Scan API Handler Panic:', error);
        return NextResponse.json({ error: 'Internal system fault', details: error.message }, { status: 500 });
    }
}
