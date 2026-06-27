<?php

return [
    /*
    |--------------------------------------------------------------------------
    | AI Provider Configuration
    |--------------------------------------------------------------------------
    |
    | Configure the AI provider for generating event report drafts.
    | Supported providers: 'openai', 'mock'
    |
    | 'mock' provider generates template-based responses without API key.
    | Use 'openai' for real AI-generated content with an API key.
    |
    */

    'provider' => env('AI_PROVIDER', 'mock'),

    'openai' => [
        'api_key' => env('OPENAI_API_KEY'),
        'model' => env('OPENAI_MODEL', 'gpt-4o-mini'),
        'temperature' => (float) env('OPENAI_TEMPERATURE', 0.7),
        'max_tokens' => (int) env('OPENAI_MAX_TOKENS', 1000),
        'timeout' => (int) env('OPENAI_TIMEOUT', 30),
    ],

    /*
    |--------------------------------------------------------------------------
    | Mock Provider Settings
    |--------------------------------------------------------------------------
    |
    | When using 'mock' provider, these settings control the simulated
    | response delay and whether to simulate errors for testing.
    |
    */

    'mock' => [
        'delay_ms' => (int) env('AI_MOCK_DELAY_MS', 500),
        'simulate_error' => (bool) env('AI_MOCK_SIMULATE_ERROR', false),
    ],

    /*
    |--------------------------------------------------------------------------
    | Response Validation
    |--------------------------------------------------------------------------
    |
    | Minimum requirements for AI-generated report content.
    |
    */

    'validation' => [
        'min_summary_length' => 50,
        'max_summary_length' => 5000,
    ],
];
