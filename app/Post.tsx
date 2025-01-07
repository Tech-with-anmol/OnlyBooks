import { View, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import TextEditor from '@/component/TextEditor';

export default function Post() {
  const handleEditorChange = (content: string) => {
    console.log(content);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          <TextEditor onChange={handleEditorChange} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});