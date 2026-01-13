import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'var(--bg-primary, #1a1a2e)',
          color: 'var(--text-primary, #eee)',
          fontFamily: 'monospace',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ marginBottom: '20px' }}>Something went wrong</h1>
          <pre style={{
            background: 'var(--bg-secondary, #16213e)',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '600px',
            overflow: 'auto',
            marginBottom: '20px',
            fontSize: '0.9rem'
          }}>
            {this.state.error?.message || 'Unknown error'}
          </pre>
          <button
            onClick={this.handleRetry}
            style={{
              background: 'var(--accent-primary, #00ff00)',
              color: '#000',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: '1rem'
            }}
          >
            Try Again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
