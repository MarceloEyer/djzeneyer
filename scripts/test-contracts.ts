import { z } from 'zod';
import { EventsApiResponseSchema } from '../src/schemas/events.js';

const SITE_URL = process.env.SITE_URL || 'https://djzeneyer.com';

async function testEventsEndpoint() {
  try {
    console.log(`Fetching events from ${SITE_URL}/wp-json/zen-bit/v2/events?mode=upcoming...`);
    
    const response = await fetch(`${SITE_URL}/wp-json/zen-bit/v2/events?mode=upcoming`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Zod throws an error if the contract is broken (missing required fields, wrong types)
    EventsApiResponseSchema.parse(data);
    
    console.log('✅ Events API contract is intact!');
  } catch (error) {
    console.error('❌ Contract broken! Frontend will fail if deployed.');
    console.error(error);
    process.exit(1);
  }
}

testEventsEndpoint();
