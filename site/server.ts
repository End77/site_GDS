// server.ts - Next.js Standalone + Socket.IO
import { setupSocket } from '@/lib/socket'
import { createServer } from 'http'
import { Server } from 'socket.io'
import next from 'next'
import { parse } from 'url'

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || '0.0.0.0'
const port = parseInt(process.env.PORT || '12001', 10)

// Custom server with Socket.IO integration
async function createCustomServer() {
  try {
    console.log('🚀 Starting custom Next.js + Socket.IO server...')

    // Create Next.js app
    const nextApp = next({ 
      dev,
      hostname,
      port
    })

    const handle = nextApp.getRequestHandler()
    await nextApp.prepare()

    console.log('✅ Next.js app prepared')

    // Create HTTP server that will handle both Next.js and Socket.IO
    const server = createServer(async (req, res) => {
      try {
        // Parse URL
        const parsedUrl = parse(req.url!, true)
        
        // Skip socket.io requests from Next.js handler
        if (parsedUrl.pathname?.startsWith('/api/socketio')) {
          return
        }

        // Handle all other requests with Next.js
        await handle(req, res, parsedUrl)
      } catch (err) {
        console.error('Error handling request:', err)
        res.statusCode = 500
        res.end('Internal server error')
      }
    })

    // Setup Socket.IO
    const io = new Server(server, {
      path: '/api/socketio',
      addTrailingSlash: false,
      cors: {
        origin: dev 
          ? ["http://localhost:3000", "http://localhost:12001"]
          : "*",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    })

    console.log('✅ Socket.IO server configured')

    // Setup socket handlers
    setupSocket(io)

    // Handle server errors
    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use`)
        process.exit(1)
      } else {
        console.error('❌ Server error:', err)
        throw err
      }
    })

    // Start the server
    await new Promise<void>((resolve) => {
      server.listen(port, hostname, () => {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        console.log(`✅ Server ready on http://${hostname}:${port}`)
        console.log(`✅ Socket.IO ready on ws://${hostname}:${port}/api/socketio`)
        console.log(`✅ Environment: ${dev ? 'development' : 'production'}`)
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
        resolve()
      })
    })

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}, shutting down gracefully...`)
      
      // Close Socket.IO connections
      io.close(() => {
        console.log('✅ Socket.IO connections closed')
      })

      // Close HTTP server
      server.close(() => {
        console.log('✅ HTTP server closed')
        process.exit(0)
      })

      // Force exit after 10 seconds
      setTimeout(() => {
        console.error('❌ Forced shutdown after timeout')
        process.exit(1)
      }, 10000)
    }

    // Handle shutdown signals
    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT', () => shutdown('SIGINT'))

  } catch (err) {
    console.error('❌ Server startup error:', err)
    process.exit(1)
  }
}

// Start the server
createCustomServer().catch((err) => {
  console.error('❌ Failed to start server:', err)
  process.exit(1)
})