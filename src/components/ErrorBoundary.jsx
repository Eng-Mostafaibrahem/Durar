import { Component } from 'react';

/** Route-level error boundary: keeps one broken page from taking down the app. */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, info);
    }
  }

  render() {
    const { fallback } = this.props;

    if (this.state.error) {
      if (!fallback) return null;

      const Fallback = fallback;
      return <Fallback error={this.state.error} reset={() => this.setState({ error: null })} />;
    }

    return this.props.children;
  }
}
