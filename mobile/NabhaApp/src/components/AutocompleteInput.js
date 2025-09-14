import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';

const AutocompleteInput = ({ 
  data, 
  onSelect, 
  placeholder, 
  style,
  renderItem,
  keyExtractor,
  filterFunction 
}) => {
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleTextChange = (text) => {
    setQuery(text);
    
    if (text.length > 0) {
      const filtered = filterFunction ? 
        filterFunction(data, text) : 
        data.filter(item => 
          item.name?.toLowerCase().includes(text.toLowerCase()) ||
          item.nameHi?.toLowerCase().includes(text.toLowerCase()) ||
          item.namePa?.toLowerCase().includes(text.toLowerCase())
        );
      setFilteredData(filtered);
      setShowSuggestions(true);
    } else {
      setFilteredData([]);
      setShowSuggestions(false);
    }
  };

  const handleSelect = (item) => {
    onSelect(item);
    setQuery('');
    setShowSuggestions(false);
  };

  const defaultRenderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelect(item)}
    >
      <Text style={styles.suggestionText}>{item.name || item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      <TextInput
        style={styles.textInput}
        value={query}
        onChangeText={handleTextChange}
        placeholder={placeholder}
        onFocus={() => query.length > 0 && setShowSuggestions(true)}
      />
      
      {showSuggestions && filteredData.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={filteredData.slice(0, 5)} // Limit to 5 suggestions
            renderItem={renderItem || defaultRenderItem}
            keyExtractor={keyExtractor || ((item, index) => index.toString())}
            style={styles.suggestionsList}
            nestedScrollEnabled={true}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  textInput: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderTopWidth: 0,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    maxHeight: 200,
    zIndex: 1001,
  },
  suggestionsList: {
    flex: 1,
  },
  suggestionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
});

export default AutocompleteInput;
