import { Account, Client, ID, Avatars, Databases, Query } from 'react-native-appwrite';

export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.luisheysen.aora",
    projectId: "668ef96600340a8d226e",
    databaseId: "668efaf900387e18dabd",
    userCollectionId: "668efb150032be8cce11",
    videoCollectionId: "668efb36001885d29dba",
    storageId: "668efc6d001fabaeaebe"
}

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = config;

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform)

  const account = new Account(client);
  const avatars = new Avatars(client);
  const databases = new Databases(client);

export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw new Error;

    const avatarUrl = avatars.getInitials(username)
    
    await signIn(email, password)

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl
      }
    )

    return newUser

  } catch (error) {
    console.log(error);
    throw new Error(error)
  }
}

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password)
    return session

  } catch (error) {
    throw new Error(error)
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    )

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
}

export const getAllPosts = async () => {
  try {
    const post = await databases.listDocuments(
      databaseId,
      videoCollectionId
    )
    return post.documents;
  } catch (error) {
    throw Error(error);
  }
}

export const getLatestPosts = async () => {
  try {
    const post = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc("$createdAt", Query.limit(7))]
    )
    return post.documents;
  } catch (error) {
    throw Error(error);
  }
}
