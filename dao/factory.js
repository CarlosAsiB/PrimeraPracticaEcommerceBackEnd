import MongoProductManager from './managers/MongoProductManager.js';
import MongoCartManager from './managers/MongoCartManager.js';

class Factory {
  static getDAO(type) {
    switch (type) {
      case 'mongo':
        return {
          productDAO: new MongoProductManager(),
          cartDAO: new MongoCartManager()
        };
      default:
        throw new Error('DAO type not supported');
    }
  }
}

export default Factory;
