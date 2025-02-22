// src/config/appwrite.js
import { Client, Account, Databases, ID, Functions, Realtime } from 'appwrite';

// Load environment variables for security (recommended for Vercel)
const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);
export const realtime = new Realtime(client); // Add Realtime service

// Database and Collection IDs
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE;
export const COLLECTIONS = {
    USERS: import.meta.env.VITE_APPWRITE_USERS_COLLECTION,
    AUTH_CREDENTIALS: import.meta.env.VITE_APPWRITE_AUTH_COLLECTION,
    CALCULATIONS: import.meta.env.VITE_APPWRITE_CALCULATIONS_COLLECTION
};

// Appwrite Service
export const appwriteService = {
    // Generate sequential user ID
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
            console.error('Failed to generate user ID:', error);
            throw error;
        }
    },

    // Create new user document
    async createUserDocument(userId, email, name, profileImage = null) {
        try {
            return await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.USERS,
                ID.unique(),
                {
                    user_id: userId,
                    email,
                    name,
                    profile_image: profileImage,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    is_active: true
                }
            );
        } catch (error) {
            console.error('Error creating user document:', error);
            throw error;
        }
    },

    // Create authentication credentials
    async createAuthCredentials(userId, provider, providerUserId) {
        try {
            return await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.AUTH_CREDENTIALS,
                ID.unique(),
                {
                    user_id: userId,
                    provider,
                    provider_user_id: providerUserId,
                    created_at: new Date().toISOString(),
                    last_login: new Date().toISOString()
                }
            );
        } catch (error) {
            console.error('Error storing auth credentials:', error);
            throw error;
        }
    },

    // Create new user account
    async createEmailAccount(email, password, name) {
        try {
            const appwriteUser = await account.create(ID.unique(), email, password, name);
            const userId = await this.generateUserId();

            await this.createUserDocument(userId, email, name);
            await this.createAuthCredentials(userId, 'email', appwriteUser.$id);

            return await this.login(email, password);
        } catch (error) {
            console.error('Error creating email account:', error);
            throw error;
        }
    },

    // Login with email
    async login(email, password) {
        try {
            const session = await account.createEmailSession(email, password);
            const userData = await this.getUserByProviderId('email', session.userId);

            await this.updateLastLogin(userData.user_id, 'email', session.userId);
            return { ...session, ...userData };
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },

    // Logout user
    async logout() {
        try {
            await account.deleteSession('current');
        } catch (error) {
            console.error('Logout failed:', error);
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
                    { last_login: new Date().toISOString() }
                );
            }
        } catch (error) {
            console.error('Failed to update last login:', error);
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
                    input,
                    result,
                    timestamp: new Date().toISOString()
                }
            );
        } catch (error) {
            console.error('Error saving calculation:', error);
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
            console.error('Error fetching calculations:', error);
            throw error;
        }
    },

    // ==========================
    // 🌟 Appwrite Cloud Functions
    // ==========================

    // Execute an Appwrite Cloud Function
    async executeFunction(functionId, payload = {}) {
        try {
            const response = await functions.createExecution(
                functionId,
                JSON.stringify(payload)
            );
            return response;
        } catch (error) {
            console.error(`Error executing function ${functionId}:`, error);
            throw error;
        }
    },

    // Create user via cloud function
    async createUserViaFunction(userId, email, name) {
        return await this.executeFunction('CREATE_USER_FUNCTION_ID', { userId, email, name });
    },

    // Delete inactive users via cloud function
    async deleteInactiveUsers() {
        return await this.executeFunction('DELETE_INACTIVE_USERS_FUNCTION_ID');
    },

    // Send welcome email via cloud function
    async sendWelcomeEmail(email, name) {
        return await this.executeFunction('SEND_WELCOME_EMAIL_FUNCTION_ID', { email, name });
    },

    // ==========================
    // 🌟 Realtime Subscriptions
    // ==========================

    // Subscribe to Realtime updates
    subscribeToRealtime(channel, callback) {
        return realtime.subscribe(channel, callback);
    },

    // Unsubscribe from Realtime updates
    unsubscribeFromRealtime(subscription) {
        return realtime.unsubscribe(subscription);
    }
};

