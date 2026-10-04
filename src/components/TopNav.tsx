import { NavLink } from 'react-router-dom';

export default function TopNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-bg/90 backdrop-blur-sm border-b border-border">
      <NavLink to="/" className="font-mono text-xs tracking-widest uppercase text-fg hover:text-accent transition-colors">
        ToolShield
      </NavLink>
      <div className="flex gap-7">
        {[
          { name: 'Overview',   path: '/'           },
          { name: 'Findings',   path: '/finding'    },
          { name: 'Evidence',   path: '/evidence'   },
          { name: 'Baseline',   path: '/baseline'   },
          { name: 'Validation', path: '/validation' },
        ].map(item => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `font-sans text-sm transition-colors duration-150 ${
                isActive
                  ? 'text-fg underline underline-offset-4 decoration-accent decoration-2'
                  : 'text-muted hover:text-fg'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>
      <NavLink
        to="/analyze"
        className="font-sans text-sm text-fg border border-fg px-4 py-2 hover:bg-fg hover:text-bg transition-colors duration-150"
      >
        Analyze repository
      </NavLink>
    </nav>
  );
}