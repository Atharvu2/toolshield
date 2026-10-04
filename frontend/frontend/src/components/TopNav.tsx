import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

export default function TopNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-6 font-mono text-[12px] font-medium bg-bg/80 backdrop-blur-md">
      <div>
        <NavLink to="/" className="uppercase tracking-wide text-fg hover:text-fg/80">TOOLSHIELD</NavLink>
      </div>
      <div className="flex gap-8">
        {[
          { name: 'Overview', path: '/' },
          { name: 'Findings', path: '/finding' },
          { name: 'Evidence', path: '/evidence' },
          { name: 'Baseline', path: '/baseline' },
          { name: 'Validation', path: '/validation' }
        ].map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path}
            className={({ isActive }) => clsx(
              "uppercase tracking-wide transition-colors duration-200",
              isActive ? "text-fg underline underline-offset-4 decoration-2" : "text-muted hover:text-fg"
            )}
          >
            {item.name}
          </NavLink>
        ))}
      </div>
      <div>
        <NavLink to="/analyze" className="uppercase tracking-wide text-fg hover:text-fg/80">Analyze Repository</NavLink>
      </div>
    </nav>
  );
}