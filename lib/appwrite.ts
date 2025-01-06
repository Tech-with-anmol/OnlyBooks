import { Client, Account, ID } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6779564100386907580f')
    .setPlatform('com.ak.OnlyBooks');

export { Account , client}
