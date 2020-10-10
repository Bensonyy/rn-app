//服务订单详情
import React, { useState, useEffect } from 'react';
import { getOrderDetails } from '../../../../api';
import { useRoute } from '@react-navigation/native';

import AddressInfo from '../detailComponent/AddressInfo';
import OrderInfo from '../detailComponent/OrderInfo';
import DoctorTeamInfo from '../detailComponent/DoctorTeamInfo';
import ServiceDoctor from '../detailComponent/ServiceDoctor';
import PatientInfo from '../detailComponent/PatientInfo';
import StepsInfo from '../detailComponent/StepsInfo';
import BottomView from '../detailComponent/BottomView';
import { Content } from '../../../../components';
import { waitServiceStep } from '../../localData';

const ServiceDetail = () => {
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
      <AddressInfo detailData={data} />
      <StepsInfo stepData={waitServiceStep} activeStep={2} />
      <ServiceDoctor detailData={data} />
      <PatientInfo detailData={data} />
      <OrderInfo detailData={data} />
      <DoctorTeamInfo detailData={data} />
      <BottomView />
    </Content>
  );
};

export default ServiceDetail;
