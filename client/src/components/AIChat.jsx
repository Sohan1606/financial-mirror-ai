import { useState, useRef, useEffect, useMemo } from 'react';
import { calculateFinancialAnalysis } from '../utils/financialCalculations';
import axiosClient from '../api/axiosClient';

export default function AIChat({ transactions }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(!localStorage.getItem('ai_privacy_accepted'));
  const messagesEndRef = useRef(null);

  const analysis = calculateFinancialAnalysis(transactions);
  const analysisSummary = {
    totalIncome: analysis.totalIncome,
    totalExpense: analysis.totalExpense,
    savings: analysis.savings,
    savingsRate: analysis.totalIncome > 0 ? ((analysis.savings / analysis.totalIncome) * 100).toFixed(1) : 0,
    topCategory: analysis.highestSpendingCategory,
    healthScore: analysis.healthScore || 0,
    monthlyAverage: analysis.monthlySpendingAverage
  };

  const dynamicQuickQuestions = useMemo(() => {
    const questions = [];
    if (analysisSummary.healthScore < 50) {
      questions.push("Why is my health score so low?");
    } else {
      questions.push("How can I reach a perfect 100 score?");
    }

    if (parseFloat(analysisSummary.savingsRate) < 15) {
      questions.push("My savings rate is low, how do I fix it?");
    } else {
      questions.push("Where should I invest my extra savings?");
    }

    if (analysisSummary.topCategory) {
      questions.push(`How do I reduce ${analysisSummary.topCategory} spending?`);
    }

    questions.push("What's my biggest financial risk?");
    questions.push("Predict my wealth in 5 years");
    
    return questions.slice(0, 5);
  }, [analysisSummary]);

  const insightBadges = useMemo(() => {
    const badges = [];
    if (parseFloat(analysisSummary.savingsRate) > 20) {
      badges.push({ text: 'High Saver', color: 'bg-emerald-500/10 text-emerald-500' });
    }
    if (analysisSummary.healthScore > 80) {
      badges.push({ text: 'Financial Pro', color: 'bg-blue-500/10 text-blue-500' });
    }
    if (analysisSummary.totalExpense > analysisSummary.totalIncome * 0.8) {
      badges.push({ text: 'High Burn Rate', color: 'bg-rose-500/10 text-rose-500' });
    }
    return badges;
  }, [analysisSummary]);

  const handleSendMessage = async (directMessage) => {
    const messageToSend = directMessage || input;
    if (!messageToSend.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage = { role: 'user', content: messageToSend };
    const newMessages = [...messages, userMessage];
    
    // Optimistically add user message
    setMessages(newMessages);
    if (!directMessage) setInput('');

    try {
      const response = await axiosClient.post('/api/ai/chat', {
        messages: newMessages,
        context: analysisSummary
      });

      const aiMessage = {
        role: 'assistant',
        content: response.data.content || 'Sorry, I could not generate a response.'
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      // Inline error message instead of alert
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Failed to get AI response. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question) => {
    if (isLoading) return;
    handleSendMessage(question);
  };

  const acceptPrivacy = () => {
    localStorage.setItem('ai_privacy_accepted', 'true');
    setShowPrivacyNotice(false);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <span className="ml-2 text-xs font-bold">AI</span>
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 15a1 1 0 100-2 1 1 0 000 2zm2.5-1a1 1 0 11-2 0 1 1 0 012 0zM13 15a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">LeakLess AI CFO</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearChat}
                  className="text-slate-400 hover:text-white transition-colors p-2 text-xs font-semibold"
                  title="Clear Chat"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Privacy Notice */}
            {showPrivacyNotice && (
              <div className="bg-purple-900/30 border-b border-purple-500/30 p-4">
                <p className="text-xs text-purple-200 mb-2">
                  🔒 <b>Privacy First:</b> Your financial summary (no personal details) will be used to give advice. Raw transactions never leave your browser.
                </p>
                <button 
                  onClick={acceptPrivacy}
                  className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg font-bold transition-colors"
                >
                  Got it, thanks!
                </button>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={messagesEndRef}>
              {messages.length === 0 && !isLoading && (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-slate-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-400 text-sm">Hello! I'm your AI CFO. Ask me anything about your finances.</p>
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  } mb-4`}
                >
                  <div
                    className={`max-w-[85%] lg:max-w-[75%] px-4 py-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-tr-none'
                        : 'bg-slate-700/50 text-slate-200 border border-slate-600/50 rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-slate-700/50 rounded-2xl px-4 py-3 rounded-tl-none">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-700/50 bg-slate-900/50">
              {/* Insight Badges */}
              {messages.length === 0 && insightBadges.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {insightBadges.map((badge, idx) => (
                    <span key={idx} className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${badge.color}`}>
                      {badge.text}
                    </span>
                  ))}
                </div>
              )}

              {/* Quick Questions */}
              {messages.length === 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {dynamicQuickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl border border-slate-700 transition-all hover:text-emerald-400"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask your AI CFO..."
                  className="flex-1 bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !input.trim()}
                  className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white p-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
