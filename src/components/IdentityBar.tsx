import { NavLink } from 'react-router-dom';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const IdentityBar = ({name}: {name: string}) => {
  return (
    <div className="pb-1 flex justify-between">
      <div>Welcome, {name}!</div>
      <NavLink to="/settings" className="flex gap-1 items-center">
        <FontAwesomeIcon icon={faGear} />
        <div>Settings</div>
      </NavLink>
    </div>
  )
}

export default IdentityBar;