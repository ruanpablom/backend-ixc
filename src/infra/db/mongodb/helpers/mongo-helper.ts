import { MongoClient, Collection } from 'mongodb'

export const MongoHelper = {
  db: {connected: false},
  client: null as unknown as MongoClient | null,
  uri: null as unknown as string | null,

  async connect (uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri);
    this.client.on('open', () => {this.db.connected = true; console.log('MongoDB connected')});
    this.client.on('topologyClosed', () => {this.db.connected = false; console.log('MongoDB disconnected')});
  },

  async disconnect (): Promise<void> {
    await this.client!.close()
    this.client = null
  },

  async getCollection (name: string): Promise<Collection> {
    if (!this.db.connected) {
      await this.connect(this.uri!)
    }
    return this.client!.db().collection(name)
  },

  map: (collection: any): any => {
    const { _id, ...collectionWithoutId } = collection
    return Object.assign({}, collectionWithoutId, { id: _id })
  }
}