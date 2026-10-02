import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Indo Jaya Gram - 3-Agent Web Agency OS</title>
        <meta name="description" content="Free, open-source operating system for web agencies serving UMKM and startups" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        a {
          color: #0066cc;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      `}</style>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 1px;
        }

        .nav-links {
          display: flex;
          gap: 30px;
          list-style: none;
        }

        .nav-links a {
          color: white;
          font-weight: 500;
        }

        .nav-links a:hover {
          opacity: 0.8;
          text-decoration: none;
        }

        .hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 120px 0;
          text-align: center;
        }

        .hero h1 {
          font-size: 56px;
          margin-bottom: 20px;
          line-height: 1.2;
        }

        .hero p {
          font-size: 20px;
          margin-bottom: 40px;
          opacity: 0.9;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-buttons {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          padding: 14px 32px;
          font-size: 16px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
          display: inline-block;
        }

        .btn-primary {
          background: white;
          color: #667eea;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          text-decoration: none;
        }

        .btn-secondary {
          background: transparent;
          color: white;
          border: 2px solid white;
        }

        .btn-secondary:hover {
          background: rgba(255,255,255,0.1);
          text-decoration: none;
        }

        .features {
          padding: 80px 0;
          background: #f9f9f9;
        }

        .features h2 {
          font-size: 40px;
          text-align: center;
          margin-bottom: 60px;
          color: #333;
        }

        .agents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
          margin-bottom: 60px;
        }

        .agent-card {
          background: white;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          text-align: center;
        }

        .agent-card h3 {
          font-size: 24px;
          margin-bottom: 15px;
          color: #667eea;
        }

        .agent-card p {
          color: #666;
          margin-bottom: 20px;
        }

        .agent-card ul {
          text-align: left;
          list-style-position: inside;
          color: #555;
        }

        .agent-card li {
          margin-bottom: 8px;
        }

        .values {
          padding: 80px 0;
        }

        .values h2 {
          font-size: 40px;
          text-align: center;
          margin-bottom: 60px;
          color: #333;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
        }

        .value-box {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 35px;
          border-radius: 10px;
        }

        .value-box h3 {
          font-size: 20px;
          margin-bottom: 10px;
        }

        .value-box p {
          font-size: 15px;
          opacity: 0.9;
        }

        .stats {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 80px 0;
          text-align: center;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          margin-top: 40px;
        }

        .stat-item h3 {
          font-size: 48px;
          margin-bottom: 10px;
        }

        .stat-item p {
          font-size: 18px;
          opacity: 0.9;
        }

        .cta-section {
          padding: 80px 0;
          text-align: center;
          background: #f9f9f9;
        }

        .cta-section h2 {
          font-size: 40px;
          margin-bottom: 20px;
          color: #333;
        }

        .cta-section p {
          font-size: 18px;
          color: #666;
          margin-bottom: 40px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        footer {
          background: #333;
          color: white;
          padding: 40px 0;
          text-align: center;
        }

        footer p {
          margin-bottom: 10px;
        }

        footer a {
          color: #667eea;
        }

        @media (max-width: 768px) {
          .hero h1 {
            font-size: 36px;
          }
          .nav-links {
            display: none;
          }
        }
      `}</style>

      {/* Header */}
      <header>
        <div className="container">
          <nav>
            <div className="logo">Indo Jaya Gram</div>
            <ul className="nav-links">
              <li><a href="#about">About</a></li>
              <li><a href="#agents">Agents</a></li>
              <li><a href="#values">Values</a></li>
              <li><a href="https://github.com/bagheera30/Pt.Indo-jaya-" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <h1>3-Agent Operating System for Web Agencies</h1>
          <p>
            Free, open-source framework for building scalable web agencies. Serve UMKM and startups with practical, cost-effective solutions.
          </p>
          <div className="cta-buttons">
            <a href="https://github.com/bagheera30/Pt.Indo-jaya-" className="btn btn-primary">Get Started on GitHub</a>
            <a href="#about" className="btn btn-secondary">Learn More</a>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="features">
        <div className="container">
          <h2>What is Indo Jaya Gram?</h2>
          <p style={{ textAlign: 'center', marginBottom: '40px', maxWidth: '800px', margin: '0 auto 40px' }}>
            A complete framework for running a modern web agency with 3 autonomous agents. Instead of hiring expensive people, deploy intelligent agents that work together on real projects.
          </p>
        </div>
      </section>

      {/* Agents */}
      <section id="agents" className="features">
        <div className="container">
          <h2>Meet the 3 Agents</h2>
          <div className="agents-grid">
            {/* FinJam */}
            <div className="agent-card">
              <h3>💰 FinJam</h3>
              <p>Finance Lead</p>
              <ul>
                <li>Project pricing & budgets</li>
                <li>Cash flow management</li>
                <li>Profitability tracking</li>
                <li>Client vetting</li>
              </ul>
            </div>

            {/* CodeAce */}
            <div className="agent-card">
              <h3>⚙️ CodeAce</h3>
              <p>Tech Lead</p>
              <ul>
                <li>Code quality gates</li>
                <li>Architecture decisions</li>
                <li>Tech stack selection</li>
                <li>Deployment authority</li>
              </ul>
            </div>

            {/* CultureHub */}
            <div className="agent-card">
              <h3>👥 CultureHub</h3>
              <p>HR Lead</p>
              <ul>
                <li>Onboarding & training</li>
                <li>Culture enforcement</li>
                <li>Documentation</li>
                <li>Team feedback</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section id="values" className="values">
        <div className="container">
          <h2>Our 5 Core Values</h2>
          <div className="values-grid">
            <div className="value-box">
              <h3>🎯 Expertise First</h3>
              <p>Verify before claiming. Read code, test changes, understand impact.</p>
            </div>
            <div className="value-box">
              <h3>🔥 Ownership</h3>
              <p>Own the full outcome, not just your piece. End-to-end accountability.</p>
            </div>
            <div className="value-box">
              <h3>✨ Precision</h3>
              <p>Fast AND accurate. Quality gates mandatory. Honest timelines.</p>
            </div>
            <div className="value-box">
              <h3>💬 Transparency</h3>
              <p>Daily standups, weekly updates, no silent blockers. Clear communication always.</p>
            </div>
            <div className="value-box">
              <h3>🌍 Respect for Context</h3>
              <p>UMKM ≠ Enterprise. Build practical solutions for their reality, not ours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="container">
          <h2>Why Open Source?</h2>
          <p style={{ marginBottom: '40px', opacity: 0.9 }}>
            We're a bootstrapped startup with no venture funding. This framework is what we use every day to survive and scale.
          </p>
          <div className="stats-grid">
            <div className="stat-item">
              <h3>100%</h3>
              <p>Free & Open Source</p>
            </div>
            <div className="stat-item">
              <h3>MIT</h3>
              <p>Licensed</p>
            </div>
            <div className="stat-item">
              <h3>3</h3>
              <p>Autonomous Agents</p>
            </div>
            <div className="stat-item">
              <h3>∞</h3>
              <p>Scalable</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Scale Your Agency?</h2>
          <p>Start with our open-source framework. Customize for your needs. Share what you learn.</p>
          <div className="cta-buttons">
            <a href="https://github.com/bagheera30/Pt.Indo-jaya-" className="btn btn-primary">View on GitHub</a>
            <a href="https://github.com/bagheera30/Pt.Indo-jaya-/blob/main/culture/HANDBOOK.md" className="btn btn-secondary">Read Handbook</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <p>Indo Jaya Gram © 2026. Built for UMKM & Startups.</p>
          <p>
            <a href="https://github.com/bagheera30/Pt.Indo-jaya-" target="_blank" rel="noopener noreferrer">GitHub</a>
            {' '} • {' '}
            <a href="https://github.com/bagheera30/Pt.Indo-jaya-/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">MIT License</a>
          </p>
        </div>
      </footer>
    </>
  )
}
