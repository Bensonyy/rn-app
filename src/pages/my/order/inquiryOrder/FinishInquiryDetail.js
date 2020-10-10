//已完成的问诊订单详情
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { getInquiryDetail } from '../../../../api';
import { Content } from '../../../../components';
import { inquiryOrderStep } from '../../localData';
import StepsInfo from '../detailComponent/StepsInfo';
import ConditionDescribe from '../detailComponent/ConditionDescribe';
import InquiryBottomView from '../detailComponent/InquiryBottomView';
import InquiryInfo from '../detailComponent/InquiryInfo';
import OrderInfo from '../detailComponent/OrderInfo';
import { timeConvert } from '../../../../utils';
import { stubTrue } from 'lodash-es';

const WaitInquiryDetail = () => {
  const route = useRoute();
  const [visitCode, setVisitCode] = useState();
  const [data, setData] = useState({});

  /**
   * 获取上个页面传来的数据
   */
  useEffect(() => {
    setVisitCode(route?.params?.visitCode);
    console.log('object', route?.params?.visitCode);
    return () => {};
  }, []);

  /**
   * 根据visitCode获取订单详情数据
   */
  useEffect(() => {
    const fetchData = async () => {
      if (
        typeof visitCode === 'undefined' ||
        visitCode === null ||
        visitCode === ''
      ) {
        return;
      }
      const { result, data } = await getInquiryDetail.fetch(visitCode);
      if (result === 'success') {
        setData(data);
      }
    };
    fetchData();
    return () => {};
  }, [visitCode]);

  return (
    <Content type="full" isScroll={true}>
      <StepsInfo stepData={inquiryOrderStep} isComplete={stubTrue} />
      <OrderInfo
        detailData={{
          orderNum: data.orderNum,
          createDate: timeConvert(data.visitTime, 1),
        }}
      />
      <InquiryInfo detailData={data} />
      <ConditionDescribe chiefComplaint={data?.medicalRecord?.chiefComplaint} />
      <InquiryBottomView />
    </Content>
  );
};

export default WaitInquiryDetail;
