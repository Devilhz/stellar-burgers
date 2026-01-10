import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrderByNumber } from '../../services/slices/orderSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const orderData = useSelector((state) => state.order.order);
  const ingredients: TIngredient[] = useSelector(
    (state) => state.ingredients.ingredients
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const orderNumber = Number(number);
    if (!isNaN(orderNumber)) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, number]);

  const { loading: orderLoading, error: orderError } = useSelector(
    (state) => state.order
  );

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length || orderLoading) {
      return null;
    }

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients, orderLoading]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};