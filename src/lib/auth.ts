// lib/auth.ts
import { db } from "./firebase";
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, query, where, Timestamp } from 'firebase/firestore';
import { AdminUser } from '@/types/AdminUser';
import { AdminSession } from '@/types/AdminSession';

const ADMIN_USERS_COLLECTION = 'admin_users';
const ADMIN_SESSIONS_COLLECTION = 'admin_sessions';
const SESSION_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

// Create admin user (run this once to create your admin user)
export const createAdminUser = async (username: string, password: string): Promise<void> => {
    const adminUser: Omit<AdminUser, 'id'> = {
        username,
        password, // In production, hash this password
        createdAt: new Date(),
    };

    const docRef = doc(collection(db, ADMIN_USERS_COLLECTION));
    await setDoc(docRef, {
        ...adminUser,
        createdAt: Timestamp.fromDate(adminUser.createdAt),
    });
};

// Authenticate user
export const authenticateAdmin = async (username: string, password: string): Promise<AdminSession | null> => {
    try {
        // Find user by username
        const usersRef = collection(db, ADMIN_USERS_COLLECTION);
        const q = query(usersRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data() as Omit<AdminUser, 'id'>;

        // Check password (in production, compare with hashed password)
        if (userData.password !== password) {
            return null;
        }

        // Create session
        const now = new Date();
        const expiresAt = new Date(now.getTime() + SESSION_DURATION);

        const session: Omit<AdminSession, 'id'> = {
            userId: userDoc.id,
            username: userData.username,
            createdAt: now,
            expiresAt,
            lastActivity: now,
        };

        const sessionRef = doc(collection(db, ADMIN_SESSIONS_COLLECTION));
        await setDoc(sessionRef, {
            ...session,
            createdAt: Timestamp.fromDate(session.createdAt),
            expiresAt: Timestamp.fromDate(session.expiresAt),
            lastActivity: Timestamp.fromDate(session.lastActivity),
        });

        return {
            ...session,
            id: sessionRef.id,
        };
    } catch (error) {
        console.error('Authentication error:', error);
        return null;
    }
};

// Verify session and update activity
export const verifySession = async (sessionId: string): Promise<AdminSession | null> => {
    try {
        const sessionRef = doc(db, ADMIN_SESSIONS_COLLECTION, sessionId);
        const sessionSnap = await getDoc(sessionRef);

        if (!sessionSnap.exists()) {
            return null;
        }

        const sessionData = sessionSnap.data();
        const session: AdminSession = {
            id: sessionSnap.id,
            userId: sessionData.userId,
            username: sessionData.username,
            createdAt: sessionData.createdAt.toDate(),
            expiresAt: sessionData.expiresAt.toDate(),
            lastActivity: sessionData.lastActivity.toDate(),
        };

        const now = new Date();

        // Check if session is expired
        if (now > session.expiresAt) {
            await deleteDoc(sessionRef);
            return null;
        }

        // Update last activity and extend expiration
        const newExpiresAt = new Date(now.getTime() + SESSION_DURATION);
        await setDoc(sessionRef, {
            ...sessionData,
            lastActivity: Timestamp.fromDate(now),
            expiresAt: Timestamp.fromDate(newExpiresAt),
        }, { merge: true });

        return {
            ...session,
            lastActivity: now,
            expiresAt: newExpiresAt,
        };
    } catch (error) {
        console.error('Session verification error:', error);
        return null;
    }
};

// Logout (delete session)
export const logout = async (sessionId: string): Promise<void> => {
    try {
        const sessionRef = doc(db, ADMIN_SESSIONS_COLLECTION, sessionId);
        await deleteDoc(sessionRef);
    } catch (error) {
        console.error('Logout error:', error);
    }
};

// Clean up expired sessions (optional - can be run periodically)
export const cleanupExpiredSessions = async (): Promise<void> => {
    try {
        const sessionsRef = collection(db, ADMIN_SESSIONS_COLLECTION);
        const snapshot = await getDocs(sessionsRef);

        const now = new Date();
        const expiredSessions: string[] = [];

        snapshot.forEach((doc) => {
            const data = doc.data();
            const expiresAt = data.expiresAt.toDate();

            if (now > expiresAt) {
                expiredSessions.push(doc.id);
            }
        });

        // Delete expired sessions
        for (const sessionId of expiredSessions) {
            await deleteDoc(doc(db, ADMIN_SESSIONS_COLLECTION, sessionId));
        }
    } catch (error) {
        console.error('Cleanup error:', error);
    }
};