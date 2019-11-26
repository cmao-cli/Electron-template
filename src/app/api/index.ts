/**
 * 基于mlz-axios的Http模块
 * 默认配置：
 * {
 *   timeout: 5000;
 *   withCredentials: true;
 *   validateStatus: status => status >= 200 && status < 599;
 * }
 * 详细用法请见：https://github.com/juicecube/mlz-axios
 */

import Http from "@mlz/axios";
import { errorParse } from "./error-code-parse";

const token = localStorage.getItem('authorization') || '';
const AUTHORIZATION_TYPE_THREE = 3;

// 全局设置token与tokenType
Http.setAuthorizationTypeOrToken('authorization_type', AUTHORIZATION_TYPE_THREE, 'Authorization', token);

// 设置全局响应拦截
Http.setResInterceptor(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      console.log(error);
      throw new Error(errorParse(error.response.data.error_code));
    }
  },
);


export const tigerApi = new Http('');
