import {StyleSheet} from 'react-native';

const pageStyles = StyleSheet.create({
    container: { flex: 1, padding: 0, paddingTop: 0, backgroundColor: '#fff' },
    head: { height: 40, backgroundColor: '#f1f8ff' },
    borderStyle: { borderTopColor: '#f1f8ff', borderWidth: 1, borderColor: '#f1f8ff', margin: 0 },
    tableBackgroundColor: {backgroundColor : '#f1f8ff'},
    text: { margin: 6 },
    dataWrapper: { marginTop: -1 },
    tableHeadBorder: {borderWidth: 1,borderBottomWidth: 2 ,borderColor: '#f1f8ff' },
    tableHeaderBorder: {borderWidth: 1, borderColor: '#f1f8ff'},
    totalRow:{fontWeight:"bold", textAlign: 'center',fontSize: 16},
    tableText: { margin: 6, textAlign: 'center' },
    standardBlue: {color:'#f1f8ff'},
    
});

export default pageStyles;