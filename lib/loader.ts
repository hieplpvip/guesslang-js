import { base64ToArrayBuffer } from './base64';

// @ts-ignore
import MODEL_JSON from '../model/model.json';

// @ts-ignore
import MODEL_WEIGHTS from '../model/group1-shard1of1.bin';

export const modelLoadJson: () => Promise<{ [key: string]: any }> = async () => {
  return JSON.parse(MODEL_JSON);
};

export const modelLoadWeights: () => Promise<ArrayBuffer> = async () => {
  return base64ToArrayBuffer(MODEL_WEIGHTS);
};
