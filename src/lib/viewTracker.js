// View and Share Tracker with localStorage batching

const STORAGE_KEY = 'property_views_shares'
const BATCH_INTERVAL = 30000 // 30 seconds
const API_ENDPOINT = '/api/properties/track'

let batchTimer = null

// Get stored views and shares
export function getStoredTracking() {
  if (typeof window === 'undefined') return { views: [], shares: [] }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : { views: [], shares: [] }
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return { views: [], shares: [] }
  }
}

// Store views and shares
function setStoredTracking(data) {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Error writing to localStorage:', error)
  }
}

// Track a view
export function trackView(propertyId) {
  if (typeof window === 'undefined') return
  
  const tracking = getStoredTracking()
  
  // Check if we've already tracked this view in this session
  const sessionKey = `viewed_${propertyId}`
  if (sessionStorage.getItem(sessionKey)) {
    return // Already viewed in this session
  }
  
  // Add to batch
  tracking.views.push({
    propertyId,
    timestamp: Date.now(),
  })
  
  setStoredTracking(tracking)
  sessionStorage.setItem(sessionKey, 'true')
  
  // Schedule batch send
  scheduleBatchSend()
}

// Track a share
export function trackShare(propertyId) {
  if (typeof window === 'undefined') return
  
  const tracking = getStoredTracking()
  
  // Add to batch
  tracking.shares.push({
    propertyId,
    timestamp: Date.now(),
  })
  
  setStoredTracking(tracking)
  
  // Schedule batch send
  scheduleBatchSend()
}

// Schedule batch send
function scheduleBatchSend() {
  if (batchTimer) {
    clearTimeout(batchTimer)
  }
  
  batchTimer = setTimeout(() => {
    sendBatch()
  }, BATCH_INTERVAL)
}

// Send batch to API
async function sendBatch() {
  const tracking = getStoredTracking()
  
  if (tracking.views.length === 0 && tracking.shares.length === 0) {
    return
  }
  
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        views: tracking.views,
        shares: tracking.shares,
      }),
    })
    
    if (response.ok) {
      // Clear sent items
      setStoredTracking({ views: [], shares: [] })
      console.log('Tracking data sent successfully')
    } else {
      console.error('Failed to send tracking data')
    }
  } catch (error) {
    console.error('Error sending tracking data:', error)
  }
}

// Send batch immediately (e.g., on page unload)
export function sendBatchNow() {
  if (batchTimer) {
    clearTimeout(batchTimer)
  }
  sendBatch()
}

// Initialize - send any pending data on page load
export function initializeTracker() {
  if (typeof window === 'undefined') return
  
  // Send any pending data after a short delay
  setTimeout(() => {
    sendBatch()
  }, 5000)
  
  // Send on page unload
  window.addEventListener('beforeunload', sendBatchNow)
  
  // Send periodically as backup
  setInterval(() => {
    sendBatch()
  }, 60000) // Every minute
}

