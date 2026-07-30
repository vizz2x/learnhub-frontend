import { useState, useEffect } from 'react'

function LandingPage({ onGetStarted }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const courses = [
    { icon: '🧠', title: 'Verbal Reasoning', desc: 'Build strong language skills through fun word puzzles, analogies, and reading challenges.', color: '#e8f5e9', tag: 'Ages 8–12' },
    { icon: '💡', title: 'Critical Thinking', desc: 'Learn to ask great questions, spot patterns, and make smart decisions in everyday life.', color: '#fef3c7', tag: 'Ages 8–12' },
    { icon: '🔢', title: 'Problem Solving', desc: 'Tackle fun puzzles and real-world challenges that make your brain stronger every day.', color: '#dbeafe', tag: 'Ages 8–12' },
    { icon: '💻', title: 'Coding Basics', desc: 'Write your first lines of code and build simple games — no experience needed!', color: '#ede9fe', tag: 'Coming Soon' },
    { icon: '🎨', title: 'Creative Writing', desc: 'Discover the joy of storytelling and express your ideas in exciting, imaginative ways.', color: '#fce7f3', tag: 'Coming Soon' },
    { icon: '🌍', title: 'Global Awareness', desc: 'Explore the world, understand different cultures, and become a confident global citizen.', color: '#d1fae5', tag: 'Coming Soon' },
  ]

  const whyPoints = [
    { icon: '🦉', title: 'Owly — Your AI Study Buddy', desc: 'Owly is always there to help explain tricky topics, answer questions, and cheer you on. Learning is never lonely!' },
    { icon: '🏆', title: 'Earn Points & Badges', desc: 'Every lesson completed, every assignment submitted earns you points. Collect badges and climb the leaderboard!' },
    { icon: '🎯', title: 'Learn at Your Own Pace', desc: 'No rush, no pressure. Pick the courses that match your interests and learn when you\'re ready.' },
    { icon: '🧒', title: 'Designed for Kids', desc: 'Content and examples that reflect your world — created by educators who connect with your world' },
  ]

  const steps = [
    { icon: '📝', num: '01', title: 'Sign Up', desc: 'Create your free account and tell us what you\'re interested in.' },
    { icon: '📚', num: '02', title: 'Pick Your Courses', desc: 'Browse our fun enrichment courses and enroll in the ones that excite you.' },
    { icon: '🚀', num: '03', title: 'Start Learning!', desc: 'Dive into lessons, complete challenges, earn points, and grow every day.' },
  ]

  return (
    <div style={{ fontFamily: 'var(--font-body)', color: 'var(--charcoal)', background: 'white', overflowX: 'hidden' }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        borderBottom: scrolled ? '1px solid #e5e7eb' : 'none',
        transition: 'all 0.25s ease',
        padding: '0 var(--space-4)',
        display: 'flex', alignItems: 'center', height: '68px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: 'auto' }}>
          <div style={{
            width: '36px', height: '36px', background: 'var(--green)',
            borderRadius: '10px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '1.1rem'
          }}>📚</div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)' }}>
            LearnHub
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginRight: 'var(--space-3)' }}>
          {[['Courses', 'courses'], ['Why LearnHub', 'why'], ['How It Works', 'how']].map(([label, id]) => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              background: 'none', border: 'none', padding: '8px 14px',
              fontSize: '0.9rem', color: '#6b7280', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontWeight: 500,
              textTransform: 'none', letterSpacing: 'normal', margin: 0,
              borderRadius: '8px',
            }}
              onMouseEnter={e => e.target.style.color = 'var(--ink)'}
              onMouseLeave={e => e.target.style.color = '#6b7280'}
            >
              {label}
            </button>
          ))}
        </div>

        <button onClick={onGetStarted} style={{
          background: 'var(--green)', color: 'white', border: 'none',
          padding: '10px 22px', borderRadius: '8px',
          fontFamily: 'var(--font-body)', fontSize: '0.9rem', fontWeight: 600,
          textTransform: 'none', letterSpacing: 'normal', cursor: 'pointer', margin: 0
        }}>
          Start Learning →
        </button>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        background: 'linear-gradient(160deg, #f0fdf4 0%, #fffbeb 50%, #f0f9ff 100%)',
        padding: '100px var(--space-4) 60px',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: '8%', right: '3%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(31,92,63,0.07) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '5%', left: '2%',
          width: '350px', height: '350px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,163,61,0.09) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          maxWidth: '1100px', margin: '0 auto', width: '100%',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center'
        }}>
          {/* Left */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#fef3c7', border: '1px solid #fcd34d',
              borderRadius: '999px', padding: '6px 14px',
              fontSize: '0.82rem', fontWeight: 600, color: '#92400e',
              marginBottom: 'var(--space-2)'
            }}>
              📍 Now open in Benin City
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: '3rem',
              fontWeight: 700, color: 'var(--ink)', lineHeight: 1.15,
              margin: '0 0 var(--space-2) 0', borderBottom: 'none', padding: 0
            }}>
              Where kids{' '}
              <span style={{ color: 'var(--green)', position: 'relative', display: 'inline-block' }}>
                learn to think
                <svg style={{ position: 'absolute', bottom: '-4px', left: 0, width: '100%' }}
                  viewBox="0 0 160 8" preserveAspectRatio="none">
                  <path d="M0 6 Q40 0 80 4 Q120 8 160 2" stroke="var(--gold)" strokeWidth="3" fill="none" strokeLinecap="round" />
                </svg>
              </span>
              ,{' '}create, and{' '}
              <span style={{ color: 'var(--gold-dark)' }}>grow.</span>
            </h1>

            <p style={{
              fontSize: '1.05rem', color: '#6b7280', lineHeight: 1.7,
              margin: '0 0 var(--space-3) 0', maxWidth: '460px'
            }}>
              LearnHub is an after-school enrichment centre where kids aged 8–12 explore fun courses in critical thinking, verbal reasoning, problem solving, and more — with Owly the AI tutor by their side.
            </p>

            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--space-3)' }}>
              <button onClick={onGetStarted} style={{
                background: 'var(--green)', color: 'white', border: 'none',
                padding: '14px 28px', borderRadius: '10px',
                fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 600,
                textTransform: 'none', letterSpacing: 'normal', cursor: 'pointer', margin: 0,
                boxShadow: '0 4px 14px rgba(31,92,63,0.3)',
                transition: 'transform 0.15s, box-shadow 0.15s'
              }}
                onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(31,92,63,0.35)' }}
                onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 14px rgba(31,92,63,0.3)' }}
              >
                Start Learning Free →
              </button>
              <button onClick={() => scrollTo('courses')} style={{
                background: 'white', color: 'var(--ink)',
                border: '2px solid #e5e7eb', padding: '14px 28px', borderRadius: '10px',
                fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 600,
                textTransform: 'none', letterSpacing: 'normal', cursor: 'pointer', margin: 0,
                transition: 'border-color 0.15s'
              }}
                onMouseEnter={e => e.target.style.borderColor = 'var(--green)'}
                onMouseLeave={e => e.target.style.borderColor = '#e5e7eb'}
              >
                Browse Courses
              </button>
            </div>

            {/* Social proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div style={{ display: 'flex' }}>
                {['🧒', '👧', '🧒', '👦'].map((emoji, i) => (
                  <div key={i} style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: ['#e8f5e9', '#fef3c7', '#dbeafe', '#ede9fe'][i],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem', marginLeft: i > 0 ? '-8px' : 0,
                    border: '2px solid white', position: 'relative', zIndex: 4 - i
                  }}>{emoji}</div>
                ))}
              </div>
              <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                Join curious kids already learning at LearnHub
              </span>
            </div>
          </div>

          {/* Right — Owly hero */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            <div style={{
              width: '380px', height: '380px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #e8f5e9 0%, #d1fae5 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative', flexShrink: 0
            }}>
              <div style={{ fontSize: '9rem', animation: 'characterBounce 3s ease-in-out infinite' }}>🦉</div>

              {/* Floating cards */}
              <div style={{
                position: 'absolute', top: '10px', right: '-20px',
                background: 'white', borderRadius: '14px', padding: '10px 16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)',
                display: 'flex', alignItems: 'center', gap: '8px',
                animation: 'pageFlipForward 0.6s ease-out'
              }}>
                🏆 You earned a badge!
              </div>

              <div style={{
                position: 'absolute', bottom: '30px', left: '-30px',
                background: 'white', borderRadius: '14px', padding: '10px 16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)',
                display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                🔥 3-day streak!
              </div>

              <div style={{
                position: 'absolute', top: '100px', left: '-40px',
                background: 'var(--gold)', borderRadius: '14px', padding: '10px 16px',
                boxShadow: '0 4px 20px rgba(232,163,61,0.3)',
                fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)',
              }}>
                ⭐ 250 points!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div style={{
        background: 'var(--green)', padding: 'var(--space-3) var(--space-4)',
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'var(--space-2)', textAlign: 'center'
        }}>
          {[
            ['🧒', '50+', 'Kids Learning'],
            ['📚', '6', 'Enrichment Courses'],
            ['🦉', '24/7', 'Owly Available'],
            ['📍', '1', 'Centre in Benin City'],
          ].map(([icon, num, label]) => (
            <div key={label}>
              <div style={{ fontSize: '1.4rem', marginBottom: '4px' }}>{icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'white', lineHeight: 1 }}>
                {num}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', marginTop: '4px' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── COURSES ── */}
      <section id="courses" style={{ padding: '80px var(--space-4)', background: '#fafafa' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{
              display: 'inline-block', background: '#e8f5e9',
              borderRadius: '999px', padding: '6px 16px',
              fontSize: '0.82rem', fontWeight: 600, color: 'var(--green)',
              marginBottom: 'var(--space-1)'
            }}>
              Enrichment Courses
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--ink)', margin: '8px 0 12px', borderBottom: 'none', padding: 0 }}>
              Courses kids actually enjoy
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1rem', maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>
              Each course is designed to build real-world thinking skills — wrapped in fun lessons, challenges, and rewards that keep kids coming back.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)' }}>
            {courses.map((c) => (
              <div key={c.title} style={{
                background: 'white', borderRadius: '20px', padding: 'var(--space-3)',
                border: '1px solid #f3f4f6', position: 'relative', overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default',
                opacity: c.tag === 'Coming Soon' ? 0.75 : 1
              }}
                onMouseEnter={e => { if (c.tag !== 'Coming Soon') { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.08)' }}}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
              >
                {c.tag === 'Coming Soon' && (
                  <div style={{
                    position: 'absolute', top: '14px', right: '14px',
                    background: '#f3f4f6', color: '#9ca3af',
                    fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px',
                    borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em'
                  }}>
                    Coming Soon
                  </div>
                )}
                {c.tag === 'Ages 8–12' && (
                  <div style={{
                    position: 'absolute', top: '14px', right: '14px',
                    background: '#e8f5e9', color: 'var(--green)',
                    fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px',
                    borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em'
                  }}>
                    {c.tag}
                  </div>
                )}
                <div style={{
                  width: '56px', height: '56px', borderRadius: '16px',
                  background: c.color, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.8rem', marginBottom: 'var(--space-2)'
                }}>
                  {c.icon}
                </div>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--ink)', margin: '0 0 8px 0' }}>
                  {c.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
                  {c.desc}
                </p>
                {c.tag !== 'Coming Soon' && (
                  <button onClick={onGetStarted} style={{
                    marginTop: 'var(--space-2)', background: 'none',
                    border: 'none', padding: 0, color: 'var(--green)',
                    fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'var(--font-body)', textTransform: 'none',
                    letterSpacing: 'normal', display: 'flex', alignItems: 'center', gap: '4px'
                  }}>
                    Start this course →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY LEARNHUB ── */}
      <section id="why" style={{ padding: '80px var(--space-4)', background: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '80px', alignItems: 'center'
          }}>
            <div>
              <div style={{
                display: 'inline-block', background: '#fef3c7',
                borderRadius: '999px', padding: '6px 16px',
                fontSize: '0.82rem', fontWeight: 600, color: '#92400e',
                marginBottom: 'var(--space-2)'
              }}>
                Why LearnHub?
              </div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--ink)', margin: '8px 0 var(--space-2)', borderBottom: 'none', padding: 0 }}>
                Skills the Nigerian curriculum doesn't teach — yet.
              </h2>
              <p style={{ color: '#6b7280', lineHeight: 1.7, marginBottom: 'var(--space-3)' }}>
                Nigeria's brightest kids deserve more than rote memorisation. LearnHub fills the gap with enrichment courses that build the thinking skills needed to succeed in the 21st century — in Nigeria and beyond.
              </p>
              <button onClick={onGetStarted} style={{
                background: 'var(--green)', color: 'white', border: 'none',
                padding: '12px 24px', borderRadius: '10px',
                fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 600,
                textTransform: 'none', letterSpacing: 'normal', cursor: 'pointer', margin: 0,
              }}>
                Join LearnHub Today →
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
              {whyPoints.map((w) => (
                <div key={w.title} style={{
                  background: '#f9fafb', borderRadius: '16px', padding: 'var(--space-2)',
                  border: '1px solid #f3f4f6'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{w.icon}</div>
                  <h3 style={{ fontSize: '0.95rem', color: 'var(--ink)', margin: '0 0 6px 0' }}>
                    {w.title}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.55, margin: 0 }}>
                    {w.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── OWLY SECTION ── */}
      <section style={{
        padding: '80px var(--space-4)',
        background: 'linear-gradient(160deg, #f0fdf4, #fffbeb)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '6rem', marginBottom: 'var(--space-2)', animation: 'characterBounce 3s ease-in-out infinite' }}>🦉</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--ink)', margin: '0 0 var(--space-1)', borderBottom: 'none', padding: 0 }}>
            Meet Owly — your child's study buddy
          </h2>
          <p style={{ color: '#6b7280', fontSize: '1rem', maxWidth: '520px', margin: '0 auto var(--space-4)', lineHeight: 1.7 }}>
            Owly is a friendly AI tutor who lives inside every lesson. Kids can ask Owly anything — "Can you explain that again?" or "Give me a harder challenge!" — and Owly always responds with patience, encouragement, and a little fun.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)', maxWidth: '800px', margin: '0 auto' }}>
            {[
              { emoji: '💬', title: 'Always Available', desc: 'Owly never gets tired of answering questions.' },
              { emoji: '🎉', title: 'Celebrates Wins', desc: 'Every achievement gets a proper celebration!' },
              { emoji: '🔄', title: 'Explains Differently', desc: 'If one explanation doesn\'t click, Owly tries another.' },
            ].map(item => (
              <div key={item.title} style={{
                background: 'white', borderRadius: '16px', padding: 'var(--space-3)',
                border: '1px solid #e5e7eb', textAlign: 'center'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{item.emoji}</div>
                <h3 style={{ fontSize: '0.95rem', color: 'var(--ink)', margin: '0 0 6px 0' }}>{item.title}</h3>
                <p style={{ fontSize: '0.82rem', color: '#6b7280', lineHeight: 1.55, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ padding: '80px var(--space-4)', background: 'white' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{
              display: 'inline-block', background: '#ede9fe',
              borderRadius: '999px', padding: '6px 16px',
              fontSize: '0.82rem', fontWeight: 600, color: '#7c3aed',
              marginBottom: 'var(--space-1)'
            }}>
              Simple to get started
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--ink)', margin: '8px 0 12px', borderBottom: 'none', padding: 0 }}>
              3 steps to start learning
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)', position: 'relative' }}>
            <div style={{
              position: 'absolute', top: '52px',
              left: 'calc(16.6% + 20px)', right: 'calc(16.6% + 20px)',
              height: '3px',
              background: 'linear-gradient(90deg, var(--green), var(--gold))',
              zIndex: 0, borderRadius: '999px'
            }} />

            {steps.map((s) => (
              <div key={s.num} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '76px', height: '76px', borderRadius: '50%',
                  background: 'white', border: '3px solid var(--green)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.2rem', margin: '0 auto var(--space-2)',
                  boxShadow: '0 0 0 8px #f0fdf4'
                }}>
                  {s.icon}
                </div>
                <div style={{
                  fontFamily: 'var(--font-label)', fontSize: '0.72rem',
                  color: 'var(--green)', fontWeight: 700, letterSpacing: '0.08em',
                  marginBottom: '6px'
                }}>
                  STEP {s.num}
                </div>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--ink)', margin: '0 0 8px 0' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR PARENTS ── */}
      <section style={{ padding: '80px var(--space-4)', background: '#f9fafb' }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center'
        }}>
          <div>
            <div style={{
              display: 'inline-block', background: '#dbeafe',
              borderRadius: '999px', padding: '6px 16px',
              fontSize: '0.82rem', fontWeight: 600, color: '#1d4ed8',
              marginBottom: 'var(--space-2)'
            }}>
              For Parents
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--ink)', margin: '8px 0 var(--space-2)', borderBottom: 'none', padding: 0 }}>
              Give your child the skills that school doesn't teach.
            </h2>
            <p style={{ color: '#6b7280', lineHeight: 1.7, marginBottom: 'var(--space-2)' }}>
              The world is changing fast. Critical thinking, verbal reasoning, and problem solving are no longer optional extras — they're the foundation of every successful career. LearnHub helps your child build these skills now, while learning is still fun.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: 'var(--space-3)' }}>
              {[
                '✅ Supervised after-school learning environment',
                '✅ Progress reports so you always know how they\'re doing',
                '✅ Safe, child-friendly platform with no distractions',
                '✅ Courses designed by qualified educators',
                '✅ Based in Benin City — easy to access',
              ].map(point => (
                <div key={point} style={{ fontSize: '0.92rem', color: 'var(--charcoal)' }}>{point}</div>
              ))}
            </div>
            <button onClick={onGetStarted} style={{
              background: 'var(--ink)', color: 'white', border: 'none',
              padding: '12px 24px', borderRadius: '10px',
              fontFamily: 'var(--font-body)', fontSize: '0.95rem', fontWeight: 600,
              textTransform: 'none', letterSpacing: 'normal', cursor: 'pointer', margin: 0,
            }}>
              Enroll Your Child →
            </button>
          </div>

          <div style={{
            background: 'white', borderRadius: '24px', padding: 'var(--space-4)',
            border: '1px solid #e5e7eb', boxShadow: '0 8px 32px rgba(0,0,0,0.06)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: 'var(--space-2)', textAlign: 'center' }}>🦉</div>
            <div style={{
              background: '#f0fdf4', borderRadius: '14px', padding: 'var(--space-2)',
              marginBottom: 'var(--space-2)', fontSize: '0.9rem', color: 'var(--charcoal)', lineHeight: 1.6
            }}>
              <strong>Owly says:</strong> "Great job finishing Module 2! You've earned 150 points and unlocked the Critical Thinker badge! 🏆 Ready for the next challenge?"
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-1)' }}>
              {[
                { label: 'Lessons Done', value: '12', icon: '📖' },
                { label: 'Points Earned', value: '850', icon: '⭐' },
                { label: 'Badges', value: '4', icon: '🏆' },
                { label: 'Day Streak', value: '7 🔥', icon: '📅' },
              ].map(stat => (
                <div key={stat.label} style={{
                  background: '#f9fafb', borderRadius: '12px', padding: 'var(--space-1) var(--space-2)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.2rem' }}>{stat.icon}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)' }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding: '80px var(--space-4)',
        background: 'linear-gradient(135deg, var(--green) 0%, #0f3d28 100%)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-2)', animation: 'characterBounce 3s ease-in-out infinite' }}>🦉</div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '2.4rem',
            color: 'white', margin: '0 0 var(--space-2)', borderBottom: 'none', padding: 0
          }}>
            Ready to start your learning adventure?
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem',
            marginBottom: 'var(--space-3)', lineHeight: 1.6
          }}>
            Join LearnHub today and give your child the gift of thinking, creating, and growing — in a fun, safe environment right here in Benin City.
          </p>
          <button onClick={onGetStarted} style={{
            background: 'var(--gold)', color: 'var(--ink)', border: 'none',
            padding: '16px 36px', borderRadius: '12px',
            fontFamily: 'var(--font-body)', fontSize: '1.05rem', fontWeight: 700,
            textTransform: 'none', letterSpacing: 'normal', cursor: 'pointer', margin: 0,
            boxShadow: '0 4px 20px rgba(232,163,61,0.4)',
            transition: 'transform 0.15s, box-shadow 0.15s'
          }}
            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 28px rgba(232,163,61,0.5)' }}
            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 20px rgba(232,163,61,0.4)' }}
          >
            Start Learning — It's Free →
          </button>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginTop: 'var(--space-2)' }}>
            📍 Located in Benin City · Safe & supervised · Ages 8–12
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: 'var(--ink)', padding: 'var(--space-4) var(--space-4) var(--space-3)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-2)' }}>
                <div style={{
                  width: '36px', height: '36px', background: 'rgba(255,255,255,0.1)',
                  borderRadius: '10px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '1.1rem'
                }}>📚</div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>
                  LearnHub
                </span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.88rem', lineHeight: 1.6, maxWidth: '260px', margin: '0 0 var(--space-2) 0' }}>
                An after-school enrichment centre helping kids aged 8–12 build the thinking skills they need to thrive.
              </p>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>
                📍 Benin City, Edo State, Nigeria
              </div>
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-1)' }}>
                Courses
              </div>
              {['Verbal Reasoning', 'Critical Thinking', 'Problem Solving', 'View All Courses'].map(link => (
                <div key={link} style={{ marginBottom: '8px' }}>
                  <button onClick={onGetStarted} style={{
                    background: 'none', border: 'none', padding: 0, margin: 0,
                    color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', cursor: 'pointer',
                    fontFamily: 'var(--font-body)', textTransform: 'none', letterSpacing: 'normal'
                  }}>{link}</button>
                </div>
              ))}
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-1)' }}>
                For Families
              </div>
              {['Enroll Your Child', 'How It Works', 'Progress Reports', 'Contact Us'].map(link => (
                <div key={link} style={{ marginBottom: '8px' }}>
                  <button onClick={onGetStarted} style={{
                    background: 'none', border: 'none', padding: 0, margin: 0,
                    color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', cursor: 'pointer',
                    fontFamily: 'var(--font-body)', textTransform: 'none', letterSpacing: 'normal'
                  }}>{link}</button>
                </div>
              ))}
            </div>
            <div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-1)' }}>
                About
              </div>
              {['Our Story', 'Our Mission', 'The Team', 'Privacy Policy'].map(link => (
                <div key={link} style={{ marginBottom: '8px' }}>
                  <button onClick={() => {}} style={{
                    background: 'none', border: 'none', padding: 0, margin: 0,
                    color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', cursor: 'pointer',
                    fontFamily: 'var(--font-body)', textTransform: 'none', letterSpacing: 'normal'
                  }}>{link}</button>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: 'var(--space-2)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: '8px'
          }}>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>
              © 2026 LearnHub · Empowering Kids to Think, Create & Grow
            </span>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>
              🦉 Powered by Owly AI · Made with ❤️ in Nigeria
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage