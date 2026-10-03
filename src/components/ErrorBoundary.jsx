import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-cream px-6 text-center">
          <div className="max-w-md">
            <p className="eyebrow">Mithaas Café</p>
            <h1 className="display mt-3 text-4xl">This page needs a moment.</h1>
            <p className="mt-4 text-stone">Something unexpected happened. You can refresh, or return to the café homepage.</p>
            <button type="button" className="btn btn-primary mt-6" onClick={() => window.location.assign('/')}>
              Back to Mithaas
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
