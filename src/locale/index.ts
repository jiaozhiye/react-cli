/*
 * @Author: 焦质晔
 * @Date: 2021-07-07 09:44:07
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-07 11:08:16
 */
import { setLocale, mergeTranslations, Translate, t } from './i18n';

const changeLocale = (lang: string): void => {
  setLocale(lang);
  localStorage.setItem('lang', lang);
};

export { t, Translate, mergeTranslations, changeLocale };
