import { Pinecone } from '@pinecone-database/pinecone';

const PINECONE_API_KEY = import.meta.env.VITE_PINECONE_API_KEY || process.env.PINECONE_API_KEY;
const PINECONE_INDEX = 'marriott';
const PINECONE_ENVIRONMENT = 'us-east-1';

if (!PINECONE_API_KEY) {
  throw new Error('PINECONE_API_KEY is not configured');
}

const pinecone = new Pinecone({
  apiKey: PINECONE_API_KEY,
});

export const index = pinecone.index(PINECONE_INDEX);

export const upsertVectors = async (vectors: any[]) => {
  try {
    await index.upsert(vectors);
    return true;
  } catch (error) {
    console.error('Error upserting vectors:', error);
    return false;
  }
};

export const queryVectors = async (queryVector: number[], topK: number = 5) => {
  try {
    const queryResponse = await index.query({
      vector: queryVector,
      topK,
      includeMetadata: true,
    });
    return queryResponse.matches;
  } catch (error) {
    console.error('Error querying vectors:', error);
    return [];
  }
};

export const deleteVectors = async (ids: string[]) => {
  try {
    await index.deleteMany(ids);
    return true;
  } catch (error) {
    console.error('Error deleting vectors:', error);
    return false;
  }
};

export default {
  index,
  upsertVectors,
  queryVectors,
  deleteVectors,
}; 