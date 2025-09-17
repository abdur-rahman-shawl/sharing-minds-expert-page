import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const countryId = searchParams.get('countryId')

    if (!countryId) {
      return NextResponse.json(
        { error: 'Country ID is required' },
        { status: 400 }
      )
    }

    const { data: states, error } = await supabase
      .from('states')
      .select('id, name')
      .eq('country_id', countryId)
      .order('name')

    if (error) {
      console.error('Error fetching states:', error)
      return NextResponse.json(
        { error: 'Failed to fetch states' },
        { status: 500 }
      )
    }

    return NextResponse.json(states || [])
  } catch (error) {
    console.error('Error in states API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}