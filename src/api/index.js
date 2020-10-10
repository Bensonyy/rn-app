import { request } from '../utils';
import { config } from '../config';
import { stringify } from 'qs';

const method = 'POST';

export const getWsUri = ({ userId }) => {
  return `${config.wsUrl}/websocket-service/im/${userId}`;
};

// 登陆
export const userLogin = {
  url: 'user-service/userPrimary/userLogin',
  fetch: async (data) => {
    return request({
      url: userLogin.url,
      method,
      data,
    });
  },
};

// 登出
export const userLogout = {
  url: 'user-service/userPrimary/loginOut',
  fetch: async (data) => {
    return request({
      url: userLogout.url,
      method,
      data,
    });
  },
};

//导诊疾病
export const getNavigationEnquiryList = {
  url: 'admin-service/navigationEnquiry/getNavigationEnquiryList',
  fetch: async (data) => {
    return request({
      url: `${getNavigationEnquiryList.url}`,
    });
  },
};
// 根据疾病编码查询 团队列表
export const getGuidanceList = {
  url: 'bizbase-service/group/guidance',
  fetch: async (data) => {
    return request({
      url: getGuidanceList.url,
      method,
      data,
    });
  },
};
// 查询评论
export const getCommentAllistByBizId = {
  url: 'comment-service/commentAllistByBizId',
  fetch: async (bizId) => {
    return request({
      url: `${getCommentAllistByBizId.url}/${bizId}`,
    });
  },
};
// 疾病列表
export const getDiseaseist = {
  url: 'bizbase-service/group/getDiseaseist',
  fetch: async (groupId) => {
    return request({
      url: `${getDiseaseist.url}/${groupId}`,
    });
  },
};
//根据疾病查询评论列表
export const commentAllistBySymptomId = {
  url: 'comment-service/commentAllistBySymptomId',
  fetch: async (symptomId) => {
    return request({
      url: `${commentAllistBySymptomId.url}/${symptomId}`,
    });
  },
};
//提交病例单信息
export const createMedical = {
  url: 'medical-service/medicalRecord/createMedical',
  fetch: async (data) => {
    return request({
      url: createMedical.url,
      method,
      data,
    });
  },
};
//查询病例单
export const getMedicalRecordByMedicalId = {
  url: 'medical-service/medicalRecord/getByMedicalId',
  fetch: async (medicalId) => {
    return request({
      url: `${getMedicalRecordByMedicalId.url}/${medicalId}`,
    });
  },
};

//查询病例单
export const getMedicalRecordByVisitCode = {
  url: 'medical-service/medicalRecord/getMedicalRecordByVisitCode',
  fetch: async (medicalId) => {
    return request({
      url: `${getMedicalRecordByVisitCode.url}/${medicalId}`,
    });
  },
};

//查询默认用户地址
export const getDefaultAddress = {
  url: 'user-service/userBasic/getDefaultAddress',
  fetch: async (userId) => {
    return request({
      url: `${getDefaultAddress.url}/${userId}`,
    });
  },
};
//查询默认就诊人
export const getDefaultMember = {
  url: 'user-service/userBasic/getDefaultMember',
  fetch: async (userId) => {
    return request({
      url: `${getDefaultMember.url}/${userId}`,
    });
  },
};
// 微信支付
export const wxPay = {
  url: 'payment-service/payment/wx/app',
  fetch: async (data) => {
    return request({
      url: wxPay.url,
      method,
      data,
    });
  },
};

// 支付宝支付
export const aliPay = {
  url: 'payment-service/payment/ali/app',
  fetch: async (data) => {
    return request({
      url: aliPay.url,
      method,
      data,
    });
  },
};

// 首页
export const homeVideoList = {
  url: 'nurse-service/video/recommendList',
  fetch: async (data) => {
    return request({
      url: homeVideoList.url,
      // method,
      // data,
    });
  },
};

// 首页难看次数
export const setVideoRead = {
  url: 'nurse-service/video/read',
  fetch: async (data) => {
    return request({
      url: setVideoRead.url,
      method,
      data,
    });
  },
};

// 查询该团队下所有项目
export const getGroupProjectByGroupId = {
  url: 'bizbase-service/groupProject/getGroupProjectByGroupId',
  fetch: async ({ groupId }) => {
    return request({
      url: `${getGroupProjectByGroupId.url}/${groupId}`,
    });
  },
};
//查询团队明细信息
export const getGroupInfoById = {
  url: 'bizbase-service/group/getGroupInfoById',
  fetch: async (data) => {
    return request({
      url: getGroupInfoById.url,
      method,
      data,
    });
  },
};
// 获取服务器时间
export const getSystemCurTime = {
  url: 'bizbase-service/common/getSystemCurTime',
  fetch: async () => {
    return request({
      url: getSystemCurTime.url,
    });
  },
};

// 创建订单
export const createOrder = {
  url: 'nurse-service/nurseOrder/create',
  fetch: async (data) => {
    return request({
      method,
      data,
      url: createOrder.url,
    });
  },
};

// 同城
export const getSameCityList = {
  url: 'nurse-service/video/getSameCityList',
  fetch: async (data) => {
    return request({
      method,
      data,
      url: getSameCityList.url,
    });
  },
};
//团队视频列表
export const getVideoRecord = {
  url: 'nurse-service/video/getVideoRecordByPage',
  fetch: async ({ groupId, pageNum }) => {
    return request({
      url: `${getVideoRecord.url}/${groupId}/${pageNum}`,
    });
  },
};
// 根据手机号码获取验证
export const getVerifCode = {
  url: 'user-service/userPrimary/sendVerifCode',
  fetch: async (data) => {
    return request({
      url: `${getVerifCode.url}/${data}`,
    });
  },
};

// 点赞小视频
export const loveVideo = {
  url: 'nurse-service/video/love',
  fetch: async (data) => {
    return request({
      method,
      data,
      url: loveVideo.url,
    });
  },
};

//取消点赞
export const canceLove = {
  url: 'nurse-service/video/canceLove',
  fetch: async (data) => {
    return request({
      method,
      data,
      url: canceLove.url,
    });
  },
};

// 关注团队
export const followGroup = {
  url: 'nurse-service/video/collectGroup',
  fetch: async (data) => {
    return request({
      method,
      data,
      url: followGroup.url,
    });
  },
};

// 取消关注团队
export const canceCollectGroup = {
  url: 'nurse-service/video/canceCollectGroup',
  fetch: async (data) => {
    return request({
      method,
      data,
      url: canceCollectGroup.url,
    });
  },
};

// 关注列表
export const getCollectGroupInfoList = {
  url: 'user-service/userCollect/getCollectGroupInfoList',
  fetch: async (userId) => {
    return request({
      url: `${getCollectGroupInfoList.url}/${userId}`,
    });
  },
};

//新增就诊人
export const createMember = {
  url: 'user-service/userBasic/createMember',
  fetch: async (data) => {
    return request({
      method,
      data,
      url: createMember.url,
    });
  },
};
//查询订单信息
export const orderInfo = {
  url: 'nurse-service/nurseOrder/getNurseOrderByOrderId',
  fetch: async (orderId) => {
    return request({
      url: `${orderInfo.url}/${orderId}`,
    });
  },
};

//就诊人列表
export const memberList = {
  url: 'user-service/userBasic/getMemberList',
  fetch: async (userId) => {
    return request({
      url: `${memberList.url}/${userId}`,
    });
  },
};

//编辑就诊人
export const editMember = {
  url: 'user-service/userBasic/editMember',
  fetch: async (data) => {
    return request({
      method,
      data,
      url: editMember.url,
    });
  },
};

//设置默认就诊人
export const editDefaultMember = {
  url: 'user-service/userBasic/editDefaultMember',
  fetch: async (data) => {
    return request({
      method,
      data,
      url: editDefaultMember.url,
    });
  },
};

//地址列表
export const addressList = {
  url: 'user-service/userBasic/getAddressList',
  fetch: async (userId) => {
    return request({
      url: `${addressList.url}/${userId}`,
    });
  },
};

//新增地址
export const createAddress = {
  url: 'user-service/userBasic/createAddress',
  fetch: async (data) => {
    return request({
      method,
      data,
      url: createAddress.url,
    });
  },
};

//编辑地址
export const editAddress = {
  url: 'user-service/userBasic/editAddress',
  fetch: async (data) => {
    return request({
      method,
      data,
      url: editAddress.url,
    });
  },
};

//设置默认地址
export const editDefaultAddress = {
  url: 'user-service/userBasic/editDefaultAddress',
  fetch: async (data) => {
    return request({
      method,
      data,
      url: editDefaultAddress.url,
    });
  },
};

//获取关注数量
export const getCollectCount = {
  url: 'user-service/userCollect/getCollectCount',
  fetch: async (userId) => {
    return request({
      url: `${getCollectCount.url}/${userId}`,
    });
  },
};

//待支付订单列表
export const getUserUnPayOrderList = {
  url: 'nurse-service/nurseOrder/getUserUnPayOrderList',
  fetch: async (userId) => {
    return request({
      url: `${getUserUnPayOrderList.url}/${userId}`,
    });
  },
};

//待确认订单列表
export const getUserUnconfirmOrderList = {
  url: 'nurse-service/nurseOrder/getUserUnconfirmOrderList',
  fetch: async (userId) => {
    return request({
      url: `${getUserUnconfirmOrderList.url}/${userId}`,
    });
  },
};

//待服务订单列表
export const getUserConfirmOrderList = {
  url: 'nurse-service/nurseOrder/getUserConfirmOrderList',
  fetch: async (userId) => {
    return request({
      url: `${getUserConfirmOrderList.url}/${userId}`,
    });
  },
};

//已完成订单列表
export const getUserFinishOrderList = {
  url: 'nurse-service/nurseOrder/getUserFinishOrderList',
  fetch: async (userId) => {
    return request({
      url: `${getUserFinishOrderList.url}/${userId}`,
    });
  },
};

//订单详情列表
export const getOrderDetails = {
  url: 'nurse-service/nurseOrder/getNurseOrderByOrderId',
  fetch: async (orderId) => {
    return request({
      url: `${getOrderDetails.url}/${orderId}`,
    });
  },
};

//根据团队id查询对应的团队信息
export const getOnlyGroupInfoById = {
  url: 'bizbase-service/group/getOnlyGroupInfoById',
  fetch: async (id) => {
    return request({
      url: `${getOnlyGroupInfoById.url}/${id}`,
    });
  },
};

//评价
export const AddComment = {
  url: 'comment-service/commentAdd',
  fetch: async (data) => {
    return request({
      method,
      data,
      url: AddComment.url,
    });
  },
};

//根据用户id查询待接诊列表
export const getWaitInquiryList = {
  url: 'medical-service/medicalinquiry/getUserUnstartInquiry',
  fetch: async (data) => {
    return request({
      method,
      data,
      url: getWaitInquiryList.url,
    });
  },
};

//根据用户id查询已结束的问诊列表
export const getFinishInquiryList = {
  url: 'medical-service/medicalinquiry/getUserEndInquiry',
  fetch: async (data) => {
    return request({
      method,
      data,
      url: getFinishInquiryList.url,
    });
  },
};

//根据就诊id查询就诊详情
export const getInquiryDetail = {
  url: 'medical-service/medicalinquiry/getMedicalInquiryByVisitCode',
  fetch: async (id) => {
    return request({
      url: `${getInquiryDetail.url}/${id}`,
    });
  },
};

// 获取用户信息
export const getUserInfo = {
  url: 'user-service/userPrimary/getUser',
  fetch: async (userId) => {
    return request({
      url: `${getUserInfo.url}/${userId}`,
    });
  },
};

// 文件上传
export const fileUpload = {
  url: 'fileupload-service/file/upload',
  fetch: async ({ formData, query }) => {
    console.log(formData, 'formData √');
    return request({
      url: `${fileUpload.url}?${stringify(query)}`,
      method,
      isJSON: false,
      data: formData,
    });
  },
};

export const isOnlineByUserId = {
  url: 'websocket-service/im/isOnlineByUserId',
  fetch: async (userId, query = '') => {
    return request({
      url: `${isOnlineByUserId.url}/${userId}${query}`,
    });
  },
};
