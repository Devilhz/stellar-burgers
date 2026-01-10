import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type TProtectedRoute = {
  unAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute: FC<TProtectedRoute> = ({
  unAuth = false,
  children
}) => {
  const { user, authChecked: isAuthChecked } = useSelector(
    (state) => state.user
  );
  const isAuth = !!user;
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (unAuth && isAuth) {
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  if (!unAuth && !isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};