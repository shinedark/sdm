#!/usr/bin/env node

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3002;

// Enable JSON parsing
app.use(express.json());

// Load optimization manifests
let maxAggressionManifest = null;
let universalManifest = null;

try {
  const maxAggressionPath = path.join(__dirname, '../build/static/max-aggression-manifest.json');
  if (fs.existsSync(maxAggressionPath)) {
    maxAggressionManifest = JSON.parse(fs.readFileSync(maxAggressionPath, 'utf8'));
    console.log('📋 Loaded max-aggression manifest');
  }
} catch (error) {
  console.log('⚠️  Could not load max-aggression manifest:', error.message);
}

try {
  const universalPath = path.join(__dirname, '../.next/universal-optimization-manifest.json');
  if (fs.existsSync(universalPath)) {
    universalManifest = JSON.parse(fs.readFileSync(universalPath, 'utf8'));
    console.log('📋 Loaded universal optimization manifest');
  }
} catch (error) {
  console.log('⚠️  Could not load universal manifest:', error.message);
}

// Error translation endpoint
app.post('/translate-error', (req, res) => {
  try {
    const { stackTrace, errorMessage, fileName, lineNumber } = req.body;
    
    console.log('\n🚨 Error Translation Request:');
    console.log('File:', fileName);
    console.log('Line:', lineNumber);
    console.log('Message:', errorMessage);
    console.log('Stack:', stackTrace);
    
    let translatedError = {
      original: {
        fileName,
        lineNumber,
        errorMessage,
        stackTrace
      },
      translated: {
        fileName: fileName,
        lineNumber: lineNumber,
        errorMessage: errorMessage,
        stackTrace: stackTrace
      },
      suggestions: [],
      manifest: null
    };
    
    // Try to translate using max-aggression manifest
    if (maxAggressionManifest && fileName.includes('max-aggression')) {
      translatedError.manifest = 'max-aggression';
      translatedError.suggestions.push('This error is from the max-aggression optimized bundle');
      
      // Look for specific patterns in the error
      if (errorMessage.includes('setValueAtTime')) {
        translatedError.suggestions.push('Audio timing error - likely scheduling notes in the past');
        translatedError.suggestions.push('Check audio context timing and note scheduling logic');
      }
      
      if (errorMessage.includes('AudioParam')) {
        translatedError.suggestions.push('Web Audio API parameter error');
        translatedError.suggestions.push('Verify audio node connections and parameter values');
      }
      
      if (errorMessage.includes('finite non-negative number')) {
        translatedError.suggestions.push('Time value must be positive and finite');
        translatedError.suggestions.push('Check: Math.max(startTime, audioContext.currentTime + 0.01)');
      }
    }
    
    // Try to translate using universal manifest
    if (universalManifest) {
      translatedError.manifest = 'universal';
      translatedError.suggestions.push('This error is from the universal optimized bundle');
    }
    
    // Add general debugging suggestions
    translatedError.suggestions.push('Check browser console for more details');
    translatedError.suggestions.push('Verify audio context is initialized before scheduling');
    translatedError.suggestions.push('Ensure all timing calculations use audioContext.currentTime as reference');
    
    res.json(translatedError);
    
  } catch (error) {
    console.error('❌ Error in translation server:', error);
    res.status(500).json({ error: 'Translation failed', details: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    manifests: {
      maxAggression: !!maxAggressionManifest,
      universal: !!universalManifest
    },
    timestamp: new Date().toISOString()
  });
});

// Error monitoring endpoint
app.post('/log-error', (req, res) => {
  const { error, context, timestamp } = req.body;
  
  console.log('\n🔍 Error Logged:');
  console.log('Time:', timestamp || new Date().toISOString());
  console.log('Context:', context);
  console.log('Error:', error);
  
  // Save to error log file
  const errorLog = {
    timestamp: timestamp || new Date().toISOString(),
    context,
    error,
    stack: error.stack || 'No stack trace available'
  };
  
  const logPath = path.join(__dirname, '../error-log.json');
  let errorLogs = [];
  
  try {
    if (fs.existsSync(logPath)) {
      errorLogs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    }
  } catch (e) {
    console.log('Creating new error log file');
  }
  
  errorLogs.push(errorLog);
  
  // Keep only last 100 errors
  if (errorLogs.length > 100) {
    errorLogs = errorLogs.slice(-100);
  }
  
  fs.writeFileSync(logPath, JSON.stringify(errorLogs, null, 2));
  
  res.json({ status: 'logged', count: errorLogs.length });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Error Translation Server running on http://localhost:${PORT}`);
  console.log('📡 Endpoints:');
  console.log('  POST /translate-error - Translate minified errors');
  console.log('  POST /log-error - Log errors for monitoring');
  console.log('  GET /health - Health check');
  console.log('\n🔍 Monitoring for audio timing errors...');
});

module.exports = app;
