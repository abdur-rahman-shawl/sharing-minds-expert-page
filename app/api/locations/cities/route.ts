import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const stateId = searchParams.get('stateId')

    if (!stateId) {
      return NextResponse.json(
        { error: 'State ID is required' },
        { status: 400 }
      )
    }

    const { data: cities, error } = await supabase
      .from('cities')
      .select('id, name')
      .eq('state_id', stateId)
      .order('name')

    if (error) {
      console.error('Error fetching cities:', error)
      return NextResponse.json(
        { error: 'Failed to fetch cities' },
        { status: 500 }
      )
    }

    return NextResponse.json(cities || [])
  } catch (error) {
    console.error('Error in cities API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}