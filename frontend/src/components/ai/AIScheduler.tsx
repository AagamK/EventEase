import React, { useState } from 'react';
import { Event, Participant, AIScheduleSuggestion } from '../../types';
import { aiService } from '../../services/api';
import { SparklesIcon, ClockIcon, CheckIcon } from '@heroicons/react/24/outline';

interface AISchedulerProps {
  event: Event;
  participants: Participant[];
}

const AIScheduler: React.FC<AISchedulerProps> = ({ event, participants }) => {
  const [suggestions, setSuggestions] = useState<AIScheduleSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<AIScheduleSuggestion | null>(null);

  const generateSuggestions = async () => {
    setIsLoading(true);
    try {
      const constraints = {
        participants: participants.map(p => ({
          id: p.id,
          availability: p.availability,
          preferences: {}
        })),
        eventDuration: 120, // minutes
        preferredTimeRange: {
          start: '09:00',
          end: '18:00'
        }
      };

      const response = await aiService.generateSchedule(event.id, constraints);
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error generating schedule suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applySuggestion = (suggestion: AIScheduleSuggestion) => {
    setSelectedSuggestion(suggestion);
    // TODO: Implement API call to update event schedule
    console.log('Applying suggestion:', suggestion);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <SparklesIcon className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Schedule Assistant</h3>
          </div>
          <button
            onClick={generateSuggestions}
            disabled={isLoading || participants.length === 0}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Generating...' : 'Generate Suggestions'}
          </button>
        </div>

        {participants.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <p className="text-sm text-yellow-800">
              Add participants to generate AI schedule suggestions based on their availability.
            </p>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Suggested Time Slots</h4>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 transition-colors ${
                  selectedSuggestion === suggestion
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <ClockIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(suggestion.startTime).toLocaleString()} -{' '}
                        {new Date(suggestion.endTime).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">{suggestion.reason}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-500">
                          Confidence: {suggestion.confidence}%
                        </span>
                        <span className="text-sm text-gray-500">
                          Available: {suggestion.participantAvailability} participants
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => applySuggestion(suggestion)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {selectedSuggestion === suggestion ? (
                      <>
                        <CheckIcon className="h-4 w-4 mr-1" />
                        Applied
                      </>
                    ) : (
                      'Apply'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {suggestions.length === 0 && !isLoading && participants.length > 0 && (
          <div className="text-center py-8">
            <SparklesIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No suggestions yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Click "Generate Suggestions" to get AI-powered schedule recommendations.
            </p>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-sm text-gray-500">Analyzing participant availability...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIScheduler;