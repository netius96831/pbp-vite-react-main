import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { getStorage, setStorage } from '../adapters/storage';

const SaveRouteComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // save the last path to storage
  useEffect(() => {
    if(location.pathname !== '/') {
      setStorage({lastPath: location.pathname}, () => {});
    }
  }, [location]);

  // navigate to last path on first load
  // may need to later add some intelligence, such as only going to top-level of tool
  useEffect(() => {
    getStorage(['lastPath'], (result) => {
      if (result?.lastPath) {
        navigate(result.lastPath)
      }
    });
  }, []);


  return null;
};

export default SaveRouteComponent;