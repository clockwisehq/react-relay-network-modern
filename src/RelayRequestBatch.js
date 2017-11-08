/* @flow */

import type { FetchOpts } from './definition';
import type RelayRequest from './RelayRequest';

export type Requests = RelayRequest[];

export default class RelayRequestBatch {
  fetchOpts: $Shape<FetchOpts>;
  requests: Requests;

  constructor(requests: Requests) {
    this.requests = requests;
    this.fetchOpts = {
      method: 'POST',
      headers: {},
      body: this.prepareBody(),
    };
  }

  getDebugName(): string {
    return `BATCH_QUERY:${this.getID()}`;
  }

  getBody(): string {
    if (!this.fetchOpts.body) {
      this.fetchOpts.body = this.prepareBody();
    }
    return (this.fetchOpts.body: any) || '';
  }

  prepareBody(): string {
    return `[${this.requests.map(r => r.getBody()).join(',')}]`;
  }

  getIds(): string[] {
    return this.requests.map(r => r.getID());
  }

  getID(): string {
    return `BATCH_REQUEST:${this.getIds().join(':')}`;
  }

  isMutation() {
    return false;
  }

  isFormData() {
    return false;
  }

  clone(): RelayRequestBatch {
    // $FlowFixMe
    const newRequest = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    newRequest.fetchOpts = { ...this.fetchOpts };
    newRequest.fetchOpts.headers = { ...this.fetchOpts.headers };
    return (newRequest: any);
  }
}
