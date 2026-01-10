import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/feedsSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const userOrders: TOrder[] = useSelector((state) => state.feed.userOrders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={userOrders} />;
};