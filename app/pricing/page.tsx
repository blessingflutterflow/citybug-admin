'use client';

import { useState, useEffect } from 'react';
import { getPricingConfig, updatePricingConfig, PricingConfig, calculateFare } from '@/lib/services/pricingService';

export default function PricingPage() {
  const [config, setConfig] = useState<PricingConfig>({
    baseFare: 15.0,
    pricePerKm: 8.0,
    minimumFare: 25.0,
    surgeMultiplier: 1.0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Sample calculation
  const [sampleDistance, setSampleDistance] = useState(5);

  useEffect(() => {
    loadPricing();
  }, []);

  async function loadPricing() {
    setLoading(true);
    const data = await getPricingConfig();
    if (data) {
      setConfig(data);
    }
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    setMessage('');
    
    const success = await updatePricingConfig(config);
    
    if (success) {
      setMessage('Pricing updated successfully!');
    } else {
      setMessage('Failed to update pricing. Please try again.');
    }
    
    setSaving(false);
    
    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  }

  const sampleFare = calculateFare(sampleDistance, config);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Pricing Configuration</h1>
        <p className="text-gray-500 mt-1">Set your ride pricing rates. Changes apply immediately to the app.</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pricing Form */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Fare Settings</h2>
          
          <div className="space-y-5">
            {/* Base Fare */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Fare (R)
              </label>
              <input
                type="number"
                step="0.01"
                value={config.baseFare}
                onChange={(e) => setConfig({ ...config, baseFare: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B] focus:border-[#C2185B] outline-none transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">Fixed charge for every ride</p>
            </div>

            {/* Price per KM */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Kilometer (R)
              </label>
              <input
                type="number"
                step="0.01"
                value={config.pricePerKm}
                onChange={(e) => setConfig({ ...config, pricePerKm: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B] focus:border-[#C2185B] outline-none transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">Charge for each km traveled</p>
            </div>

            {/* Minimum Fare */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Fare (R)
              </label>
              <input
                type="number"
                step="0.01"
                value={config.minimumFare}
                onChange={(e) => setConfig({ ...config, minimumFare: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B] focus:border-[#C2185B] outline-none transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">Lowest possible fare for any ride</p>
            </div>

            {/* Surge Multiplier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surge Multiplier
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={config.surgeMultiplier}
                onChange={(e) => setConfig({ ...config, surgeMultiplier: parseFloat(e.target.value) || 1 })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C2185B] focus:border-[#C2185B] outline-none transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">Peak time multiplier (1.0 = normal)</p>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-6 py-3 px-4 bg-[#C2185B] text-white font-medium rounded-full hover:bg-[#AD1457] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving...' : 'Save Pricing'}
          </button>
        </div>

        {/* Fare Calculator Preview */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Fare Calculator Preview</h2>
          
          <div className="space-y-6">
            {/* Distance Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sample Distance: {sampleDistance} km
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={sampleDistance}
                onChange={(e) => setSampleDistance(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#C2185B]"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 km</span>
                <span>50 km</span>
              </div>
            </div>

            {/* Calculation Breakdown */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Base Fare</span>
                <span className="font-medium">R {config.baseFare.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Distance ({sampleDistance} km × R{config.pricePerKm}/km)</span>
                <span className="font-medium">R {(sampleDistance * config.pricePerKm).toFixed(2)}</span>
              </div>
              {config.surgeMultiplier !== 1 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Surge ({config.surgeMultiplier}x)</span>
                  <span className="font-medium text-[#C2185B]">× {config.surgeMultiplier}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total Fare</span>
                  <span className="text-xl font-bold text-[#C2185B]">R {sampleFare.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Formula Info */}
            <div className="text-sm text-gray-500 bg-blue-50 rounded-lg p-4">
              <p className="font-medium text-blue-900 mb-1">Formula:</p>
              <p>Fare = max(Base + (Distance × Rate) × Surge, Minimum)</p>
              <p className="mt-2 text-xs">
                Example: R{config.baseFare} + ({sampleDistance}km × R{config.pricePerKm}) × {config.surgeMultiplier} = R{sampleFare.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
