import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: countries, error } = await supabase
      .from('countries')
      .select('id, name')
      .order('name')

    if (error) {
      console.error('Error fetching countries:', error)
      return NextResponse.json(
        { error: 'Failed to fetch countries' },
        { status: 500 }
      )
    }

    return NextResponse.json(countries || [])
  } catch (error) {
    console.error('Error in countries API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}