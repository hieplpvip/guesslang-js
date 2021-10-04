import { base64ToArrayBuffer } from './base64';

// @ts-ignore
import MODEL_JSON from '../model/model.json';

// @ts-ignore
import _MODEL_WEIGHTS from '../model/group1-shard1of1.bin';

const MODEL_WEIGHTS = _MODEL_WEIGHTS.replace('data:application/octet-stream;base64,', '');

export const modelLoadJson: () => Promise<{ [key: string]: any }> = async () => {
  return JSON.parse(MODEL_JSON);
};

export const modelLoadWeights: () => Promise<ArrayBuffer> = async () => {
  return base64ToArrayBuffer(MODEL_WEIGHTS);
};
