"use client";

import { useState, useEffect, useRef } from "react";

// Custom hook for client-side only rendering
function useClientSide() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient;
}

interface PriceData {
  crop: string;
  location: string;
  live_price: string;
  price_range: string;
  market_info: string;
  last_updated: string;
  advice: string;
  negotiation_tips?: string[];
}

interface BargainData {
  crop: string;
  buyer_offer: number;
  market_price: number;
  price_difference: number;
  percentage_diff: number;
  counter_offer: number;
  bargain_advice: string;
  live_data: boolean;
  market_source: string;
}

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'price' | 'bargain' | 'chat';
  data?: PriceData | BargainData;
}

interface LiveUpdate {
  id: number;
  crop: string;
  market: string;
  price: string;
  trend: 'up' | 'down' | 'stable';
  timestamp: Date;
}

const LANGUAGES = [
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'bundeli', name: 'बुंदेली', flag: '🏛️' },
  { code: 'bagheli', name: 'बघेली', flag: '🌾' },
  { code: 'malvi', name: 'मालवी', flag: '🌻' },
  { code: 'nimadi', name: 'निमाड़ी', flag: '🌿' }
];

const QUICK_ACTIONS = [
  { id: 'price', text: 'भाव जानें', icon: '💰', color: 'bg-green-500' },
  { id: 'multi', text: 'कई मंडी तुलना', icon: '�', color: 'bg-blue-500' },
  { id: 'list', text: 'मंडी सूची', icon: '📋', color: 'bg-purple-500' },
  { id: 'nearby', text: 'नजदीकी मंडी', icon: '�', color: 'bg-orange-500' },
  { id: 'help', text: 'मदद', icon: '❓', color: 'bg-gray-500' }
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [bargainMode, setBargainMode] = useState(false);
  const [currentCrop, setCurrentCrop] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [liveUpdates, setLiveUpdates] = useState<LiveUpdate[]>([]);
  const [currentUpdateIndex, setCurrentUpdateIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isClient = useClientSide();

  useEffect(() => {
    setMounted(true);
    
    // Simulate welcome animation
    const timer = setTimeout(() => {
      setShowWelcomeAnimation(false);
      // Add welcome message with stable timestamp
      const welcomeTime = new Date();
      setMessages([{
        id: 1,
        text: "🧑‍🌾 नमस्ते किसान भाई! मैं आपका किसान बडी हूं।\n\n✅ लाइव मंडी भाव देखें\n💰 बेहतर दाम पर बेचें\n📊 सरकारी APMC डेटा\n🤝 बातचीत की सलाह\n\nHello Farmer! I'm your Kisan Buddy with live mandi prices!",
        isUser: false,
        timestamp: welcomeTime,
        type: 'chat'
      }]);
    }, 2000);

    // Initialize live updates with stable data
    initializeLiveUpdates();
    
    // Start live update ticker
    const interval = setInterval(() => {
      setCurrentUpdateIndex(prev => (prev + 1) % 5);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeLiveUpdates = () => {
    // Use stable timestamps to avoid hydration mismatch
    const baseTime = new Date('2024-01-26T10:00:00');
    const updates: LiveUpdate[] = [
      { id: 1, crop: 'प्याज', market: 'इंदौर APMC', price: '₹28/kg', trend: 'up', timestamp: new Date(baseTime.getTime()) },
      { id: 2, crop: 'टमाटर', market: 'भोपाल मंडी', price: '₹35/kg', trend: 'down', timestamp: new Date(baseTime.getTime() + 60000) },
      { id: 3, crop: 'आलू', market: 'जबलपुर', price: '₹22/kg', trend: 'stable', timestamp: new Date(baseTime.getTime() + 120000) },
      { id: 4, crop: 'गेहूं', market: 'उज्जैन', price: '₹2100/क्विंटल', trend: 'up', timestamp: new Date(baseTime.getTime() + 180000) },
      { id: 5, crop: 'सोयाबीन', market: 'देवास', price: '₹4200/क्विंटल', trend: 'up', timestamp: new Date(baseTime.getTime() + 240000) }
    ];
    setLiveUpdates(updates);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!mounted) {
    return null;
  }

  if (showWelcomeAnimation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <span className="text-white text-3xl">🧑‍🌾</span>
          </div>
          <h1 className="text-2xl font-bold text-green-800 mb-2">किसान बडी</h1>
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <p className="text-green-700 mt-2">लाइव मंडी से जुड़ रहे हैं...</p>
        </div>
      </div>
    );
  }

  async function sendMessage(action: 'price' | 'bargain' = 'price') {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
      type: action
    };

    setMessages(prev => [...prev, userMessage]);
    const query = inputText;
    setInputText("");
    setLoading(true);

    try {
      // Extract crop and location from user input
      const crop = extractCrop(query);
      const location = extractLocation(query) || "MP";
      const buyerPrice = extractPrice(query);

      setCurrentCrop(crop);
      setCurrentLocation(location);

      const res = await fetch("/api/mandi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop,
          location,
          buyer_price: buyerPrice,
          language: selectedLanguage,
          action,
          query // Send the full query for AI analysis
        }),
      });

      const data = await res.json();
      
      let formattedResponse = "";
      
      // Handle different response types from AI
      switch (data.type) {
        case 'category_search_response':
          formattedResponse = formatCategorySearchResponse(data);
          break;
        case 'quality_search_response':
          formattedResponse = formatQualitySearchResponse(data);
          break;
        case 'multi_location_response':
          formattedResponse = formatMultiLocationResponse(data);
          break;
        case 'mandi_list_response':
          formattedResponse = formatMandiListResponse(data);
          break;
        case 'nearby_mandis_response':
          formattedResponse = formatNearbyMandisResponse(data);
          break;
        case 'help_response':
          formattedResponse = formatHelpResponse(data);
          break;
        default:
          if (action === 'price') {
            formattedResponse = formatPriceResponse(data);
          } else {
            formattedResponse = formatBargainResponse(data);
          }
      }

      const botMessage: Message = {
        id: Date.now() + 1,
        text: formattedResponse,
        isUser: false,
        timestamp: new Date(),
        type: action,
        data
      };

      setMessages(prev => [...prev, botMessage]);
      
      if (action === 'price') {
        setBargainMode(true);
      }

    } catch {
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: `❌ क्षमा करें, कुछ गलत हुआ है। कृपया फिर से कोशिश करें।\n\nSorry, something went wrong. Please try again.`,
        isUser: false,
        timestamp: new Date(),
        type: 'chat'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }

  function formatPriceResponse(data: PriceData): string {
    return `🌾 **${data.crop}** - ${data.location}\n\n📊 **लाइव भाव / Live Price**: ${data.live_price}\n📈 **रेंज / Range**: ${data.price_range}\n🏪 **मंडी / Market**: ${data.market_info}\n⏰ **अपडेट / Updated**: ${data.last_updated}\n\n💡 **सलाह / Advice**: ${data.advice}\n\n🤝 **बातचीत टिप्स / Negotiation Tips**:\n${data.negotiation_tips?.map((tip: string, i: number) => `${i + 1}. ${tip}`).join('\n')}`;
  }

  function formatBargainResponse(data: BargainData): string {
    const emoji = data.price_difference > 0 ? "✅" : "⚠️";
    return `${emoji} **बातचीत विश्लेषण / Bargain Analysis**\n\n💰 **खरीदार का ऑफर / Buyer Offer**: ₹${data.buyer_offer}\n📊 **मार्केट रेट / Market Rate**: ₹${data.market_price}\n📈 **अंतर / Difference**: ${data.price_difference > 0 ? '+' : ''}₹${data.price_difference} (${data.percentage_diff}%)\n\n🎯 **काउंटर ऑफर / Counter Offer**: ₹${data.counter_offer}\n\n💡 **सलाह / Advice**: ${data.bargain_advice}\n\n📍 **डेटा स्रोत / Source**: ${data.live_data ? '🟢 Live Government Data' : '🟡 Local Estimates'}`;
  }

  // New AI response formatters
  function formatCategorySearchResponse(data: any): string {
    let response = `📦 **${data.summary}**\n\n`;
    response += `💰 **मूल्य सीमा / Price Range**: ₹${data.price_range.lowest} - ₹${data.price_range.highest}\n\n`;
    
    data.items.forEach((item: any, index: number) => {
      const qualityEmoji = item.quality === 'Premium' ? '⭐' : item.quality === 'Good' ? '✅' : '📦';
      response += `${index + 1}. **${item.hindi_name}** ${qualityEmoji}\n`;
      response += `   💰 ₹${item.price}/${item.unit} | गुणवत्ता: ${item.quality}\n\n`;
    });
    
    response += `💡 **सलाह / Advice**: ${data.advice}`;
    return response;
  }

  function formatQualitySearchResponse(data: any): string {
    let response = `⭐ **${data.summary}**\n\n`;
    response += `📊 **गुणवत्ता वितरण / Quality Distribution**:\n`;
    response += `⭐ प्रीमियम: ${data.quality_grades.premium} | ✅ अच्छी: ${data.quality_grades.good} | 📦 मानक: ${data.quality_grades.standard}\n\n`;
    
    let currentQuality = '';
    data.items.forEach((item: any, index: number) => {
      if (item.quality !== currentQuality) {
        currentQuality = item.quality;
        const qualityEmoji = item.quality === 'Premium' ? '⭐' : item.quality === 'Good' ? '✅' : '📦';
        response += `\n**${qualityEmoji} ${item.quality} गुणवत्ता:**\n`;
      }
      response += `• ${item.hindi_name}: ₹${item.price}/${item.unit}\n`;
    });
    
    response += `\n💡 **सलाह / Advice**: ${data.advice}`;
    return response;
  }

  function formatMultiLocationResponse(data: any): string {
    let response = `📊 **${data.summary}**\n\n`;
    
    data.results.forEach((result: any, index: number) => {
      const trendEmoji = result.trend === 'up' ? '📈' : '📉';
      response += `${index + 1}. **${result.mandi_name}** (${result.district})\n   💰 ${result.price} ${trendEmoji}\n\n`;
    });
    
    response += `🏆 **सबसे अच्छा भाव / Best Price**: ${data.best_price.mandi_name} - ${data.best_price.price}\n\n`;
    response += `💡 **सलाह / Advice**: ${data.advice}`;
    
    return response;
  }

  function formatMandiListResponse(data: any): string {
    let response = `📋 **${data.summary}**\n\n`;
    response += `🏢 **बड़ी मंडियां / Major**: ${data.categories.major}\n`;
    response += `🏪 **मध्यम मंडियां / Medium**: ${data.categories.medium}\n\n`;
    
    response += `**मुख्य मंडियां / Main Mandis:**\n`;
    data.mandis.slice(0, 8).forEach((mandi: any, index: number) => {
      response += `${index + 1}. ${mandi.name} (${mandi.district}) - ${mandi.distance}km\n`;
    });
    
    response += `\n💡 **सलाह / Advice**: ${data.advice}`;
    
    return response;
  }

  function formatNearbyMandisResponse(data: any): string {
    let response = `📍 **${data.summary}**\n\n`;
    
    data.nearby_mandis.forEach((mandi: any, index: number) => {
      response += `${index + 1}. **${mandi.name}** (${mandi.district})\n`;
      response += `   📏 दूरी: ${mandi.distance}km | 🚛 परिवहन: ₹${mandi.transport_cost}\n\n`;
    });
    
    response += `💡 **सलाह / Advice**: ${data.advice}\n\n`;
    response += `🚛 **परिवहन टिप्स / Transport Tips**:\n`;
    data.transport_tips.forEach((tip: string, index: number) => {
      response += `${index + 1}. ${tip}\n`;
    });
    
    return response;
  }

  function formatHelpResponse(data: any): string {
    let response = `🤖 **मैं आपकी कैसे मदद कर सकता हूं? / How can I help you?**\n\n`;
    
    data.help_topics.forEach((topic: any, index: number) => {
      response += `${index + 1}. **${topic.topic}**\n`;
      response += `   ${topic.description}\n`;
      response += `   उदाहरण: "${topic.example}"\n\n`;
    });
    
    response += `⚡ **त्वरित कमांड / Quick Commands**:\n`;
    data.quick_commands.forEach((command: string, index: number) => {
      response += `• ${command}\n`;
    });
    
    return response;
  }

  function extractCrop(text: string): string {
    const crops = ['onion', 'प्याज', 'tomato', 'टमाटर', 'potato', 'आलू', 'wheat', 'गेहूं', 'rice', 'चावल', 'soybean', 'सोयाबीन'];
    const found = crops.find(crop => text.toLowerCase().includes(crop.toLowerCase()));
    return found || 'onion';
  }

  function extractLocation(text: string): string {
    const locations = ['indore', 'इंदौर', 'bhopal', 'भोपाल', 'jabalpur', 'जबलपुर', 'gwalior', 'ग्वालियर', 'ujjain', 'उज्जैन'];
    const found = locations.find(loc => text.toLowerCase().includes(loc.toLowerCase()));
    return found || 'MP';
  }

  function extractPrice(text: string): number | null {
    const priceMatch = text.match(/₹?(\d+)/);
    return priceMatch ? parseInt(priceMatch[1]) : null;
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage('price');
    }
  };

  const startBargaining = () => {
    setInputText(`${currentCrop} के लिए ${currentLocation} में ₹2500 का ऑफर मिला है`);
  };

  const handleQuickAction = (actionId: string) => {
    const actions = {
      price: 'आज प्याज का भाव क्या है इंदौर में?',
      multi: 'भोपाल, इंदौर, पन्ना, बेतूल में गेहूं का भाव बताएं',
      list: 'मध्य प्रदेश की सभी मंडियों की सूची दिखाएं',
      nearby: 'मेरे नजदीकी मंडी कौन सी हैं?',
      help: 'मुझे मदद चाहिए, आप क्या कर सकते हैं?'
    };
    setInputText(actions[actionId as keyof typeof actions] || '');
  };

  const startVoiceInput = () => {
    setIsListening(true);
    // Simulate voice input (in real app, use Web Speech API)
    setTimeout(() => {
      setIsListening(false);
      setInputText('प्याज का भाव इंदौर में क्या है?');
    }, 2000);
  };

  const getTrendIcon = (trend: string) => {
    switch(trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch(trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50">
      {/* Live Price Ticker */}
      {liveUpdates.length > 0 && (
        <div className="bg-green-600 text-white py-2 px-4 overflow-hidden" suppressHydrationWarning>
          <div className="flex items-center animate-pulse">
            <span className="text-yellow-300 mr-2">🔔</span>
            <div className="animate-marquee whitespace-nowrap">
              <span className="font-medium">
                लाइव अपडेट: {liveUpdates[currentUpdateIndex]?.crop} - {liveUpdates[currentUpdateIndex]?.market} - {liveUpdates[currentUpdateIndex]?.price} 
                <span className={getTrendColor(liveUpdates[currentUpdateIndex]?.trend)}>
                  {getTrendIcon(liveUpdates[currentUpdateIndex]?.trend)}
                </span>
                <span className="ml-4 text-yellow-200">• 2 मिनट पहले अपडेट</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-green-500">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl">🧑‍🌾</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-800">किसान बडी</h1>
                <p className="text-sm text-green-600">आपकी भाषा में मंडी की जानकारी</p>
              </div>
            </div>
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center space-x-2 bg-green-100 hover:bg-green-200 px-4 py-2 rounded-full transition-colors"
              >
                <span>{LANGUAGES.find(l => l.code === selectedLanguage)?.flag}</span>
                <span className="text-sm font-medium">{LANGUAGES.find(l => l.code === selectedLanguage)?.name}</span>
                <span className="text-xs">▼</span>
              </button>
              
              {showLanguageDropdown && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl border z-50 min-w-[150px]">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLanguage(lang.code);
                        setShowLanguageDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-green-50 flex items-center space-x-2 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <span>{lang.flag}</span>
                      <span className="text-sm">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-3 justify-center">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.id}
              onClick={() => handleQuickAction(action.id)}
              className={`${action.color} text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity flex items-center space-x-2 shadow-lg`}
            >
              <span>{action.icon}</span>
              <span>{action.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="max-w-6xl mx-auto px-4 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-280px)]">
          
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl border overflow-hidden h-full flex flex-col">
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-lg">💬</span>
                  </div>
                  <div>
                    <h3 className="font-bold">चैट करें</h3>
                    <p className="text-xs opacity-90">अपनी भाषा में पूछें</p>
                  </div>
                  <div className="ml-auto flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                    <span className="text-xs">लाइव</span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-6 py-4 rounded-3xl shadow-lg ${
                      message.isUser 
                        ? message.type === 'bargain' 
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                          : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                        : message.type === 'price'
                          ? 'bg-blue-50 text-gray-800 border-2 border-blue-200'
                          : message.type === 'bargain'
                            ? 'bg-orange-50 text-gray-800 border-2 border-orange-200'
                            : 'bg-white text-gray-800 border-2 border-gray-200'
                    }`}>
                      <div className="whitespace-pre-wrap text-base leading-relaxed">
                        {message.text}
                      </div>
                      <div className={`text-xs mt-2 ${
                        message.isUser ? 'text-white text-opacity-80' : 'text-gray-500'
                      }`} suppressHydrationWarning>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 px-6 py-4 rounded-3xl shadow-lg border-2 border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-base">लाइव मंडी डेटा ला रहे हैं...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t bg-white p-4">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="अपनी भाषा में पूछें: आज प्याज का भाव क्या है इंदौर में?"
                    className="flex-1 border-2 border-gray-300 rounded-2xl px-6 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={loading}
                  />
                  
                  {/* Voice Input Button */}
                  <button
                    onClick={startVoiceInput}
                    disabled={loading}
                    className={`px-4 py-3 rounded-2xl transition-colors ${
                      isListening 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                    title="Voice Input"
                  >
                    🎤
                  </button>
                  
                  <button
                    onClick={() => sendMessage('price')}
                    disabled={loading || !inputText.trim()}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-2xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                    title="Get Live Price"
                  >
                    📊
                  </button>
                  
                  {bargainMode && (
                    <button
                      onClick={() => sendMessage('bargain')}
                      disabled={loading || !inputText.trim()}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-2xl hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                      title="Start Bargaining"
                    >
                      🤝
                    </button>
                  )}
                </div>
                
                {/* Quick Suggestions */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    "प्याज का भाव",
                    "भोपाल, इंदौर में गेहूं का भाव",
                    "सभी मंडी दिखाएं", 
                    "नजदीकी मंडी खोजें"
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInputText(suggestion)}
                      className="text-sm bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-full transition-colors"
                      disabled={loading}
                    >
                      {suggestion}
                    </button>
                  ))}
                  
                  {bargainMode && currentCrop && (
                    <button
                      onClick={startBargaining}
                      className="text-sm bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2 rounded-full transition-colors"
                      disabled={loading}
                    >
                      🤝 {currentCrop} के लिए बातचीत शुरू करें
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Live Updates Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl border h-full overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                <h3 className="font-bold flex items-center">
                  <span className="mr-2">📊</span>
                  लाइव अपडेट
                </h3>
              </div>
              
              <div className="p-4 space-y-3 h-full overflow-y-auto">
                {liveUpdates.map((update) => (
                  <div key={update.id} className="bg-gray-50 rounded-2xl p-3 border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-800">{update.crop}</span>
                      <span className={`text-lg ${getTrendColor(update.trend)}`}>
                        {getTrendIcon(update.trend)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">{update.market}</div>
                    <div className="text-lg font-bold text-green-600">{update.price}</div>
                    <div className="text-xs text-gray-500 mt-1" suppressHydrationWarning>
                      {update.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}