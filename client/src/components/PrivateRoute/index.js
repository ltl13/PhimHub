import { loadUser } from 'app/userSlice';
import Loading from 'components/Loading';
import StorageKeys from 'constants/storageKeys';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children, funcId }) {
  const user = useSelector(state => state.user.current);
  const [token, setToken] = useState(localStorage[StorageKeys.access]);
  const dispatch = useDispatch();

  useEffect(() => {
    const load = async () => {
      const action = loadUser();
      await dispatch(action);
      setToken(localStorage[StorageKeys.access]);
    };

    if (token) load();

    window.addEventListener('storage', load);
    return () => {
      window.removeEventListener('storage', load);
    };
  }, [localStorage[StorageKeys.access]]);

  return !token ? (
    <Navigate to="/login" />
  ) : !!(user && funcId && user.staffType.funcs.indexOf(funcId) === -1) ? (
    <Navigate to="/" />
  ) : (
    <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
  );
}

export default PrivateRoute;
