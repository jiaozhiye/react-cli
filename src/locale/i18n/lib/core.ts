/*
 * @Author: 焦质晔
 * @Date: 2021-07-07 10:13:17
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-07 11:00:37
 */
import BaseComponent from './Base';
import { fetchTranslation, replace } from './utils';

export const settings = {
  localeKey: 'zh-cn',
  translationsObject: {},
  getTranslations: null,
  getLocale: null,
  handleMissingTranslation: (text) => text.split('.').pop(),

  get translations() {
    return this.getTranslations ? this.getTranslations() : this.translationsObject;
  },

  set translations(translations) {
    this.translationsObject = translations;
  },

  get locale() {
    return this.getLocale ? this.getLocale() : this.localeKey;
  },

  set locale(locale) {
    this.localeKey = locale;
  },
};

export const getLocale = () => settings.locale;

export const setLocale = (locale, rerenderComponents = true) => {
  settings.locale = locale;
  settings.getLocale = null;
  if (rerenderComponents) {
    BaseComponent.rerenderAll();
  }
};

export const mergeTranslations = (name, locale) => {
  settings.translationsObject[name] = Object.assign({}, settings.translationsObject[name], locale);
};

export const getTranslations = () => settings.translations;

export const setTranslations = (translations, rerenderComponents = true) => {
  settings.translations = translations;
  settings.getTranslations = null;
  if (rerenderComponents) {
    BaseComponent.rerenderAll();
  }
};

export const setLocaleGetter = (fn) => {
  if (typeof fn !== 'function') {
    throw new Error('Locale getter must be a function');
  }
  settings.getLocale = fn;
};

export const setTranslationsGetter = (fn) => {
  if (typeof fn !== 'function') {
    throw new Error('Translations getter must be a function');
  }
  settings.getTranslations = fn;
};

export const setHandleMissingTranslation = (fn) => {
  if (typeof fn !== 'function') {
    throw new Error('Handle missing translation must be a function');
  }
  settings.handleMissingTranslation = fn;
};

export const translate = (key, replacements: any = {}, options: any = {}) => {
  const locale = options.locale || settings.locale;
  let translation = '';
  try {
    const translationLocale = settings.translations[locale] ? locale : locale.split('-')[0];
    translation = fetchTranslation(
      settings.translations,
      `${translationLocale}.${key}`,
      replacements.count
    );
  } catch (err) {
    if (options.returnNullOnError) return null;
    if (options.returnKeyOnError) return key;
    return settings.handleMissingTranslation(key);
  }
  return replace(translation, replacements);
};

export const forceComponentsUpdate = () => {
  BaseComponent.rerenderAll();
};
