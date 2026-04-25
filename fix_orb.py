path = '/Users/javiercifuentes/Downloads/infinite-home-lending-2/src/components/MortgageConcierge.tsx'

with open(path, 'r') as f:
    content = f.read()

# Fix 1: stronger ring visibility
content = content.replace(
    '.ihl-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(198,161,91,0.35); animation: ihlRingExpand 2.8s ease-out infinite; pointer-events: none; z-index: 49; }',
    '.ihl-ring { position: absolute; border-radius: 50%; border: 2px solid rgba(198,161,91,0.55); animation: ihlRingExpand 2.8s ease-out infinite; pointer-events: none; z-index: 49; }'
)

# Fix 2: bigger orb + stronger border + dark shadow for contrast on light bg
content = content.replace(
    'width: \'72px\', height: \'72px\', borderRadius: \'50%\',\n                background: \'radial-gradient(circle at 30% 28%, rgba(255,240,190,0.95) 0%, rgba(198,161,91,0.8) 15%, rgba(15,55,100,0.9) 38%, rgba(5,25,55,0.97) 65%, rgba(2,8,22,1) 100%)\',\n                border: \'2px solid rgba(198,161,91,0.8)\',\n                animation: \'ihlOrbPulse 2.5s ease-in-out infinite\',\n                position: \'relative\', zIndex: 2,',
    'width: \'80px\', height: \'80px\', borderRadius: \'50%\',\n                background: \'radial-gradient(circle at 30% 28%, rgba(255,240,190,0.95) 0%, rgba(198,161,91,0.9) 15%, rgba(15,55,100,0.95) 38%, rgba(5,25,55,0.98) 65%, rgba(2,8,22,1) 100%)\',\n                border: \'3px solid rgba(198,161,91,0.95)\',\n                animation: \'ihlOrbPulse 2.5s ease-in-out infinite\',\n                boxShadow: \'0 0 0 4px rgba(11,42,74,0.4), 0 8px 32px rgba(0,0,0,0.5)\',\n                position: \'relative\', zIndex: 2,'
)

# Fix 3: match ring container size to new orb size
content = content.replace(
    'position: \'relative\', width: \'72px\', height: \'72px\', display: \'flex\', alignItems: \'center\', justifyContent: \'center\'',
    'position: \'relative\', width: \'80px\', height: \'80px\', display: \'flex\', alignItems: \'center\', justifyContent: \'center\''
)

# Fix 4: match ring sizes to new orb size
content = content.replace(
    'className="ihl-ring" style={{ width: \'72px\', height: \'72px\', animationDelay: \'0s\' }}',
    'className="ihl-ring" style={{ width: \'80px\', height: \'80px\', animationDelay: \'0s\' }}'
)
content = content.replace(
    'className="ihl-ring" style={{ width: \'72px\', height: \'72px\', animationDelay: \'0.8s\' }}',
    'className="ihl-ring" style={{ width: \'80px\', height: \'80px\', animationDelay: \'0.8s\' }}'
)
content = content.replace(
    'className="ihl-ring" style={{ width: \'72px\', height: \'72px\', animationDelay: \'1.6s\' }}',
    'className="ihl-ring" style={{ width: \'80px\', height: \'80px\', animationDelay: \'1.6s\' }}'
)

with open(path, 'w') as f:
    f.write(content)

print('Done!')
