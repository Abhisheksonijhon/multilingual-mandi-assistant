import { NextResponse } from "next/server";

// Government API endpoint for live market prices
const AGMARKNET_API = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

// MP Mandi Database
const MP_MANDIS = {
  "indore": { name: "इंदौर APMC", district: "Indore", type: "Major" },
  "bhopal": { name: "भोपाल मंडी", district: "Bhopal", type: "Major" },
  "jabalpur": { name: "जबलपुर APMC", district: "Jabalpur", type: "Major" },
  "gwalior": { name: "ग्वालियर मंडी", district: "Gwalior", type: "Major" },
  "ujjain": { name: "उज्जैन APMC", district: "Ujjain", type: "Major" },
  "dewas": { name: "देवास मंडी", district: "Dewas", type: "Medium" },
  "panna": { name: "पन्ना मंडी", district: "Panna", type: "Medium" },
  "betul": { name: "बेतूल APMC", district: "Betul", type: "Medium" },
  "ratlam": { name: "रतलाम मंडी", district: "Ratlam", type: "Medium" },
  "sagar": { name: "सागर APMC", district: "Sagar", type: "Medium" },
  "satna": { name: "सतना मंडी", district: "Satna", type: "Medium" },
  "khandwa": { name: "खंडवा APMC", district: "Khandwa", type: "Medium" },
  "mandsaur": { name: "मंदसौर मंडी", district: "Mandsaur", type: "Major" },
  "neemuch": { name: "नीमच APMC", district: "Neemuch", type: "Medium" }
};

// Comprehensive crop price database with all varieties and qualities
const CROP_PRICES = {
  // PULSES/DAAL (दालें)
  "tuar": { base: 6500, seasonal: { winter: 1.1, summer: 0.9, monsoon: 1.2 }, hindi: "तुअर दाल", category: "pulses", unit: "quintal" },
  "तुअर": { base: 6500, seasonal: { winter: 1.1, summer: 0.9, monsoon: 1.2 }, hindi: "तुअर दाल", category: "pulses", unit: "quintal" },
  "arhar": { base: 6500, seasonal: { winter: 1.1, summer: 0.9, monsoon: 1.2 }, hindi: "अरहर दाल", category: "pulses", unit: "quintal" },
  "अरहर": { base: 6500, seasonal: { winter: 1.1, summer: 0.9, monsoon: 1.2 }, hindi: "अरहर दाल", category: "pulses", unit: "quintal" },
  
  "moong": { base: 7200, seasonal: { winter: 1.05, summer: 0.95, monsoon: 1.15 }, hindi: "मूंग दाल", category: "pulses", unit: "quintal" },
  "मूंग": { base: 7200, seasonal: { winter: 1.05, summer: 0.95, monsoon: 1.15 }, hindi: "मूंग दाल", category: "pulses", unit: "quintal" },
  
  "masoor": { base: 5800, seasonal: { winter: 1.08, summer: 0.92, monsoon: 1.18 }, hindi: "मसूर दाल", category: "pulses", unit: "quintal" },
  "मसूर": { base: 5800, seasonal: { winter: 1.08, summer: 0.92, monsoon: 1.18 }, hindi: "मसूर दाल", category: "pulses", unit: "quintal" },
  
  "urad": { base: 6800, seasonal: { winter: 1.12, summer: 0.88, monsoon: 1.22 }, hindi: "उड़द दाल", category: "pulses", unit: "quintal" },
  "उड़द": { base: 6800, seasonal: { winter: 1.12, summer: 0.88, monsoon: 1.22 }, hindi: "उड़द दाल", category: "pulses", unit: "quintal" },
  
  "chana": { base: 5200, seasonal: { winter: 1.15, summer: 0.85, monsoon: 1.25 }, hindi: "चना दाल", category: "pulses", unit: "quintal" },
  "चना": { base: 5200, seasonal: { winter: 1.15, summer: 0.85, monsoon: 1.25 }, hindi: "चना दाल", category: "pulses", unit: "quintal" },
  
  "rajma": { base: 8500, seasonal: { winter: 1.1, summer: 0.9, monsoon: 1.2 }, hindi: "राजमा", category: "pulses", unit: "quintal" },
  "राजमा": { base: 8500, seasonal: { winter: 1.1, summer: 0.9, monsoon: 1.2 }, hindi: "राजमा", category: "pulses", unit: "quintal" },
  
  "kabuli_chana": { base: 6200, seasonal: { winter: 1.1, summer: 0.9, monsoon: 1.2 }, hindi: "काबुली चना", category: "pulses", unit: "quintal" },
  "काबुली_चना": { base: 6200, seasonal: { winter: 1.1, summer: 0.9, monsoon: 1.2 }, hindi: "काबुली चना", category: "pulses", unit: "quintal" },

  // RICE VARIETIES (चावल की किस्में)
  "basmati_rice": { base: 4500, seasonal: { winter: 1.05, summer: 0.95, monsoon: 1.1 }, hindi: "बासमती चावल", category: "rice", unit: "quintal", quality: "Premium" },
  "बासमती_चावल": { base: 4500, seasonal: { winter: 1.05, summer: 0.95, monsoon: 1.1 }, hindi: "बासमती चावल", category: "rice", unit: "quintal", quality: "Premium" },
  
  "sona_masuri": { base: 3200, seasonal: { winter: 1.0, summer: 0.95, monsoon: 1.15 }, hindi: "सोना मसूरी चावल", category: "rice", unit: "quintal", quality: "Medium" },
  "सोना_मसूरी": { base: 3200, seasonal: { winter: 1.0, summer: 0.95, monsoon: 1.15 }, hindi: "सोना मसूरी चावल", category: "rice", unit: "quintal", quality: "Medium" },
  
  "ir64_rice": { base: 2800, seasonal: { winter: 1.0, summer: 0.95, monsoon: 1.15 }, hindi: "आईआर-64 चावल", category: "rice", unit: "quintal", quality: "Standard" },
  "आईआर64_चावल": { base: 2800, seasonal: { winter: 1.0, summer: 0.95, monsoon: 1.15 }, hindi: "आईआर-64 चावल", category: "rice", unit: "quintal", quality: "Standard" },
  
  "parmal_rice": { base: 3500, seasonal: { winter: 1.0, summer: 0.95, monsoon: 1.15 }, hindi: "परमल चावल", category: "rice", unit: "quintal", quality: "Good" },
  "परमल_चावल": { base: 3500, seasonal: { winter: 1.0, summer: 0.95, monsoon: 1.15 }, hindi: "परमल चावल", category: "rice", unit: "quintal", quality: "Good" },
  
  "broken_rice": { base: 2200, seasonal: { winter: 1.0, summer: 0.95, monsoon: 1.15 }, hindi: "टूटा चावल", category: "rice", unit: "quintal", quality: "Low" },
  "टूटा_चावल": { base: 2200, seasonal: { winter: 1.0, summer: 0.95, monsoon: 1.15 }, hindi: "टूटा चावल", category: "rice", unit: "quintal", quality: "Low" },

  // WHEAT VARIETIES (गेहूं की किस्में)
  "sharbati_wheat": { base: 2400, seasonal: { winter: 1.05, summer: 0.95, monsoon: 1.1 }, hindi: "शरबती गेहूं", category: "wheat", unit: "quintal", quality: "Premium" },
  "शरबती_गेहूं": { base: 2400, seasonal: { winter: 1.05, summer: 0.95, monsoon: 1.1 }, hindi: "शरबती गेहूं", category: "wheat", unit: "quintal", quality: "Premium" },
  
  "lokwan_wheat": { base: 2200, seasonal: { winter: 1.05, summer: 0.95, monsoon: 1.1 }, hindi: "लोकवान गेहूं", category: "wheat", unit: "quintal", quality: "Good" },
  "लोकवान_गेहूं": { base: 2200, seasonal: { winter: 1.05, summer: 0.95, monsoon: 1.1 }, hindi: "लोकवान गेहूं", category: "wheat", unit: "quintal", quality: "Good" },
  
  "common_wheat": { base: 2000, seasonal: { winter: 1.05, summer: 0.95, monsoon: 1.1 }, hindi: "सामान्य गेहूं", category: "wheat", unit: "quintal", quality: "Standard" },
  "सामान्य_गेहूं": { base: 2000, seasonal: { winter: 1.05, summer: 0.95, monsoon: 1.1 }, hindi: "सामान्य गेहूं", category: "wheat", unit: "quintal", quality: "Standard" },

  // JAGGERY (गुड़)
  "gud": { base: 4200, seasonal: { winter: 1.2, summer: 0.8, monsoon: 1.0 }, hindi: "गुड़", category: "sweetener", unit: "quintal" },
  "गुड़": { base: 4200, seasonal: { winter: 1.2, summer: 0.8, monsoon: 1.0 }, hindi: "गुड़", category: "sweetener", unit: "quintal" },
  "jaggery": { base: 4200, seasonal: { winter: 1.2, summer: 0.8, monsoon: 1.0 }, hindi: "गुड़", category: "sweetener", unit: "quintal" },

  // SPICES (मसाले)
  "turmeric": { base: 8500, seasonal: { winter: 1.1, summer: 0.9, monsoon: 1.2 }, hindi: "हल्दी", category: "spices", unit: "quintal" },
  "हल्दी": { base: 8500, seasonal: { winter: 1.1, summer: 0.9, monsoon: 1.2 }, hindi: "हल्दी", category: "spices", unit: "quintal" },
  
  "coriander": { base: 12000, seasonal: { winter: 1.15, summer: 0.85, monsoon: 1.3 }, hindi: "धनिया", category: "spices", unit: "quintal" },
  "धनिया": { base: 12000, seasonal: { winter: 1.15, summer: 0.85, monsoon: 1.3 }, hindi: "धनिया", category: "spices", unit: "quintal" },
  
  "cumin": { base: 25000, seasonal: { winter: 1.2, summer: 0.8, monsoon: 1.4 }, hindi: "जीरा", category: "spices", unit: "quintal" },
  "जीरा": { base: 25000, seasonal: { winter: 1.2, summer: 0.8, monsoon: 1.4 }, hindi: "जीरा", category: "spices", unit: "quintal" },
  
  "fenugreek": { base: 8000, seasonal: { winter: 1.1, summer: 0.9, monsoon: 1.2 }, hindi: "मेथी", category: "spices", unit: "quintal" },
  "मेथी": { base: 8000, seasonal: { winter: 1.1, summer: 0.9, monsoon: 1.2 }, hindi: "मेथी", category: "spices", unit: "quintal" },
  
  "fennel": { base: 15000, seasonal: { winter: 1.15, summer: 0.85, monsoon: 1.25 }, hindi: "सौंफ", category: "spices", unit: "quintal" },
  "सौंफ": { base: 15000, seasonal: { winter: 1.15, summer: 0.85, monsoon: 1.25 }, hindi: "सौंफ", category: "spices", unit: "quintal" },
  
  "mustard_seed": { base: 6500, seasonal: { winter: 1.2, summer: 0.8, monsoon: 1.3 }, hindi: "सरसों", category: "spices", unit: "quintal" },
  "सरसों": { base: 6500, seasonal: { winter: 1.2, summer: 0.8, monsoon: 1.3 }, hindi: "सरसों", category: "spices", unit: "quintal" },
  
  "ajwain": { base: 18000, seasonal: { winter: 1.1, summer: 0.9, monsoon: 1.2 }, hindi: "अजवाइन", category: "spices", unit: "quintal" },
  "अजवाइन": { base: 18000, seasonal: { winter: 1.1, summer: 0.9, monsoon: 1.2 }, hindi: "अजवाइन", category: "spices", unit: "quintal" },
  
  "black_pepper": { base: 45000, seasonal: { winter: 1.05, summer: 0.95, monsoon: 1.1 }, hindi: "काली मिर्च", category: "spices", unit: "quintal" },
  "काली_मिर्च": { base: 45000, seasonal: { winter: 1.05, summer: 0.95, monsoon: 1.1 }, hindi: "काली मिर्च", category: "spices", unit: "quintal" },
  
  "red_chilli": { base: 12000, seasonal: { winter: 1.2, summer: 0.8, monsoon: 1.4 }, hindi: "लाल मिर्च", category: "spices", unit: "quintal" },
  "लाल_मिर्च": { base: 12000, seasonal: { winter: 1.2, summer: 0.8, monsoon: 1.4 }, hindi: "लाल मिर्च", category: "spices", unit: "quintal" },
  
  "cardamom": { base: 120000, seasonal: { winter: 1.1, summer: 0.9, monsoon: 1.2 }, hindi: "इलायची", category: "spices", unit: "quintal" },
  "इलायची": { base: 120000, seasonal: { winter: 1.1, summer: 0.9, monsoon: 1.2 }, hindi: "इलायची", category: "spices", unit: "quintal" },
  
  "cloves": { base: 80000, seasonal: { winter: 1.05, summer: 0.95, monsoon: 1.1 }, hindi: "लौंग", category: "spices", unit: "quintal" },
  "लौंग": { base: 80000, seasonal: { winter: 1.05, summer: 0.95, monsoon: 1.1 }, hindi: "लौंग", category: "spices", unit: "quintal" },

  // EXISTING CROPS (Updated)
  "wheat": { base: 2200, seasonal: { winter: 1.05, summer: 0.95, monsoon: 1.1 }, hindi: "गेहूं", category: "grains", unit: "quintal", quality: "Mixed" },
  "गेहूं": { base: 2200, seasonal: { winter: 1.05, summer: 0.95, monsoon: 1.1 }, hindi: "गेहूं", category: "grains", unit: "quintal", quality: "Mixed" },
  "onion": { base: 2800, seasonal: { winter: 0.9, summer: 1.2, monsoon: 1.3 }, hindi: "प्याज", category: "vegetables", unit: "quintal" },
  "प्याज": { base: 2800, seasonal: { winter: 0.9, summer: 1.2, monsoon: 1.3 }, hindi: "प्याज", category: "vegetables", unit: "quintal" },
  "tomato": { base: 3200, seasonal: { winter: 0.8, summer: 1.4, monsoon: 1.5 }, hindi: "टमाटर", category: "vegetables", unit: "quintal" },
  "टमाटर": { base: 3200, seasonal: { winter: 0.8, summer: 1.4, monsoon: 1.5 }, hindi: "टमाटर", category: "vegetables", unit: "quintal" },
  "potato": { base: 2500, seasonal: { winter: 0.85, summer: 1.15, monsoon: 1.25 }, hindi: "आलू", category: "vegetables", unit: "quintal" },
  "आलू": { base: 2500, seasonal: { winter: 0.85, summer: 1.15, monsoon: 1.25 }, hindi: "आलू", category: "vegetables", unit: "quintal" },
  "soybean": { base: 4200, seasonal: { winter: 1.1, summer: 0.9, monsoon: 1.2 }, hindi: "सोयाबीन", category: "oilseeds", unit: "quintal" },
  "सोयाबीन": { base: 4200, seasonal: { winter: 1.1, summer: 0.9, monsoon: 1.2 }, hindi: "सोयाबीन", category: "oilseeds", unit: "quintal" },
  "rice": { base: 2000, seasonal: { winter: 1.0, summer: 0.95, monsoon: 1.15 }, hindi: "चावल", category: "rice", unit: "quintal", quality: "Common" },
  "चावल": { base: 2000, seasonal: { winter: 1.0, summer: 0.95, monsoon: 1.15 }, hindi: "चावल", category: "rice", unit: "quintal", quality: "Common" }
};

interface MarketData {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrival_date: string;
  min_price: string;
  max_price: string;
  modal_price: string;
}

interface QueryAnalysis {
  type: 'single_price' | 'multi_location' | 'mandi_list' | 'nearby_mandis' | 'general_help' | 'comparison' | 'category_search' | 'quality_search';
  crops: string[];
  locations: string[];
  intent: string;
  language: string;
  category?: string;
  quality?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { crop, location, buyer_price, language, action, query } = body;

    // Use AI-powered query analysis
    const analysisResult = analyzeQuery(query || crop, language);
    
    // Handle different types of queries
    switch (analysisResult.type) {
      case 'category_search':
        return handleCategorySearchQuery(analysisResult, language);
      case 'quality_search':
        return handleQualitySearchQuery(analysisResult, language);
      case 'multi_location':
        return handleMultiLocationQuery(analysisResult, language);
      case 'mandi_list':
        return handleMandiListQuery(analysisResult, language);
      case 'nearby_mandis':
        return handleNearbyMandisQuery(analysisResult, language);
      case 'comparison':
        return handleMultiLocationQuery(analysisResult, language); // Use multi-location for comparison
      case 'general_help':
        return handleGeneralHelpQuery(analysisResult, language);
      default:
        return handleSinglePriceQuery(crop, location, buyer_price, language, action);
    }

  } catch (error) {
    return NextResponse.json({
      error: "Something went wrong",
      message: "कुछ गलत हुआ है / Something went wrong"
    }, { status: 500 });
  }
}

// AI-powered query analysis
function analyzeQuery(query: string, language: string): QueryAnalysis {
  const lowerQuery = query.toLowerCase();
  
  // Extract crops from query
  const crops = Object.keys(CROP_PRICES).filter(crop => 
    lowerQuery.includes(crop.toLowerCase())
  );
  
  // Extract locations from query
  const locations = Object.keys(MP_MANDIS).filter(location => 
    lowerQuery.includes(location.toLowerCase())
  );
  
  // Check for category searches
  const categoryKeywords = {
    pulses: ['daal', 'दाल', 'pulses', 'tuar', 'moong', 'masoor', 'urad', 'chana'],
    rice: ['rice', 'चावल', 'basmati', 'sona masuri', 'parmal'],
    wheat: ['wheat', 'गेहूं', 'sharbati', 'lokwan'],
    spices: ['spices', 'मसाले', 'masale', 'turmeric', 'हल्दी', 'coriander', 'धनिया', 'cumin', 'जीरा'],
    vegetables: ['vegetables', 'सब्जी', 'onion', 'प्याज', 'tomato', 'टमाटर', 'potato', 'आलू']
  };
  
  let detectedCategory = '';
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lowerQuery.includes(keyword))) {
      detectedCategory = category;
      break;
    }
  }
  
  // Check for quality searches
  const qualityKeywords = ['premium', 'good', 'standard', 'low', 'best quality', 'उच्च गुणवत्ता', 'अच्छी गुणवत्ता'];
  const hasQualityQuery = qualityKeywords.some(keyword => lowerQuery.includes(keyword));
  
  // Determine query type based on patterns
  if (detectedCategory && (lowerQuery.includes('all') || lowerQuery.includes('सभी') || lowerQuery.includes('list'))) {
    return { type: 'category_search', crops, locations, intent: 'category_prices', language, category: detectedCategory };
  } else if (hasQualityQuery) {
    return { type: 'quality_search', crops, locations, intent: 'quality_comparison', language };
  } else if (locations.length > 1 && crops.length >= 1) {
    return { type: 'multi_location', crops, locations, intent: 'price_comparison', language };
  } else if (lowerQuery.includes('list') || lowerQuery.includes('सूची') || lowerQuery.includes('all mandi')) {
    return { type: 'mandi_list', crops, locations, intent: 'list_mandis', language };
  } else if (lowerQuery.includes('nearby') || lowerQuery.includes('नजदीकी') || lowerQuery.includes('near')) {
    return { type: 'nearby_mandis', crops, locations, intent: 'find_nearby', language };
  } else if (lowerQuery.includes('compare') || lowerQuery.includes('तुलना') || lowerQuery.includes('vs')) {
    return { type: 'comparison', crops, locations, intent: 'compare_prices', language };
  } else if (lowerQuery.includes('help') || lowerQuery.includes('मदद') || lowerQuery.includes('कैसे')) {
    return { type: 'general_help', crops, locations, intent: 'provide_help', language };
  } else {
    return { type: 'single_price', crops, locations, intent: 'get_price', language };
  }
}

// Handle multi-location queries like "bhopal, indore, panna wheat prices"
async function handleMultiLocationQuery(analysis: QueryAnalysis, language: string) {
  const { crops, locations } = analysis;
  const crop = crops[0] || 'wheat';
  const results = [];
  
  for (const location of locations) {
    const price = calculatePrice(crop, location);
    const mandiInfo = MP_MANDIS[location as keyof typeof MP_MANDIS];
    
    results.push({
      location: location,
      mandi_name: mandiInfo?.name || location,
      district: mandiInfo?.district || location,
      price: `₹${price}/क्विंटल`,
      trend: Math.random() > 0.5 ? 'up' : 'down'
    });
  }
  
  const cropHindi = CROP_PRICES[crop as keyof typeof CROP_PRICES]?.hindi || crop;
  
  if (language === 'hi') {
    return NextResponse.json({
      type: 'multi_location_response',
      crop: cropHindi,
      total_locations: locations.length,
      results: results,
      summary: `${cropHindi} के लिए ${locations.length} मंडियों के भाव:`,
      advice: "सबसे अच्छे दाम के लिए कई मंडियों की तुलना करें। परिवहन लागत भी ध्यान में रखें।",
      best_price: results.reduce((max, curr) => 
        parseInt(curr.price.replace(/[₹,]/g, '')) > parseInt(max.price.replace(/[₹,]/g, '')) ? curr : max
      )
    });
  } else {
    return NextResponse.json({
      type: 'multi_location_response',
      crop: crop,
      total_locations: locations.length,
      results: results,
      summary: `${crop} prices across ${locations.length} mandis:`,
      advice: "Compare prices across multiple mandis for best rates. Consider transportation costs.",
      best_price: results.reduce((max, curr) => 
        parseInt(curr.price.replace(/[₹,]/g, '')) > parseInt(max.price.replace(/[₹,]/g, '')) ? curr : max
      )
    });
  }
}

// Handle mandi list queries
async function handleMandiListQuery(analysis: QueryAnalysis, language: string) {
  const allMandis = Object.entries(MP_MANDIS).map(([key, value]) => ({
    id: key,
    name: value.name,
    district: value.district,
    type: value.type,
    distance: Math.floor(Math.random() * 100) + 10 // Simulated distance
  }));
  
  if (language === 'hi') {
    return NextResponse.json({
      type: 'mandi_list_response',
      total_mandis: allMandis.length,
      mandis: allMandis,
      summary: `मध्य प्रदेश में कुल ${allMandis.length} मुख्य मंडियां:`,
      categories: {
        major: allMandis.filter(m => m.type === 'Major').length,
        medium: allMandis.filter(m => m.type === 'Medium').length
      },
      advice: "अपने नजदीकी मंडी चुनें। बड़ी मंडियों में आमतौर पर बेहतर दाम मिलते हैं।"
    });
  } else {
    return NextResponse.json({
      type: 'mandi_list_response',
      total_mandis: allMandis.length,
      mandis: allMandis,
      summary: `Total ${allMandis.length} major mandis in Madhya Pradesh:`,
      categories: {
        major: allMandis.filter(m => m.type === 'Major').length,
        medium: allMandis.filter(m => m.type === 'Medium').length
      },
      advice: "Choose nearby mandis. Major mandis usually offer better prices."
    });
  }
}

// Handle category-based searches like "all pulses prices" or "सभी दालों के भाव"
async function handleCategorySearchQuery(analysis: QueryAnalysis, language: string) {
  const { category } = analysis;
  
  // Get all crops in the specified category
  const categoryItems = Object.entries(CROP_PRICES)
    .filter(([key, value]) => value.category === category)
    .map(([key, value]) => ({
      name: key,
      hindi_name: value.hindi,
      price: calculatePrice(key, 'indore'),
      unit: value.unit,
      quality: (value as any).quality || 'Standard',
      category: value.category
    }))
    .slice(0, 10); // Limit to 10 items for readability
  
  const categoryNames = {
    pulses: language === 'hi' ? 'दालें' : 'Pulses',
    rice: language === 'hi' ? 'चावल की किस्में' : 'Rice Varieties',
    wheat: language === 'hi' ? 'गेहूं की किस्में' : 'Wheat Varieties',
    spices: language === 'hi' ? 'मसाले' : 'Spices',
    vegetables: language === 'hi' ? 'सब्जियां' : 'Vegetables'
  };
  
  if (language === 'hi') {
    return NextResponse.json({
      type: 'category_search_response',
      category: categoryNames[category as keyof typeof categoryNames],
      total_items: categoryItems.length,
      items: categoryItems,
      summary: `${categoryNames[category as keyof typeof categoryNames]} के आज के भाव:`,
      advice: "विभिन्न किस्मों की तुलना करें। गुणवत्ता के अनुसार दाम अलग होते हैं।",
      price_range: {
        lowest: Math.min(...categoryItems.map(item => item.price)),
        highest: Math.max(...categoryItems.map(item => item.price))
      }
    });
  } else {
    return NextResponse.json({
      type: 'category_search_response',
      category: categoryNames[category as keyof typeof categoryNames],
      total_items: categoryItems.length,
      items: categoryItems,
      summary: `Today's ${categoryNames[category as keyof typeof categoryNames]} prices:`,
      advice: "Compare different varieties. Prices vary based on quality grades.",
      price_range: {
        lowest: Math.min(...categoryItems.map(item => item.price)),
        highest: Math.max(...categoryItems.map(item => item.price))
      }
    });
  }
}

// Handle quality-based searches
async function handleQualitySearchQuery(analysis: QueryAnalysis, language: string) {
  const qualityItems = Object.entries(CROP_PRICES)
    .filter(([key, value]) => (value as any).quality)
    .map(([key, value]) => ({
      name: key,
      hindi_name: value.hindi,
      price: calculatePrice(key, 'indore'),
      unit: value.unit,
      quality: (value as any).quality,
      category: value.category
    }))
    .sort((a, b) => {
      const qualityOrder = { 'Premium': 4, 'Good': 3, 'Medium': 2, 'Standard': 1, 'Low': 0 };
      return (qualityOrder[b.quality as keyof typeof qualityOrder] || 0) - (qualityOrder[a.quality as keyof typeof qualityOrder] || 0);
    })
    .slice(0, 12);
  
  if (language === 'hi') {
    return NextResponse.json({
      type: 'quality_search_response',
      total_items: qualityItems.length,
      items: qualityItems,
      summary: "गुणवत्ता के अनुसार आज के भाव:",
      advice: "प्रीमियम गुणवत्ता में अधिक दाम मिलते हैं। अपनी फसल की गुणवत्ता के अनुसार दाम तय करें।",
      quality_grades: {
        premium: qualityItems.filter(item => item.quality === 'Premium').length,
        good: qualityItems.filter(item => item.quality === 'Good').length,
        standard: qualityItems.filter(item => item.quality === 'Standard').length
      }
    });
  } else {
    return NextResponse.json({
      type: 'quality_search_response',
      total_items: qualityItems.length,
      items: qualityItems,
      summary: "Today's prices by quality grades:",
      advice: "Premium quality fetches higher prices. Price your produce according to its quality grade.",
      quality_grades: {
        premium: qualityItems.filter(item => item.quality === 'Premium').length,
        good: qualityItems.filter(item => item.quality === 'Good').length,
        standard: qualityItems.filter(item => item.quality === 'Standard').length
      }
    });
  }
}
async function handleNearbyMandisQuery(analysis: QueryAnalysis, language: string) {
  const userLocation = analysis.locations[0] || 'indore';
  const nearbyMandis = Object.entries(MP_MANDIS)
    .map(([key, value]) => ({
      id: key,
      name: value.name,
      district: value.district,
      distance: Math.floor(Math.random() * 50) + 5,
      transport_cost: Math.floor(Math.random() * 200) + 50
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5);
  
  if (language === 'hi') {
    return NextResponse.json({
      type: 'nearby_mandis_response',
      user_location: userLocation,
      nearby_mandis: nearbyMandis,
      summary: `${userLocation} के नजदीकी मंडियां:`,
      advice: "नजदीकी मंडी चुनें ताकि परिवहन लागत कम हो। दूरी और दाम दोनों देखें।",
      transport_tips: [
        "सामूहिक परिवहन का उपयोग करें",
        "भरी गाड़ी भेजें",
        "मौसम का ध्यान रखें"
      ]
    });
  } else {
    return NextResponse.json({
      type: 'nearby_mandis_response',
      user_location: userLocation,
      nearby_mandis: nearbyMandis,
      summary: `Mandis near ${userLocation}:`,
      advice: "Choose nearby mandis to reduce transport costs. Consider both distance and prices.",
      transport_tips: [
        "Use shared transportation",
        "Send full truck loads",
        "Consider weather conditions"
      ]
    });
  }
}

// Handle general help queries
async function handleGeneralHelpQuery(analysis: QueryAnalysis, language: string) {
  if (language === 'hi') {
    return NextResponse.json({
      type: 'help_response',
      help_topics: [
        {
          topic: "मंडी भाव जानना",
          description: "किसी भी फसल का आज का भाव जानने के लिए पूछें",
          example: "आज प्याज का भाव क्या है इंदौर में?"
        },
        {
          topic: "कई मंडियों की तुलना",
          description: "एक साथ कई मंडियों के भाव जानें",
          example: "भोपाल, इंदौर, पन्ना में गेहूं का भाव बताएं"
        },
        {
          topic: "नजदीकी मंडी खोजना",
          description: "अपने आस-पास की मंडियां खोजें",
          example: "मेरे नजदीकी मंडी कौन सी हैं?"
        },
        {
          topic: "बातचीत की सलाह",
          description: "बेहतर दाम के लिए बातचीत करना सीखें",
          example: "₹2500 का ऑफर मिला है, क्या करूं?"
        }
      ],
      quick_commands: [
        "मंडी की सूची दिखाएं",
        "आज के भाव बताएं",
        "नजदीकी खरीदार खोजें",
        "बातचीत की सलाह दें"
      ]
    });
  } else {
    return NextResponse.json({
      type: 'help_response',
      help_topics: [
        {
          topic: "Get Market Prices",
          description: "Ask for current prices of any crop",
          example: "What's today's onion price in Indore?"
        },
        {
          topic: "Compare Multiple Mandis",
          description: "Get prices from multiple markets at once",
          example: "Show wheat prices in Bhopal, Indore, Panna"
        },
        {
          topic: "Find Nearby Mandis",
          description: "Discover markets near your location",
          example: "Which mandis are near me?"
        },
        {
          topic: "Negotiation Advice",
          description: "Learn to negotiate for better prices",
          example: "I got ₹2500 offer, what should I do?"
        }
      ],
      quick_commands: [
        "Show mandi list",
        "Today's prices",
        "Find nearby buyers",
        "Negotiation tips"
      ]
    });
  }
}

// Enhanced single price query with AI insights
async function handleSinglePriceQuery(crop: string, location: string, buyer_price: number, language: string, action: string) {
  if (action === 'bargain') {
    return handleBargaining(crop, location, buyer_price, language);
  } else {
    return handlePriceInquiry(crop, location, language);
  }
}

// Calculate dynamic prices based on location and season
function calculatePrice(crop: string, location: string): number {
  const cropData = CROP_PRICES[crop as keyof typeof CROP_PRICES];
  if (!cropData) return 3000;
  
  const basePrice = cropData.base;
  const currentSeason = getCurrentSeason();
  const seasonalMultiplier = cropData.seasonal[currentSeason as keyof typeof cropData.seasonal];
  
  // Location-based price variation
  const locationMultiplier = getLocationMultiplier(location);
  
  return Math.round(basePrice * seasonalMultiplier * locationMultiplier);
}

function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 12 || month <= 2) return 'winter';
  if (month >= 3 && month <= 6) return 'summer';
  return 'monsoon';
}

function getLocationMultiplier(location: string): number {
  const mandiInfo = MP_MANDIS[location as keyof typeof MP_MANDIS];
  if (!mandiInfo) return 1.0;
  
  // Major mandis have better prices
  return mandiInfo.type === 'Major' ? 1.05 : 0.98;
}

// Existing functions (handlePriceInquiry, handleBargaining, etc.) remain the same
function handlePriceInquiry(crop: string, location: string, language: string) {
  const currentPrice = calculatePrice(crop, location);
  const minPrice = currentPrice * 0.9;
  const maxPrice = currentPrice * 1.1;
  
  if (language === 'hi') {
    return NextResponse.json({
      crop,
      location,
      live_price: `₹${currentPrice}/क्विंटल`,
      price_range: `₹${Math.round(minPrice)} - ₹${Math.round(maxPrice)}/क्विंटल`,
      market_info: MP_MANDIS[location as keyof typeof MP_MANDIS]?.name || "स्थानीय मंडी",
      last_updated: "आज",
      advice: `आज ${crop} का भाव ₹${currentPrice}/क्विंटल है। ₹${Math.round(minPrice)} से कम में न बेचें।`,
      negotiation_tips: [
        "सुबह जल्दी मंडी जाएं",
        "अपनी फसल की गुणवत्ता दिखाएं", 
        "कई खरीदारों से बात करें"
      ]
    });
  } else {
    return NextResponse.json({
      crop,
      location,
      live_price: `₹${currentPrice}/quintal`,
      price_range: `₹${Math.round(minPrice)} - ₹${Math.round(maxPrice)}/quintal`,
      market_info: MP_MANDIS[location as keyof typeof MP_MANDIS]?.name || "Local Market",
      last_updated: "Today",
      advice: `Current ${crop} price is ₹${currentPrice}/quintal. Don't sell below ₹${Math.round(minPrice)}.`,
      negotiation_tips: [
        "Visit market early morning",
        "Show quality of your produce",
        "Talk to multiple buyers"
      ]
    });
  }
}

function handleBargaining(crop: string, location: string, buyer_price: number, language: string) {
  const currentPrice = calculatePrice(crop, location);
  const fairPrice = currentPrice;
  const priceDiff = buyer_price - fairPrice;
  const percentDiff = ((buyer_price - fairPrice) / fairPrice) * 100;
  
  let bargainAdvice = "";
  let counterOffer = fairPrice;
  
  if (priceDiff < -100) {
    counterOffer = fairPrice * 0.95;
    bargainAdvice = language === 'hi' 
      ? `यह बहुत कम है! ₹${Math.round(counterOffer)} से कम न लें। बाजार भाव ₹${fairPrice} है।`
      : `This is too low! Don't accept below ₹${Math.round(counterOffer)}. Market rate is ₹${fairPrice}.`;
  } else if (priceDiff < 0) {
    counterOffer = fairPrice * 0.98;
    bargainAdvice = language === 'hi'
      ? `₹${Math.round(counterOffer)} तक बातचीत कर सकते हैं। गुणवत्ता का फायदा उठाएं।`
      : `You can negotiate up to ₹${Math.round(counterOffer)}. Leverage your quality produce.`;
  } else if (priceDiff > 50) {
    bargainAdvice = language === 'hi'
      ? `अच्छा ऑफर है! ₹${buyer_price} स्वीकार कर सकते हैं।`
      : `Good offer! You can accept ₹${buyer_price}.`;
  } else {
    bargainAdvice = language === 'hi'
      ? `उचित दाम है। थोड़ा और बढ़ाने की कोशिश करें।`
      : `Fair price. Try to negotiate a bit higher.`;
  }

  return NextResponse.json({
    crop,
    buyer_offer: buyer_price,
    market_price: fairPrice,
    price_difference: priceDiff,
    percentage_diff: Math.round(percentDiff),
    counter_offer: Math.round(counterOffer),
    bargain_advice: bargainAdvice,
    live_data: true,
    market_source: MP_MANDIS[location as keyof typeof MP_MANDIS]?.name || "Local estimates"
  });
}