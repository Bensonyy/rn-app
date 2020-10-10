import AsyncStorage from '@react-native-community/async-storage';

const prefix = '@app:';

export default class Store {
  static async get(k) {
    try {
      if (typeof k === 'string') {
        const value = await AsyncStorage.getItem(`${prefix}${k}`);
        if (value === null) {
          return value;
        }
        return value.includes('{') || value.includes('[')
          ? JSON.parse(value)
          : value;
      }
      if (Array.isArray(k)) {
        const keys = k.map((key) => `${prefix}${key}`);

        const kvs = await AsyncStorage.multiGet(keys);

        return kvs.reduce((values, [, value]) => [...values, value], []);
      }
      throw new Error(`Unknown key type: ${typeof k}`);
    } catch (error) {
      console.error(error, 'store get');
    }
  }

  static async set(k, value) {
    try {
      if (typeof k === 'string') {
        if (typeof value === 'object') {
          await AsyncStorage.setItem(`${prefix}${k}`, JSON.stringify(value));
        } else {
          await AsyncStorage.setItem(`${prefix}${k}`, value);
        }
        return value;
      }

      const kvs = Object.keys(k).reduce(
        (kvs, key) => [...kvs, [`${prefix}${key}`, k[key]]],
        []
      );

      const errors = await AsyncStorage.multiSet(kvs);

      return errors || k;
    } catch (error) {
      console.error(error, 'store set');
    }
  }

  static async remove(k) {
    try {
      if (typeof k === 'string') {
        await AsyncStorage.removeItem(`${prefix}${k}`);

        return k;
      }
      if (Array.isArray(k)) {
        const keys = k.map((key) => `${prefix}${key}`);
        await AsyncStorage.multiRemove(keys);

        return k;
      }
      throw new Error(
        `Unsupported type of parameter: ${typeof k}, please pass string or array of strings`
      );
    } catch (error) {
      console.error(error, 'store remove');
    }
  }
}
