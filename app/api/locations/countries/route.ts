import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // The table does not include phone_code; we add a simple derived value for India.
    const { data: countries, error } = await supabase
      .from('countries')
      .select('id, name, code')
      .eq('is_active', true)
      .order('name')

    if (error) {
      console.error('Error fetching countries:', error)
      return NextResponse.json(
        { error: 'Failed to fetch countries' },
        { status: 500 }
      )
    }

    const response = (countries || []).map(country => ({
      ...country,
      phone_code: country.code === 'IN' ? '91' : null,
    }))

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in countries API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
