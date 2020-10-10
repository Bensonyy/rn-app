import React, { useState, useEffect, useCallback } from 'react';
import { Text, View, Keyboard, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Store } from '../../utils';
const SeachPage = () => {
  const [keywords, setKeyWords] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);
    getArr();
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);
  const setStore = useCallback(async () => {
    return await Store.set('searchArr', searchHistory);
  }, [searchHistory]);
  useEffect(() => {
    // setTimeout(async () => {
    //   await Store.set('searchArr', searchHistory);
    // }, 500);
    setStore();
  }, [setStore]);
  const _keyboardDidShow = () => {
    //   alert("Keyboard Shown");
  };
  const getArr = async () => {
    const arr = await Store.get('searchArr');
    setSearchHistory([...arr]);
  };
  const _keyboardDidHide = () => {
    //   alert("Keyboard Hidden");
  };
  const renderSearchBar = () => {
    return (
      <SearchBar
        placeholder="搜索"
        platform="ios"
        cancelButtonTitle="取消"
        onChangeText={updateSearch}
        onSubmitEditing={handleSubmit}
        value={keywords}
      />
    );
  };
  const updateSearch = (params) => {
    // console.log(params);
    setKeyWords(params);
  };
  const handleSubmit = () => {
    setSearchHistory((list) => [...list, keywords]);
    setKeyWords('');
    Keyboard.dismiss();
  };
  return (
    <View>
      {renderSearchBar()}
      <View style={style.container}>
        {searchHistory.map((item) => (
          <View style={style.item}>
            <Text>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
export default SeachPage;
const style = StyleSheet.create({
  container: {
    width: 375,
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  item: {
    width: '50%',
    paddingLeft: 50,
    paddingTop: 10,
  },
});
