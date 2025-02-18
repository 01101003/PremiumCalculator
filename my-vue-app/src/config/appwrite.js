// src/config/appwrite.js
import { Client, Account, Databases, ID } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67a9c97e000c15d5ed35');

export const account = new Account(client);
export const databases = new Databases(client);

// Database and Collection IDs
export const DATABASE_ID = '67a9c9ff000d929c2fc4';
export const COLLECTIONS = {
    USERS: 'users',                    // Main users collection
    AUTH_CREDENTIALS: 'auth_creds',    // Authentication credentials
    CALCULATIONS: 'calculations'        // User calculations
};

export const appwriteService = {
    // Helper function to generate sequential user ID
    async generateUserId() {
        try {
            const users = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.USERS,
                [
                    databases.Query.orderDesc('user_id'),
                    databases.Query.limit(1)
                ]
            );
            return users.total === 0 ? 1 : users.documents[0].user_id + 1;
        } catch (error) {
            throw new Error('Failed to generate user ID');
        }
    },

    // Create new user document
    async createUserDocument(userId, email, name, profileImage = null) {
        return await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            ID.unique(),
            {
                user_id: userId,
                email: email,
                name: name,
                profile_image: profileImage,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                is_active: true
            }
        );
    },

    // Create auth credentials document
    async createAuthCredentials(userId, provider, providerUserId) {
        return await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.AUTH_CREDENTIALS,
            ID.unique(),
            {
                user_id: userId,
                provider: provider,         // 'email' or 'google'
                provider_user_id: providerUserId,
                created_at: new Date().toISOString(),
                last_login: new Date().toISOString()
            }
        );
    },

    // Create new account with email
    async createEmailAccount(email, password, name) {
        try {
            // Create Appwrite account
            const appwriteUser = await account.create(
                ID.unique(),
                email,
                password,
                name
            );

            // Generate user ID
            const userId = await this.generateUserId();

            // Create user document
            await this.createUserDocument(userId, email, name);

            // Create auth credentials
            await this.createAuthCredentials(userId, 'email', appwriteUser.$id);

            // Create session
            return await this.login(email, password);
        } catch (error) {
            throw error;
        }
    },

    // Create account with Google
    async createGoogleAccount(googleUser) {
        try {
            const userId = await this.generateUserId();

            // Create user document
            await this.createUserDocument(
                userId,
                googleUser.email,
                googleUser.name,
                googleUser.photoUrl
            );

            // Create auth credentials
            await this.createAuthCredentials(userId, 'google', googleUser.id);

            return {
                userId: userId,
                ...googleUser
            };
        } catch (error) {
            throw error;
        }
    },

    // Login with email
    async login(email, password) {
        try {
            const session = await account.createEmailSession(email, password);
            const userData = await this.getUserByProviderId('email', session.userId);
            
            // Update last login
            await this.updateLastLogin(userData.user_id, 'email', session.userId);

            return {
                ...session,
                ...userData
            };
        } catch (error) {
            throw error;
        }
    },

    // Login with Google
    async loginWithGoogle(googleUser) {
        try {
            // Check if user exists
            const existingUser = await this.getUserByProviderId('google', googleUser.id);
            
            if (existingUser) {
                // Update last login
                await this.updateLastLogin(existingUser.user_id, 'google', googleUser.id);
                return existingUser;
            }

            // If user doesn't exist, create new account
            return await this.createGoogleAccount(googleUser);
        } catch (error) {
            throw error;
        }
    },

    // Update last login
    async updateLastLogin(userId, provider, providerUserId) {
        try {
            const credentials = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.AUTH_CREDENTIALS,
                [
                    databases.Query.equal('user_id', userId),
                    databases.Query.equal('provider', provider),
                    databases.Query.equal('provider_user_id', providerUserId),
                ]
            );

            if (credentials.total > 0) {
                await databases.updateDocument(
                    DATABASE_ID,
                    COLLECTIONS.AUTH_CREDENTIALS,
                    credentials.documents[0].$id,
                    {
                        last_login: new Date().toISOString()
                    }
                );
            }
        } catch (error) {
            console.error('Failed to update last login:', error);
        }
    },

    // Get user by provider ID
    async getUserByProviderId(provider, providerUserId) {
        try {
            const credentials = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.AUTH_CREDENTIALS,
                [
                    databases.Query.equal('provider', provider),
                    databases.Query.equal('provider_user_id', providerUserId),
                ]
            );

            if (credentials.total === 0) {
                return null;
            }

            const userId = credentials.documents[0].user_id;
            const userDoc = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.USERS,
                [databases.Query.equal('user_id', userId)]
            );

            return userDoc.documents[0];
        } catch (error) {
            throw error;
        }
    },

    // Save calculation
    async saveCalculation(userId, calculationType, input, result) {
        try {
            return await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.CALCULATIONS,
                ID.unique(),
                {
                    user_id: userId,
                    type: calculationType,
                    input: input,
                    result: result,
                    timestamp: new Date().toISOString()
                }
            );
        } catch (error) {
            throw error;
        }
    },

    // Get user calculations
    async getUserCalculations(userId) {
        try {
            return await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.CALCULATIONS,
                [
                    databases.Query.equal('user_id', userId),
                    databases.Query.orderDesc('timestamp')
                ]
            );
        } catch (error) {
            throw error;
        }
    }
};