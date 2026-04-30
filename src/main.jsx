import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Error boundary — catches any JS crash and shows a message instead of blank page
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(e) { return { error: e } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight:'100vh', background:'#F9F5EE', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Georgia, serif', padding:'40px' }}>
          <div style={{ maxWidth:'480px', textAlign:'center' }}>
            <div style={{ fontSize:'48px', marginBottom:'16px' }}>🌊</div>
            <h1 style={{ fontSize:'24px', color:'#1F4E6B', marginBottom:'12px' }}>South Bay Hub</h1>
            <p style={{ color:'#8B6F47', lineHeight:1.6, marginBottom:'24px' }}>
              Something went wrong loading the app. This is usually a temporary issue.
            </p>
            <button onClick={() => window.location.reload()} style={{
              padding:'12px 28px', background:'#1F4E6B', color:'white',
              border:'none', borderRadius:'10px', fontSize:'15px',
              fontFamily:'Georgia, serif', cursor:'pointer'
            }}>Reload Page</button>
            <details style={{ marginTop:'20px', textAlign:'left' }}>
              <summary style={{ color:'#B8A080', fontSize:'12px', cursor:'pointer' }}>Error details</summary>
              <pre style={{ fontSize:'11px', color:'#BC4B51', marginTop:'8px', whiteSpace:'pre-wrap' }}>
                {this.state.error?.toString()}
              </pre>
            </details>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
)
