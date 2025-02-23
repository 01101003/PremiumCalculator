// src/config/appwrite.js
import { Client, Account, Databases, ID, Functions, Query } from 'appwrite';

// Load environment variables for security (recommended for Vercel)
const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

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
    // Create authentication credentials
async createAuthCredentials(userId, provider, providerUserId) {
    try {
        if (!userId || !provider || !providerUserId) {
            throw new Error('Missing required fields for auth credentials');
        }

        return await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.AUTH_CREDENTIALS,
            ID.unique(), // Generate new unique ID for the document
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

// Create new user document
async createUserDocument(userId, email, name, profileImage = null) {
    try {
        if (!userId || !email || !name) {
            throw new Error('Missing required fields for user document creation');
        }

        return await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.USERS,
            ID.unique(), // Generate new unique ID for the document
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

    // Create new user account with rollback on failure
// Create new user account with rollback on failure
async createEmailAccount(email, password, name) {
    let appwriteUser = null;
    let userId = null;
    let createdDocuments = [];

    try {
        // First generate sequential user ID for our custom users collection
        userId = await this.generateUserId();
        
        // Create the Appwrite account using the email method
        appwriteUser = await account.createEmailSession(email, password);
        
        // Create the user document
        const userDoc = await this.createUserDocument(userId, email, name);
        createdDocuments.push({
            collection: COLLECTIONS.USERS,
            id: userDoc.$id
        });

        // Create auth credentials using the session ID
        const authDoc = await this.createAuthCredentials(userId, 'email', appwriteUser.$id);
        createdDocuments.push({
            collection: COLLECTIONS.AUTH_CREDENTIALS,
            id: authDoc.$id
        });

        const userData = await this.getUserByProviderId('email', appwriteUser.$id);

        return { ...appwriteUser, ...userData };
    } catch (error) {
        console.error('Error creating email account:', error);
        
        // Cleanup on failure
        try {
            if (appwriteUser && appwriteUser.$id) {
                await account.deleteSessions(); // Delete all sessions
            }
            
            // Delete any created documents
            for (const doc of createdDocuments) {
                try {
                    await databases.deleteDocument(
                        DATABASE_ID,
                        doc.collection,
                        doc.id
                    );
                } catch (deleteError) {
                    console.error(`Failed to delete document: ${deleteError.message}`);
                }
            }
        } catch (cleanupError) {
            console.error('Failed to clean up after account creation error:', cleanupError);
        }
        
        throw new Error(`Account creation failed: ${error.message}`);
    }
},

// Also update the login function
async login(email, password) {
    try {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        const session = await account.createSession(email, password);
        const userData = await this.getUserByProviderId('email', session.userId);

        if (!userData) {
            throw new Error('User data not found');
        }

        await this.updateLastLogin(userData.user_id, 'email', session.userId);
        return { ...session, ...userData };
    } catch (error) {
        console.error('Login failed:', error);
        throw new Error(`Login failed: ${error.message}`);
    }
},

    // Login with email
    async login(email, password) {
        try {
            if (!email || !password) {
                throw new Error('Email and password are required');
            }

            const session = await account.createEmailSession(email, password);
            const userData = await this.getUserByProviderId('email', session.userId);

            if (!userData) {
                throw new Error('User data not found');
            }

            await this.updateLastLogin(userData.user_id, 'email', session.userId);
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
            if (!userId || !calculationType || !input || result === undefined) {
                throw new Error('Missing required fields for calculation');
            }

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
            throw new Error(`Failed to save calculation: ${error.message}`);
        }
    },

    // Get user calculations
    async getUserCalculations(userId) {
        try {
            if (!userId) {
                throw new Error('User ID is required');
            }

            return await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.CALCULATIONS,
                [
                    Query.equal('user_id', userId),
                    Query.orderDesc('timestamp')
                ]
            );
        } catch (error) {
            console.error('Error fetching calculations:', error);
            throw new Error(`Failed to fetch calculations: ${error.message}`);
        }
    },

    // Get user by provider ID
    async getUserByProviderId(provider, providerUserId) {
        try {
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

            if (credentials.total > 0) {
                const userId = credentials.documents[0].user_id;
                const users = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTIONS.USERS,
                    [Query.equal('user_id', userId)]
                );

                if (users.total > 0) {
                    return users.documents[0];
                }
            }

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