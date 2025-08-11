'use client'

import { Component, ReactNode, ErrorInfo } from 'react'
import Button from './Button'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center space-y-4 p-6 bg-red-500/10 border border-red-500/30 rounded-lg max-w-md">
            <div className="mb-4">
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto" />
            </div>
            <h2 className="text-xl font-bold text-white">Something went wrong</h2>
            <p className="text-gray-300 text-sm">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <div className="space-x-3">
              <Button 
                onClick={() => window.location.reload()}
                size="sm"
              >
                🔄 Refresh Page
              </Button>
              <Button 
                variant="outline"
                onClick={() => this.setState({ hasError: false })}
                size="sm"
              >
                Try Again
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left text-xs text-gray-400 mt-4">
                <summary className="cursor-pointer">Error Details</summary>
                <pre className="mt-2 p-2 bg-gray-800 rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}