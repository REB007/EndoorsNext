// utils/connections.ts

import { ConnectionPolaroid } from '@/types';

const API_URL = '/api/connections';

/**
 * Save a new connection (polaroid) to the backend.
 */
export async function saveConnection(polaroid: ConnectionPolaroid): Promise<boolean> {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(polaroid),
    });

    if (!res.ok) {
      console.error('[saveConnection] Failed:', await res.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error('[saveConnection] Error:', error);
    return false;
  }
}

/**
 * Retrieve all connections for a given user address.
 */
export async function getConnections(address: string): Promise<ConnectionPolaroid[]> {
  try {
    const res = await fetch(`${API_URL}?address=${address}`);
    if (!res.ok) {
      console.error('[getConnections] Failed:', await res.text());
      return [];
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('[getConnections] Error:', error);
    return [];
  }
}
