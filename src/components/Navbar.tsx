import { NavLink } from 'react-router-dom'
import tools from '../tools';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx'

import { user } from '../utils/auth';

function Navbar() {
  const allowedTools = tools.filter(tool => user.value.tools.includes(tool.id))
  return (
    <div className="flex gap-2 justify-between">
      {allowedTools.map((item) => (
        <NavLink
          to={item.path}
          key={item.name}
          className={({ isActive }) => clsx(
            "border border-sky-300 p-1 pb-2 rounded-sm hover:bg-sky-500  w-full text-center text-sm",
            isActive ? "active bg-sky-700 text-white" : "text-sky-900 hover:text-sky-100",
            "flex flex-col items-center gap-1"
          )}
        >
          {item.name}

          {/* Right now, fontAwesome will flash whenever the popup first loads, before the stylesheets are loaded.
            This maxWidth is in order to keep the flashing from being too dramatic.
            Long-term, I'd like to figure out why it's flashing. */}
          <div style={{ maxWidth: "1rem" }}>
            <FontAwesomeIcon icon={item.icon} />
          </div>
        </NavLink>
      ))}
    </div>
  )
}

export default Navbar;