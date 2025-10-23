import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import Card from '../components/ui/Card'
import Section from '../components/ui/Section'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <Section>
          <Card className="text-center">
            <div className="space-y-6">
              <div className="text-6xl">🔍</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
                <p className="text-gray-600">
                  The page you're looking for doesn't exist or has been moved.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                >
                  <Home className="h-4 w-4" />
                  <span>Go Home</span>
                </Link>
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Go Back</span>
                </button>
              </div>
            </div>
          </Card>
        </Section>
      </div>
    </div>
  )
}