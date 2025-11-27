/**
 * @fileoverview Distance calculation utilities for NYC metro area
 */

/**
 * Approximate coordinates for NYC (Manhattan)
 */
const NYC_COORDS = {
  lat: 40.7128,
  lng: -74.0060
};

/**
 * Approximate state center coordinates for distance estimation
 * Used when city coordinates are not available
 */
const STATE_CENTERS = {
  NY: { lat: 42.1657, lng: -74.9481 }, // Albany (rough center)
  NJ: { lat: 40.2206, lng: -74.7597 }, // Trenton
  CT: { lat: 41.5978, lng: -72.7554 }, // Hartford
  PA: { lat: 40.2737, lng: -76.8844 }  // Harrisburg
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lng1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lng2 - Longitude of second point
 * @returns {number} - Distance in miles
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Estimates distance from NYC based on state and city
 * @param {string} state - US state code (e.g., 'NY', 'NJ')
 * @param {string} [city] - City name (optional)
 * @returns {number | null} - Estimated distance in miles, or null if cannot estimate
 */
export function estimateDistanceFromNYC(state, city = null) {
  if (!state) return null;
  
  // NYC is in NY, so NY state is close
  if (state === 'NY') {
    // Rough estimates for NY cities
    if (city) {
      const cityLower = city.toLowerCase();
      if (cityLower.includes('new york') || cityLower.includes('nyc') || cityLower.includes('manhattan')) {
        return 0; // NYC itself
      }
      if (cityLower.includes('westchester') || cityLower.includes('yonkers') || cityLower.includes('white plains')) {
        return 25; // Westchester County
      }
      if (cityLower.includes('albany') || cityLower.includes('buffalo') || cityLower.includes('syracuse')) {
        return 150; // Upstate NY
      }
    }
    // Default: assume NYC metro area
    return 15;
  }
  
  // Use state center coordinates for estimation
  const stateCenter = STATE_CENTERS[state];
  if (!stateCenter) return null;
  
  // Calculate distance from NYC to state center
  const distance = calculateDistance(
    NYC_COORDS.lat,
    NYC_COORDS.lng,
    stateCenter.lat,
    stateCenter.lng
  );
  
  // Adjust based on state
  if (state === 'NJ') {
    // NJ is close, adjust for proximity
    return Math.max(10, distance * 0.3); // Rough estimate
  }
  if (state === 'CT') {
    // CT is close, adjust for proximity
    return Math.max(30, distance * 0.4);
  }
  if (state === 'PA') {
    // Eastern PA (Philadelphia area) is within 60 miles
    // Western PA is much farther
    if (city && (city.toLowerCase().includes('philadelphia') || city.toLowerCase().includes('philly'))) {
      return 95; // Philadelphia is ~95 miles
    }
    return Math.max(60, distance * 0.5); // Rough estimate for eastern PA
  }
  
  return distance;
}

/**
 * Gets a human-readable distance description
 * @param {number | null} distance - Distance in miles
 * @returns {string} - Human-readable description
 */
export function getDistanceDescription(distance) {
  if (distance === null || distance === undefined) {
    return 'Unknown distance';
  }
  
  if (distance < 1) {
    return 'In NYC';
  }
  if (distance < 25) {
    return `${Math.round(distance)} miles`;
  }
  if (distance < 60) {
    return `${Math.round(distance)} miles`;
  }
  if (distance < 100) {
    return `${Math.round(distance)} miles`;
  }
  return `${Math.round(distance)} miles`;
}

/**
 * Gets metro score based on distance
 * @param {number | null} distance - Distance in miles
 * @returns {'High' | 'Medium' | 'Low' | 'N/A'} - Metro score
 */
export function getMetroScore(distance) {
  if (distance === null || distance === undefined) {
    return 'N/A';
  }
  
  if (distance <= 30) {
    return 'High';
  }
  if (distance <= 60) {
    return 'Medium';
  }
  return 'Low';
}

