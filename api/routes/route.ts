import { NextRequest, NextResponse } from 'next/server';
import pool from '../../app/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startLat = searchParams.get('startLat');
    const startLng = searchParams.get('startLng');
    const endLat = searchParams.get('endLat');
    const endLng = searchParams.get('endLng');

    if (!startLat || !startLng || !endLat || !endLng) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    // For now, return a simple straight line route
    // In a real implementation, use a routing service like OSRM
    const path = [
      [parseFloat(startLat), parseFloat(startLng)],
      [parseFloat(endLat), parseFloat(endLng)]
    ];

    const distance = calculateDistance(
      parseFloat(startLat), parseFloat(startLng),
      parseFloat(endLat), parseFloat(endLng)
    );

    return NextResponse.json({
      path,
      distance,
      duration: `${Math.round(distance / 50)} minutes` // rough estimate
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Distance in meters
}