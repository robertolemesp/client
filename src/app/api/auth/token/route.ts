import { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function GET(req: NextRequest) {
  const token = await getToken({ req, raw: true })
  
  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({ token }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
