/*
 * @Author: 焦质晔
 * @Date: 2021-07-07 11:07:39
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-18 18:22:04
 */
import { setTranslations, setLocale } from './i18n';
import config from '@/config';

import enLocale from './lang/en';
import zhLocale from './lang/zh-cn';

const messages = {
  [enLocale.name]: {
    app: enLocale.app,
  },
  [zhLocale.name]: {
    app: zhLocale.app,
  },
};

setTranslations(messages);
setLocale(localStorage.getItem('lang') || config.lang);
