import { NextRequest, NextResponse } from 'next/server';
import pool from '../../app/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = searchParams.get('radius') || '1000'; // meters

    let query = 'SELECT * FROM points_of_interest';
    let params: any[] = [];

    if (lat && lng) {
      query += ' WHERE ST_DWithin(ST_Point($1, $2)::geography, ST_Point(lng, lat)::geography, $3)';
      params = [lng, lat, radius];
    }

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, lat, lng, type, description } = await request.json();

    const result = await pool.query(
      'INSERT INTO points_of_interest (name, lat, lng, type, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, lat, lng, type, description]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}