import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 bg-red-50 text-red-900 h-screen flex flex-col items-center justify-center text-left">
                    <h1 className="text-2xl font-bold mb-4">Ops, algo deu errado!</h1>
                    <p className="mb-4">Por favor, tire um print ou copie o erro abaixo e me envie:</p>
                    <div className="bg-white p-4 rounded border border-red-200 overflow-auto max-w-full w-full text-xs font-mono shadow-inner">
                        <p className="font-bold text-red-600">{this.state.error && this.state.error.toString()}</p>
                        <br />
                        <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                    </div>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg font-bold"
                    >
                        Voltar para o Início
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
