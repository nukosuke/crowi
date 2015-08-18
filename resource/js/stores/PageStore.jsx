/**
 *
 */

'use strict';
import {createStore} from 'fluxible/addons';

var PageStore = createStore({
  storeName: 'PageStore',
  initialize: function () {
    this.page = {};
    this.status = {};
  },
  handleContentLoad: function (payload) {
    this.page = payload.data;
    this.status = payload.status;
    this.emitChange();
  },
  handleContentEdit: function (payload) {
    this.page = payload.data;
    this.status = payload.status;
    this.emitChange();
  },
  handlers: {
    'LOAD_PAGE': 'handleContentLoad',
    'EDIT_PAGE': 'handleContentEdit',
  },
  getState: function () {
    return {
      page: this.page,
      status: this.status
    };
  },
});

export default PageStore;
