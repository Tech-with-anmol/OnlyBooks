import { View, TextInput, StyleSheet, Dimensions } from 'react-native';
import React, { useState } from 'react';

const { height, width } = Dimensions.get('window');

export default function TextEditor({ onChange }: { onChange: any }): JSX.Element {
  const [content, setContent] = useState('');

  const handleContentChange = (text: string) => {
    setContent(text);
    onChange(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={content}
        onChangeText={handleContentChange}
        multiline
        style={styles.editor}
        placeholder="Start typing..."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  editor: {
    height: height * 0.6,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});
