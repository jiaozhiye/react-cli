/*
 * @Author: 焦质晔
 * @Date: 2021-07-07 10:12:15
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-07 11:01:43
 */
export { default as Translate } from './lib/Translate';
export { default as I18n } from './lib/I18n';
export {
  getLocale,
  setLocale,
  setLocaleGetter,
  getTranslations,
  setTranslations,
  mergeTranslations,
  setTranslationsGetter,
  setHandleMissingTranslation,
  translate,
  translate as t,
  forceComponentsUpdate,
} from './lib/core';
export { replace as translateReplace } from './lib/utils';
