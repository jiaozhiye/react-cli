/*
 * @Author: 焦质晔
 * @Date: 2020-05-14 19:27:24
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-15 08:20:56
 */
import { mergeTranslations } from '@/locale';

import enLocale from './en';
import zhLocale from './zh-cn';

const messages = {
  [`en`]: enLocale,
  [`zh-cn`]: zhLocale,
};

for (const key in messages) {
  mergeTranslations(key, messages[key]);
}
