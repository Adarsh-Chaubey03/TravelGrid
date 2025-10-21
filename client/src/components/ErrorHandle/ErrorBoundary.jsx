import React, { Component } from 'react';
// Use plain anchors in fallback to avoid requiring router context
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can log the error to an error reporting service
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-black to-pink-900 flex flex-col items-center justify-center p-4 text-white">
                    <div className="max-w-3xl w-full bg-gradient-to-br from-gray-900 to-black p-8 rounded-3xl shadow-2xl border border-pink-500">
                        <div className="mb-8 text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-500 bg-opacity-20 rounded-full mb-6">
                                <AlertTriangle className="w-12 h-12 text-pink-500" strokeWidth={1.5} />
                            </div>
                            <h1 className="text-4xl font-bold text-pink-400 mb-2">Oops! Something went wrong</h1>
                            <p className="text-gray-300">We're sorry, but we've encountered an unexpected error.</p>
                        </div>

                        {process.env.NODE_ENV === 'development' && (
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-pink-300 mb-3">Developer Information:</h2>
                                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-auto max-h-60">
                                    <p className="text-pink-400 mb-2">{this.state.error?.toString()}</p>
                                    <pre className="text-gray-400 text-sm whitespace-pre-wrap">
                                        {this.state.errorInfo?.componentStack}
                                    </pre>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button aria-label="Search"
                                onClick={() => window.location.reload()}
                                className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-xl font-semibold transition-colors flex items-center justify-center"
                            >
                                <RefreshCw className="w-5 h-5 mr-2" />
                                Refresh Page
                            </button>
                            <a
                                href="/"
                                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold transition-colors text-center flex items-center justify-center"
                            >
                                <Home className="w-5 h-5 mr-2" />
                                Return to Home
                            </a>
                        </div>
                    </div>

                    <p className="text-gray-400 mt-8">
                        If the issue persists, please contact our support team
                    </p>
                </div>
            );
        }

        // If there's no error, render children normally
        return this.props.children;
    }
}

export default ErrorBoundary;