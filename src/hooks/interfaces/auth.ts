export interface ToastData {
  message: string;
  type: "success" | "error" | "info";
}

export interface IUser {
  strUserGUID: string;
  strUserName: string;
  strFullName: string;
  strFirstName: string;
  strLastName: string;

  strAvatar: string;

  strAgentCode: string;
  strMemberCode: string;

  strPhone: Record<string, any>;
  strMobile: string;

  strEmail: string;
  strEmailWorking: string;

  strContactAddr: string;

  intMemberRoleID: number;
  intMemberTypeID: number;
  intCurrencyID: number;
  intLangID: number;
  strLangCode: string;

  strJobTitle: string;
  strCompany: string;

  strFacebook: string;
  strSkype: string;

  strRemark: string;
  strSignature: string;

  IsFullView: boolean;
  IsViewBtnListAgtHost: number;

  strCompanyGUID: string;
  strCompanyCode: string;
  strCompanyName: string;

  strCompanyEmail: string;
  strCompanyPhone: string;
  strCompanyAddr: string;
  strCompanyWeb: string;

  strCompanyLogo: string;

  intCompanyTypeID: number;
  intComLangID: number;
  intComCurrencyID: number;

  strRefCode: string;
  strCompanyRefCode: string;

  strCompanyTaxCode: Record<string, any>;
  strAgentPolicy: Record<string, any>;
  strDescription: Record<string, any>;
}