import { Client } from 'pg';

import { dbConfig } from './constants';

export const getClient = () => new Client(dbConfig);
