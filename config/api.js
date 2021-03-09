//const Url="https://minipro.51dljz.com"//正式接口
const ImgUrl="https://minipro.51dljz.com"
const Url="http://testms.51dljz.com"//测试接口
//const Url="http://192.168.1.216:5401/api"


module.exports={
  //TokenUrl:"https://minipro.51dljz.com/connect/token",//获取Access_token的地址
  TokenUrl: Url + "/HXDLToken/GetToken?appid=qhmarketapi&md5key=",//获取Access_token的地址
  GetWXAppSecretUrl: Url + "/MarketingProgram/GetWXAppSecret",//获取微信小程序AppSecret
  UserUrl:Url+"/MarketingProgram/CheckWeChatCode",//获取微信code返回对应的OPENID
  ImgUrl:ImgUrl,//获取图片路径
    QueryMMSpreadImgUrl:Url+"/Spread/QueryMMSpreadImg",//获取推广海报
    QuerySpreadIndexUrl:Url+"/Spread/QuerySpreadIndex",//获取推广海报首页
    QueryPosterCategoryUrl:Url+"/Spread/QueryPosterCategory",//获取推广海报类别
    QueryPosterCategoryByIdUrl:Url+"/Spread/QueryPosterCategoryById",//根据海报类别获取海报图片
    QueryArticleCategoryUrl:Url+"/Spread/QueryArticleCategory",//获取推广文章类别
    QueryArticleCategoryByListUrl:Url+"/Spread/QueryArticleCategoryByList",//根据文章类别获取文章
    QueryArticleCategoryByIDUrl:Url+"/Spread/QueryArticleCategoryByID",//根据文章ID获取文章
    QueryMyArticlByListUrl:Url+"/Spread/QueryMyArticlByList",//我的文章列表
    CrawlerWxHtmlUrl:Url+"/Spread/CrawlerWxHtml",//上传文章
    AddSpreadActionUrl:Url+"/Spread/AddSpreadAction",//增加推广动作
    AddAchivementActionUrl:Url+"/Spread/AddAchivementAction",//记录分享成就
    AddSpreadRelationUrl:Url+"/Spread/AddSpreadRelation",//记录推广关系
    QueryVedioCategoryUrl:Url+"/Spread/QueryVedioCategory",//获取推广视频类别
    QueryVedioCategoryByListUrl:Url+"/Spread/QueryVedioCategoryByList",//根据视频类别获取视频列表
    QueryVedioCategoryByIDUrl:Url+"/Spread/QueryVedioCategoryByID",//根据视频ID获取视频
    QueryPreProductListUrl:Url+"/Product/QueryPreProductList",//获取前置产品列表
    GeneratePreOrderUrl:Url+"/Product/GeneratePreOrder",//生成前置订单
    CheckProductInServiceUrl:Url+"/Product/CheckProductInService",//提交订单检查
    CheckCellPhoneUrl:Url+"/Product/CheckCellPhone",//检查手机号是否注册
    QueryPreProductParamsUrl:Url+"/Product/QueryPreProductParams",//获取前置产品参数
    QueryPreProductPriceUrl:Url+"/Product/QueryPreProductPrice",//获取前置产品价格
    QuerySignStateUrl:Url+"/Spread/QuerySignState",//获取签到状态
    QuerySignDataUrl:Url+"/Spread/QuerySignData",//获取签到数据信息
    AddCreateSignUrl:Url+"/Spread/AddCreateSign",//签到
    QueryMyOrderUrl:Url+"/Product/QueryMyOrder",//我的订单
    DeletePreOrderUrl:Url+"/Product/DeletePreOrder",//删除未付款前置订单
    PostAchievementReceiveUrl:Url+"/Product/PostAchievementReceive",//领取订单奖励
    QueryPromotionCouponUrl:Url+"/Product/QueryPromotionCoupon",//获取促销优惠券
    AddReceiveCouponUrl:Url+"/Product/AddReceiveCoupon",//领取促销优惠券
    QueryMyCouponUrl:Url+"/Product/QueryMyCoupon",//我的优惠券
    QueryPromotionCouponUseUrl:Url+"/Product/QueryPromotionCouponUse",//促销优惠券使用
    QueryMyNamecardUrl:Url+"/MarketingProgram/QueryMyNamecard",//我的名片
    PostNamecardUrl:Url+"/MarketingProgram/PostNamecard",//更新名片设置
    PostNamecardSetupUrl:Url+"/MarketingProgram/PostNamecardSetup",//设置名片
    QueryNameCardInfoUrl:Url+"/MarketingProgram/QueryNameCardInfo",//名片信息
    QueryMySpreadUrl:Url+"/MarketingProgram/QueryMySpread",//我的推广
    QueryMyShareUrl:Url+"/MarketingProgram/QueryMyShare",//我的分享
    QueryShareVisitorsUrl:Url+"/MarketingProgram/QueryShareVisitors",//我的分享获客
    QueryShareReadUrl:Url+"/MarketingProgram/QueryShareRead",//我的分享阅读
    QueryMyVisitorsUrl:Url+"/MarketingProgram/QueryMyVisitors",//我的获客
    QueryMyVisitorsReadUrl:Url+"/MarketingProgram/QueryMyVisitorsRead",//我的获客阅读
    QueryMyVisitorsShareUrl:Url+"/MarketingProgram/QueryMyVisitorsShare",//我的获客分享
    PostRemarkNameUrl:Url+"/MarketingProgram/PostRemarkName",//基本设置更新
    QueryMyCoinPurseUrl:Url+"/MarketingProgram/QueryMyCoinPurse",//我的钱包
    PostHiddenMoneyUrl:Url+"/MarketingProgram/PostHiddenMoney",//我的钱包显示隐藏金额
    PostCashWithdrawalUrl:Url+"/MarketingProgram/PostCashWithdrawal",//我的提现
    QueryIndividualIncomeTaxUrl:Url+"/MarketingProgram/QueryIndividualIncomeTax",//个人所得税
    QueryCoinPurseTransUrl:Url+"/MarketingProgram/QueryCoinPurseTrans",//零钱包交易记录
    QuerySpreadPhraseUrl:Url+"/MarketingProgram/QuerySpreadPhrase",//获取推广短语
    PostSpreadPhraseUrl:Url+"/MarketingProgram/PostSpreadPhrase",//设置推广短语
    QueryMySpreadPhraseUrl:Url+"/MarketingProgram/QueryMySpreadPhrase",//获取我的推广短语
    QueryRankingList:Url+"/Achivement/QueryRankingList",//获取成交排行
    QueryAchievementTablet:Url+"/Achivement/QueryAchievementTablet",//获取成交碑
    QueryWeeklyTasks:Url+"/Achivement/QueryWeeklyTasks",//获取每周任务
    PostAchievementReceive:Url+"/Achivement/PostAchievementReceive",//领取成就
    PostRealName:Url+"/MarketingProgram/PostRealName",//实名认证   
    Check:Url+"/MarketingProgram/Check",//活体检测
    QueryCommonInfoUrl:Url+"/MarketingProgram/QueryCommonInfo",//我的成就
    QueryBasicSetupe:Url+"/MarketingProgram/QueryBasicSetupe",//基本设置
    PostBasicSetupeUrl:Url+"/MarketingProgram/PostBasicSetupe",//更新基本设置
    QueryMyAchivement:Url+"/Achivement/QueryMyAchivement",//我的成就
    BankCardIdentify:Url+"/MarketingProgram/BankCardIdentify",//银行卡认证
    VerificationCode:Url+"/MarketingProgram/VerificationCode",//获取验证码
    BindMobilePhone:Url+"/MarketingProgram/BindMobilePhone",//绑定手机号
    QueryCustServiceUrl:Url+"/MarketingProgram/QueryCustService",//客服服务人员
  QueryCustServiceMessage: Url + "/WxWeChat/PullMessageListDetailByCustomer",//客服微信客服消息
  MyVisitorsOrderUrl:Url + '/MarketingProgram/MyVisitorsOrder', //我的获客订单
  GetWxOpenIDUrl: Url + '/MarketingProgram/GetWeChatOpenId', //获取用户OpenID
  WxPayOrderPrepaidUrl: Url + '/PayAPI/OrderPrepaidCommon', //微信支付
  CreateWxCodeUrl: Url + '/MarketingProgram/CreateWxCode', //微信二维码获取
  PostGenerateActivityUrl: Url + '/MarketingProgram/PostGenerateActivity', //生成推广活动
  QueryMyActivityUrl: Url + '/MarketingProgram/QueryMyActivity', //我的推广活动
  QueryCheckActivityUrl: Url + '/MarketingProgram/QueryCheckActivity', //当前推广活动完步骤
  PostCloseActivityBoxUrl: Url + '/MarketingProgram/PostCloseActivityBox', //关闭推广活动弹框
  PostTransferCouponUrl: Url + '/Product/PostTransferCoupon', //赠与促销优惠券
  PostGenerateLotteryUrl: Url + '/MarketingProgram/PostGenerateLottery', //生成抽奖信息
  QueryLotteryInfoUrl: Url + '/MarketingProgram/QueryLotteryInfo', //抽奖信息
  PostLotteryRunUrl: Url + '/MarketingProgram/PostLotteryRun', //抽奖过程
  PostLotteryWinUrl: Url + '/MarketingProgram/PostLotteryWin', //中奖领取
  QueryLotteryRecordUrl: Url + '/MarketingProgram/QueryLotteryRecord', //好运播报(中奖记录)
  QueryMyLotteryRecordUrl: Url + '/MarketingProgram/QueryMyLotteryRecord', //我的中奖记录
  QueryCarouselMgsUrl: Url + '/MarketingProgram/QueryCarouselMgs', //首页消息轮播图
  
  
}