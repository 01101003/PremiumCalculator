// src/config/appwrite.js
import { Client, Account, Databases, ID, Functions, Query } from 'appwrite';

// Initialize the Appwrite client
const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

// Export Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);

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
                    Query.orderDesc('user_id'),
                    Query.limit(1)
                ]
            );
            return users.total === 0 ? 1 : users.documents[0].user_id + 1;
        } catch (error) {
            console.error('Failed to generate user ID:', error);
            throw new Error(`Failed to generate user ID: ${error.message}`);
        }
    },

    ensureIntegerId(userId) {
        console.log('ensureIntegerId called with:', userId, typeof userId);
        
        if (userId === null || userId === undefined) {
            throw new Error('User ID is required');
        }
        
        // If already a number, return it
        if (typeof userId === 'number') {
            return userId;
        }
        
        // Try to parse as integer
        const userIdInt = parseInt(userId, 10);
        if (isNaN(userIdInt)) {
            throw new Error('Invalid user ID format. User ID must be an integer.');
        }
        
        console.log('ensureIntegerId returning:', userIdInt, typeof userIdInt);
        return userIdInt;
    },

    // Create new user document
    async createUserDocument(userId, email, name, profileImage = null) {
        try {
            if (!userId || !email || !name) {
                throw new Error('Missing required fields for user document creation');
            }

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
            throw new Error(`Failed to create user document: ${error.message}`);
        }
    },

    // Create authentication credentials
    async createAuthCredentials(userId, provider, providerUserId) {
        try {
            if (!userId || !provider || !providerUserId) {
                throw new Error('Missing required fields for auth credentials');
            }

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
            throw new Error(`Failed to create auth credentials: ${error.message}`);
        }
    },

    // Create new user account
    async createEmailAccount(email, password, name) {
        try {
            console.log('Creating new account for:', email, name);
            
            // Create a valid ID for the auth account
            const uniqueId = ID.unique();
            
            // Create the auth account first
            await account.create(uniqueId, email, password, name);
            
            // Generate the sequential user ID for our custom users collection
            const userId = await this.generateUserId();
            console.log('Generated userId:', userId, typeof userId);
            
            // Create the user document
            const userDoc = await this.createUserDocument(userId, email, name);
            console.log('Created user document:', userDoc);

            // Create auth credentials
            const authCreds = await this.createAuthCredentials(userId, 'email', uniqueId);
            console.log('Created auth credentials:', authCreds);

            // Create a session
            const session = await account.createEmailPasswordSession(email, password);
            const userData = await this.getUserByProviderId('email', uniqueId);
            
            console.log('Session created:', session);
            console.log('User data retrieved:', userData);

            return { ...session, ...userData };
        } catch (error) {
            console.error('Error creating email account:', error);
            throw new Error(`Account creation failed: ${error.message}`);
        }
    },

    // Login with email
    async login(email, password) {
        try {
            console.log('Attempting login for email:', email);
            
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            const session = await account.createEmailPasswordSession(email, password);
            console.log('Login session created:', session);
            
            const userData = await this.getUserByProviderId('email', session.userId);
            console.log('User data from provider ID:', userData);

            if (!userData) {
                throw new Error('User data not found');
            }

            await this.updateLastLogin(userData.user_id, 'email', session.userId);
            console.log('Last login updated, returning user data with user_id:', userData.user_id);
            
            return { ...session, ...userData };
        } catch (error) {
            console.error('Login failed:', error);
            throw new Error(`Login failed: ${error.message}`);
        }
    },

    // Logout user
    async logout() {
        try {
            await account.deleteSession('current');
        } catch (error) {
            console.error('Logout failed:', error);
            throw new Error(`Logout failed: ${error.message}`);
        }
    },

    // Update last login
    async updateLastLogin(userId, provider, providerUserId) {
        try {
            const credentials = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.AUTH_CREDENTIALS,
                [
                    Query.equal('user_id', userId),
                    Query.equal('provider', provider),
                    Query.equal('provider_user_id', providerUserId),
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
            // Non-critical error, don't throw
        }
    },

    // Save calculation
    async saveCalculation(userId, calculationType, input, result) {
        try {
            console.log('saveCalculation called with userId:', userId, typeof userId);
            
            if (!userId || !calculationType || !input || result === undefined) {
                throw new Error('Missing required fields for calculation');
            }
            
            // Use the helper method to ensure userId is an integer
            const userIdInt = this.ensureIntegerId(userId);
            console.log('userId after conversion:', userIdInt, typeof userIdInt);
            
            const saveResult = await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.CALCULATIONS,
                ID.unique(),
                {
                    user_id: userIdInt,
                    type: calculationType,
                    input,
                    result,
                    timestamp: new Date().toISOString()
                }
            );
            
            console.log('Calculation saved successfully:', saveResult);
            return saveResult;
        } catch (error) {
            console.error('Error saving calculation:', error);
            throw new Error(`Failed to save calculation: ${error.message}`);
        }
    },

    // Get user calculations
    async getUserCalculations(userId) {
        try {
            console.log('getUserCalculations called with userId:', userId, typeof userId);
            
            // Use the helper method to ensure userId is an integer
            const userIdInt = this.ensureIntegerId(userId);
            console.log('userId after conversion:', userIdInt, typeof userIdInt);
            
            const calculations = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.CALCULATIONS,
                [
                    Query.equal('user_id', userIdInt),
                    Query.orderDesc('timestamp')
                ]
            );
            
            console.log('Retrieved calculations:', calculations.total);
            return calculations;
        } catch (error) {
            console.error('Error fetching calculations:', error);
            throw new Error(`Failed to fetch calculations: ${error.message}`);
        }
    },

    // Get user by provider ID
    async getUserByProviderId(provider, providerUserId) {
        try {
            console.log('getUserByProviderId called with:', provider, providerUserId);
            
            if (!provider || !providerUserId) {
                throw new Error('Provider and provider user ID are required');
            }

            const credentials = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.AUTH_CREDENTIALS,
                [
                    Query.equal('provider', provider),
                    Query.equal('provider_user_id', providerUserId)
                ]
            );
            
            console.log('Credentials found:', credentials.total);

            if (credentials.total > 0) {
                const userId = credentials.documents[0].user_id;
                console.log('Found userId in credentials:', userId, typeof userId);
                
                const users = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTIONS.USERS,
                    [Query.equal('user_id', userId)]
                );
                
                console.log('Users found with this userId:', users.total);

                if (users.total > 0) {
                    console.log('Returning user document with user_id:', users.documents[0].user_id);
                    return users.documents[0];
                }
            }
            
            console.log('No user found with this provider ID');
            return null;
        } catch (error) {
            console.error('Error fetching user by provider ID:', error);
            throw new Error(`Failed to fetch user: ${error.message}`);
        }
    },

    // Execute an Appwrite Cloud Function
    async executeFunction(functionId, payload = {}) {
        try {
            if (!functionId) {
                throw new Error('Function ID is required');
            }

            return await functions.createExecution(
                functionId,
                JSON.stringify(payload)
            );
        } catch (error) {
            console.error(`Error executing function ${functionId}:`, error);
            throw new Error(`Function execution failed: ${error.message}`);
        }
    }
};

// Optional: Add event listeners for debugging
client.subscribe('*', response => {
    console.log('Appwrite event received:', response);
});