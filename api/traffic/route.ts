import { NextRequest, NextResponse } from 'next/server';
import pool from '../../app/lib/db';

export async function GET(request: NextRequest) {
  try {
    const result = await pool.query('SELECT * FROM traffic ORDER BY updated_at DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { lat, lng, level, description } = await request.json();

    const result = await pool.query(
      'INSERT INTO traffic (lat, lng, level, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [lat, lng, level, description]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}