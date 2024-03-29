/*
 * @Author: 焦质晔
 * @Date: 2021-02-12 13:18:02
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-01-15 14:35:54
 */
export default {
  name: 'en',
  app: {
    global: {
      title: 'Cloud Platform',
      home: 'Home',
      dashboard: 'Dashboard',
      emptyText: 'No Data',
      noMatch: 'Sorry, the page you visited does not exist.',
      noAuth: 'Sorry, you do not have access to this page.',
      errorLoad: 'Loading error, Please refresh the page and try again.',
      leaveText: 'Data not saved, are you sure to leave?',
      selectText: 'Please select row data!',
    },
    sidebar: {
      allNavTitle: 'All Navigation',
      allNavPlaceholder: 'Please enter menu name/pinyin',
      usedNav: 'Common Use',
      starNav: 'My Collection',
      star: 'Star',
      unstar: 'Unstar',
    },
    header: {
      fold: 'Fold',
      unfold: 'Unfold',
    },
    multiTab: {
      refresh: 'Refresh page',
      closeRight: 'Close right',
      closeLeft: 'Close left',
      closeOthers: 'Close other',
    },
    settings: {
      usercenter: 'User center',
      usersetting: 'User setting',
      clearcache: 'Clear cache',
      logout: 'Logout',
      admin: 'Administrator',
    },
    insideLetter: {
      notice: 'Notice',
      message: 'Message',
      waiting: 'Todo',
    },
    dreadcrumb: {
      location: 'Location',
    },
    sizeSelect: {
      large: 'Large Size',
      middle: 'Middle Size',
      small: 'Small Size',
    },
    helperDoc: {
      helpDoc: 'Help Document',
      useManual: 'Use Manual',
    },
    login: {
      title: 'System login',
      weChat: 'WeChat login',
    },
    theme: {
      color: 'Theme color',
      type: 'Theme type',
    },
    widget: {
      fullScreen: 'Full Screen',
    },
    fetch: {
      errorCode: {
        200: 'The server successfully returned data.',
        201: 'Successfully created or modified data.',
        202: 'A request has entered the background queue (asyn task).',
        204: 'Data deleted successfully.',
        400: 'There is an error in the request, the server has not performed the operation of creating or modifying data.',
        401: 'User does not have permission (token, user name, password error).',
        403: 'The user is authorized, but access is prohibited.',
        404: 'Request sent is for a nonexistent record, and the server did not operate.',
        406: 'Request format is not available.',
        410: 'Request resource is permanently deleted and will no longer be available.',
        412: 'Client request information precondition error.',
        422: 'A validation error occurred while creating an object.',
        500: 'An error occurred on the server, Please check the server.',
        502: 'Gateway error.',
        503: 'Service is unavailable, the server is overloaded or under maintained.',
        504: 'Gateway timeout.',
      },
      errorText: 'Request timeout.',
      lockText: 'Lock request.',
      cancelText: 'Cancel request.',
    },
    information: {
      title: 'Prompt information',
      confirm: 'Confirm the operation?',
      maxCache: 'Most support open {total} menus!',
      maxStar: 'Most to star {total} menus!',
    },
    button: {
      confirm: 'Confirm',
      cancel: 'Cancel',
      close: 'Close',
      submit: 'Submit',
      remove: 'Remove',
      add: 'Add',
      edit: 'Edit',
      modify: 'Modify',
      details: 'Details',
      view: 'View',
      print: 'Print',
      export: 'Export',
      import: 'Import',
      upload: 'Upload',
      download: 'Download',
      search: 'Search',
      reset: 'Reset',
      save: 'Save',
      clear: 'Clear',
      operation: 'Operation',
      preview: 'Preview',
    },
  },
};
