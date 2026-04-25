path = '/Users/javiercifuentes/Downloads/infinite-home-lending-2/src/components/MortgageConcierge.tsx'

with open(path, 'r') as f:
    content = f.read()

old = '        <button\n          type="button"\n          onClick={handleOpen}\n          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full shadow-lg transition-all hover:opacity-90 hover:shadow-xl"\n          style={{ backgroundColor: "#0B2A4A", color: "#C6A15B" }}\n        >\n          <svg\n            xmlns="http://www.w3.org/2000/svg"\n            width={18}\n            height={18}\n            viewBox="0 0 24 24"\n            fill="none"\n            stroke="currentColor"\n            strokeWidth={2}\n            strokeLinecap="round"\n            strokeLinejoin="round"\n            aria-hidden\n          >\n            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />\n            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />\n            <line x1="12" y1="19" x2="12" y2="22" />\n          </svg>\n          <span className="text-sm font-semibold tracking-wide whitespace-nowrap">\n            Ask a Mortgage Question\n          </span>\n        </button>'

new = '''        <button
          type="button"
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50"
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
        >
          <style>{`
            @keyframes ihlRingExpand {
              0% { transform: scale(0.85); opacity: 0.5; }
              100% { transform: scale(1.55); opacity: 0; }
            }
            @keyframes ihlOrbPulse {
              0%, 100% { box-shadow: 0 0 24px rgba(198,161,91,0.3); }
              50% { box-shadow: 0 0 48px rgba(198,161,91,0.6); }
            }
            @keyframes ihlBtnFloat {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-6px); }
            }
            .ihl-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(198,161,91,0.35); animation: ihlRingExpand 2.8s ease-out infinite; pointer-events: none; }
          `}</style>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', animation: 'ihlBtnFloat 3.5s ease-in-out infinite' }}>
            <div style={{ position: 'relative', width: '72px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="ihl-ring" style={{ width: '72px', height: '72px', animationDelay: '0s' }} />
              <div className="ihl-ring" style={{ width: '72px', height: '72px', animationDelay: '0.8s' }} />
              <div className="ihl-ring" style={{ width: '72px', height: '72px', animationDelay: '1.6s' }} />
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 28%, rgba(255,240,190,0.95) 0%, rgba(198,161,91,0.8) 15%, rgba(15,55,100,0.9) 38%, rgba(5,25,55,0.97) 65%, rgba(2,8,22,1) 100%)',
                border: '2px solid rgba(198,161,91,0.8)',
                animation: 'ihlOrbPulse 2.5s ease-in-out infinite',
                position: 'relative', zIndex: 2,
              }} />
            </div>
            <span style={{ color: '#C6A15B', fontSize: '13px', fontWeight: 600, letterSpacing: '0.3px', whiteSpace: 'nowrap', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              Ask Sarah
            </span>
          </div>
        </button>'''

content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)

print('Done!')
