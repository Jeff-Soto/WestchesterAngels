/**
 * @fileoverview Generate "Why they match" reasons for prospects
 */

import { calculateRelevanceScore } from '../filtering/relevanceFilter';
import { estimateDistanceFromNYC, getDistanceDescription, getMetroScore } from './distance';

/**
 * Generates match reasons for a prospect
 * @param {import('../../types/prospect').Prospect & {
 *   hqCountry?: string | null,
 *   hqState?: string | null,
 *   hqCity?: string | null,
 *   investsInUS?: boolean,
 *   isTriStateHQ?: boolean,
 *   countries?: string[],
 *   stages?: string[],
 *   investorType?: string,
 *   minCheckUsd?: number | null,
 *   maxCheckUsd?: number | null,
 *   aiMatchExplanation?: string | null
 * }} prospect - Enriched prospect
 * @returns {Array<{icon: string, text: string, highlight: boolean}>} - Array of match reasons
 */
export function generateMatchReasons(prospect) {
  const reasons = [];
  
  // Geography reasons
  const nycMetroStates = new Set(['NY', 'NJ', 'CT', 'PA']);
  if (prospect.hqState && nycMetroStates.has(prospect.hqState)) {
    const distance = estimateDistanceFromNYC(prospect.hqState, prospect.hqCity);
    const distanceText = distance !== null ? ` (${getDistanceDescription(distance)})` : '';
    const metroScore = getMetroScore(distance);
    
    if (prospect.isTriStateHQ) {
      reasons.push({
        icon: '📍',
        text: `Based in ${prospect.hqState}${distanceText} - Tri-State area`,
        highlight: true
      });
    } else {
      reasons.push({
        icon: '📍',
        text: `Based in ${prospect.hqState}${distanceText} - Within 60 miles of NYC`,
        highlight: true
      });
    }
    
    if (metroScore === 'High') {
      reasons.push({
        icon: '⭐',
        text: 'High metro proximity score',
        highlight: false
      });
    }
  }
  
  // Investment focus
  if (prospect.investsInUS) {
    reasons.push({
      icon: '🇺🇸',
      text: 'Invests in US-based startups',
      highlight: false
    });
  }
  
  // Stage alignment
  const earlyStages = new Set(['idea', 'prototype', 'early_revenue']);
  const hasEarlyStage = prospect.stages && prospect.stages.some(s => earlyStages.has(s));
  if (hasEarlyStage) {
    const stageNames = prospect.stages
      .filter(s => earlyStages.has(s))
      .map(s => {
        if (s === 'idea') return 'Idea/Patent';
        if (s === 'prototype') return 'Prototype';
        if (s === 'early_revenue') return 'Early Revenue';
        return s;
      })
      .join(', ');
    reasons.push({
      icon: '🚀',
      text: `Invests in early-stage: ${stageNames}`,
      highlight: true
    });
  }
  
  // Investor type
  const typeLabels = {
    vc: 'Venture Capital',
    solo_angel: 'Solo Angel',
    angel_network: 'Angel Network'
  };
  if (prospect.investorType && typeLabels[prospect.investorType]) {
    reasons.push({
      icon: '👥',
      text: `Type: ${typeLabels[prospect.investorType]}`,
      highlight: false
    });
  }
  
  // US-focused (not too global)
  if (prospect.countries) {
    const totalCountries = prospect.countries.length;
    if (totalCountries <= 3) {
      reasons.push({
        icon: '🎯',
        text: 'US-focused investor',
        highlight: false
      });
    } else if (totalCountries <= 5) {
      reasons.push({
        icon: '🌎',
        text: 'Moderate international focus',
        highlight: false
      });
    }
  }
  
  // Calculate relevance score
  const relevanceScore = calculateRelevanceScore(prospect);
  if (relevanceScore >= 70) {
    reasons.push({
      icon: '⭐',
      text: `High relevance score: ${relevanceScore}/100`,
      highlight: true
    });
  } else if (relevanceScore >= 50) {
    reasons.push({
      icon: '✓',
      text: `Relevance score: ${relevanceScore}/100`,
      highlight: false
    });
  }
  
  // Add AI-generated explanation if available
  if (prospect.aiMatchExplanation) {
    reasons.push({
      icon: '🤖',
      text: prospect.aiMatchExplanation,
      highlight: true
    });
  }
  
  return reasons;
}

