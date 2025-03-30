import { NextRequest, NextResponse } from 'next/server'

const BACKEND_BASE_URL = process.env.API_ENDPOINT

async function proxyRequest(req: NextRequest) {
  const proxyPath = req.headers.get('x-proxy-path') || '/'
  const url = new URL(req.url)
  const search = url.search
  const targetUrl = `${BACKEND_BASE_URL}${proxyPath}${search}`

  const headers: HeadersInit = {}

  req.headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'x-proxy-path') 
      headers[key] = value
  })

  const init: RequestInit = {
    method: req.method,
    headers,
    body: ['GET'].includes(req.method) ? undefined : await req.text()
  }

  try {
    const response = await fetch(targetUrl, init)
    const contentType = response.headers.get('Content-Type') || 'application/json'
    const responseBody = await response.text()

    return new NextResponse(responseBody, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
      }
    })
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: 'Proxy request failed', details: error }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export const GET = proxyRequest
export const POST = proxyRequest
export const PUT = proxyRequest
export const DELETE = proxyRequest
export const PATCH = proxyRequest