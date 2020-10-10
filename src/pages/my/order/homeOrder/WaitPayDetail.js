//待支付订单详情
import React, { useState, useEffect } from 'react';
import { getOrderDetails } from '../../../../api';
import { useRoute } from '@react-navigation/native';
import { Content } from '../../../../components';

import OrderInfo from '../detailComponent/OrderInfo';
import DoctorTeamInfo from '../detailComponent/DoctorTeamInfo';
import PatientInfo from '../detailComponent/PatientInfo';
import PaymentInfo from '../detailComponent/PaymentInfo';

const WaitPayDetail = () => {
  const route = useRoute();
  const [orderId, setOrderId] = useState();
  const [data, setData] = useState({});

  /**
   * 获取上个页面传来的数据
   */
  useEffect(() => {
    setOrderId(route?.params.orderId);
    return () => {};
  }, []);

  /**
   * 根据orderId获取订单详情数据
   */
  useEffect(() => {
    const fetchData = async () => {
      if (
        typeof orderId === 'undefined' ||
        orderId === null ||
        orderId === ''
      ) {
        return;
      }
      const { result, data } = await getOrderDetails.fetch(orderId);
      if (result === 'success') {
        setData(data);
      }
    };
    fetchData();
    return () => {};
  }, [orderId]);

  return (
    <Content type="full" isScroll={true}>
      <OrderInfo detailData={data} />
      <PatientInfo detailData={data} />
      <DoctorTeamInfo detailData={data} />
      <PaymentInfo />
    </Content>
  );
};

export default WaitPayDetail;
