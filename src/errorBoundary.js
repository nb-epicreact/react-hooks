import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {error: null}
  }

  static getDerivedStateFromError(error) {
    return {error}
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo)
  }

  render() {
    const {error} = this.state
    const {FallbackComponent} = this.props

    if (error) {
      return <FallbackComponent error={error} />
    }

    return this.props.children
  }
}
