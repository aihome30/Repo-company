'use client';

import teamData from '@/content/team.json';

export default function TeamPage() {
  return (
    <div>
      {/* Hero */}
      <section className="section bg-blue-50">
        <div className="container">
          <h1 className="heading-md mb-4">Meet Our Team</h1>
          <p className="text-xl text-muted max-w-2xl">
            Experienced professionals dedicated to building excellent digital solutions.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamData.map((member) => (
              <div
                key={member.id}
                className="text-center"
              >
                <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="heading-sm mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-muted text-sm mb-4">{member.bio}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {member.expertise.map((skill, idx) => (
                    <span key={idx} className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-blue-50">
        <div className="container max-w-3xl">
          <h2 className="heading-md text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="heading-sm mb-2">Excellence</h3>
              <p className="text-muted">We deliver high-quality solutions that exceed expectations.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🤝</div>
              <h3 className="heading-sm mb-2">Partnership</h3>
              <p className="text-muted">We work as an extension of your team for long-term success.</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="heading-sm mb-2">Innovation</h3>
              <p className="text-muted">We stay ahead with the latest technologies and approaches.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
