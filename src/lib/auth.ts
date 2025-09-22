import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { pool } from './database';

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  fiscal_code?: string;
  birth_date?: string;
  gender?: string;
  birth_place?: string;
  unique_code: string;
  email_verified: boolean;
  is_active: boolean;
  is_founder: boolean;
  founder_since?: string;
  created_at: string;
}

export interface Session {
  id: number;
  user_id: number;
  session_token: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface EmailVerificationToken {
  id: number;
  user_id: number;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface AccountDeletionToken {
  id: number;
  user_id: number;
  token: string;
  expires_at: string;
  reason?: string;
  created_at: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Generate secure random token
export function generateSecureToken(): string {
  return crypto.randomUUID() + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
}

// Generate unique code for user
export function generateUniqueCode(): string {
  const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789'; // No O, 0 to avoid confusion
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create user
export async function createUser(userData: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  fiscal_code?: string;
  birth_date?: string;
  gender?: string;
  birth_place?: string;
}): Promise<User> {
  const passwordHash = await hashPassword(userData.password);
  const uniqueCode = generateUniqueCode();

  // Check if unique code already exists, regenerate if needed
  let codeExists = true;
  let finalCode = uniqueCode;
  while (codeExists) {
    const [rows] = await pool.execute(
      'SELECT id FROM users WHERE unique_code = ?',
      [finalCode]
    );
    if ((rows as any[]).length === 0) {
      codeExists = false;
    } else {
      finalCode = generateUniqueCode();
    }
  }

  const [result] = await pool.execute(`
    INSERT INTO users (
      email, password_hash, first_name, last_name,
      fiscal_code, birth_date, gender, birth_place, unique_code
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    userData.email,
    passwordHash,
    userData.first_name,
    userData.last_name,
    userData.fiscal_code || null,
    userData.birth_date || null,
    userData.gender || null,
    userData.birth_place || null,
    finalCode
  ]);

  const userId = (result as any).insertId;

  // Get the created user
  const [userRows] = await pool.execute(
    'SELECT id, email, first_name, last_name, fiscal_code, birth_date, gender, birth_place, unique_code, email_verified, is_active, is_founder, founder_since, created_at FROM users WHERE id = ?',
    [userId]
  );

  return (userRows as User[])[0];
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  const [rows] = await pool.execute(
    'SELECT id, email, first_name, last_name, fiscal_code, birth_date, gender, birth_place, unique_code, email_verified, is_active, is_founder, founder_since, created_at FROM users WHERE email = ? AND is_active = TRUE',
    [email]
  );

  const users = rows as User[];
  return users.length > 0 ? users[0] : null;
}

// Get user with password hash for login
export async function getUserWithPasswordByEmail(email: string): Promise<(User & { password_hash: string }) | null> {
  const [rows] = await pool.execute(
    'SELECT id, email, password_hash, first_name, last_name, fiscal_code, birth_date, gender, birth_place, unique_code, email_verified, is_active, is_founder, founder_since, created_at FROM users WHERE email = ? AND is_active = TRUE',
    [email]
  );

  const users = rows as (User & { password_hash: string })[];
  return users.length > 0 ? users[0] : null;
}

// Get user by ID
export async function getUserById(id: number): Promise<User | null> {
  const [rows] = await pool.execute(
    'SELECT id, email, first_name, last_name, fiscal_code, birth_date, gender, birth_place, unique_code, email_verified, is_active, is_founder, founder_since, created_at FROM users WHERE id = ? AND is_active = TRUE',
    [id]
  );

  const users = rows as User[];
  return users.length > 0 ? users[0] : null;
}

// Create session
export async function createSession(userId: number): Promise<Session> {
  const sessionToken = generateSecureToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

  const [result] = await pool.execute(`
    INSERT INTO sessions (user_id, session_token, expires_at)
    VALUES (?, ?, ?)
  `, [userId, sessionToken, expiresAt.toISOString()]);

  const sessionId = (result as any).insertId;

  // Get the created session
  const [sessionRows] = await pool.execute(
    'SELECT id, user_id, session_token, expires_at, created_at, updated_at FROM sessions WHERE id = ?',
    [sessionId]
  );

  return (sessionRows as Session[])[0];
}

// Get session by token
export async function getSessionByToken(token: string): Promise<(Session & { user: User }) | null> {
  const [rows] = await pool.execute(`
    SELECT
      s.id, s.user_id, s.session_token, s.expires_at, s.created_at, s.updated_at,
      u.id as user_id, u.email, u.first_name, u.last_name, u.fiscal_code,
      u.birth_date, u.gender, u.birth_place, u.unique_code, u.email_verified, u.is_active, u.is_founder, u.founder_since, u.created_at as user_created_at
    FROM sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.session_token = ? AND s.expires_at > datetime('now') AND u.is_active = TRUE
  `, [token]);

  const sessions = rows as any[];
  if (sessions.length === 0) return null;

  const session = sessions[0];
  return {
    id: session.id,
    user_id: session.user_id,
    session_token: session.session_token,
    expires_at: session.expires_at,
    created_at: session.created_at,
    updated_at: session.updated_at,
    user: {
      id: session.user_id,
      email: session.email,
      first_name: session.first_name,
      last_name: session.last_name,
      fiscal_code: session.fiscal_code,
      birth_date: session.birth_date,
      gender: session.gender,
      birth_place: session.birth_place,
      unique_code: session.unique_code,
      email_verified: session.email_verified,
      is_active: session.is_active,
      is_founder: session.is_founder,
      founder_since: session.founder_since,
      created_at: session.user_created_at,
    }
  };
}

// Delete session (logout)
export async function deleteSession(token: string): Promise<boolean> {
  const [result] = await pool.execute(
    'DELETE FROM sessions WHERE session_token = ?',
    [token]
  );

  return (result as any).affectedRows > 0;
}

// Clean expired sessions
export async function cleanExpiredSessions(): Promise<void> {
  await pool.execute(
    "DELETE FROM sessions WHERE expires_at < datetime('now')"
  );
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
export function isValidPassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('La password deve essere di almeno 8 caratteri');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('La password deve contenere almeno una lettera minuscola');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('La password deve contenere almeno una lettera maiuscola');
  }

  if (!/\d/.test(password)) {
    errors.push('La password deve contenere almeno un numero');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('La password deve contenere almeno un carattere speciale');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Email verification functions

// Create email verification token
export async function createEmailVerificationToken(userId: number): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours

  // Delete any existing tokens for this user
  await pool.execute(
    'DELETE FROM email_verification_tokens WHERE user_id = ?',
    [userId]
  );

  // Create new token
  await pool.execute(`
    INSERT INTO email_verification_tokens (user_id, token, expires_at)
    VALUES (?, ?, ?)
  `, [userId, token, expiresAt.toISOString()]);

  return token;
}

// Verify email token
export async function verifyEmailToken(token: string): Promise<{ valid: boolean; user?: User }> {
  const [rows] = await pool.execute(`
    SELECT
      evt.user_id,
      u.id, u.email, u.first_name, u.last_name, u.fiscal_code,
      u.birth_date, u.gender, u.birth_place, u.unique_code, u.email_verified, u.is_active, u.created_at
    FROM email_verification_tokens evt
    JOIN users u ON evt.user_id = u.id
    WHERE evt.token = ? AND evt.expires_at > datetime('now')
  `, [token]);

  const results = rows as any[];
  if (results.length === 0) {
    return { valid: false };
  }

  const result = results[0];
  const user: User = {
    id: result.id,
    email: result.email,
    first_name: result.first_name,
    last_name: result.last_name,
    fiscal_code: result.fiscal_code,
    birth_date: result.birth_date,
    gender: result.gender,
    birth_place: result.birth_place,
    unique_code: result.unique_code,
    email_verified: result.email_verified,
    is_active: result.is_active,
    is_founder: false,
    created_at: result.created_at,
  };

  return { valid: true, user };
}

// Mark email as verified and delete token
export async function confirmEmailVerification(token: string): Promise<boolean> {
  const verification = await verifyEmailToken(token);

  if (!verification.valid || !verification.user) {
    return false;
  }

  // Start transaction
  try {
    await pool.execute('BEGIN');

    // Update user email_verified status
    await pool.execute(
      'UPDATE users SET email_verified = TRUE WHERE id = ?',
      [verification.user.id]
    );

    // Delete the verification token
    await pool.execute(
      'DELETE FROM email_verification_tokens WHERE token = ?',
      [token]
    );

    await pool.execute('COMMIT');
    return true;
  } catch (error) {
    await pool.execute('ROLLBACK');
    console.error('Error confirming email verification:', error);
    return false;
  }
}

// Clean expired email verification tokens
export async function cleanExpiredEmailTokens(): Promise<void> {
  await pool.execute(
    "DELETE FROM email_verification_tokens WHERE expires_at < datetime('now')"
  );
}

// Get user by verification token
export async function getUserByVerificationToken(token: string): Promise<User | null> {
  const verification = await verifyEmailToken(token);
  return verification.valid && verification.user ? verification.user : null;
}

// Account deletion functions

// Request account deletion (creates token and sends email)
export async function requestAccountDeletion(userId: number, reason?: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 2); // Token expires in 2 hours

  // Delete any existing tokens for this user
  await pool.execute(
    'DELETE FROM account_deletion_tokens WHERE user_id = ?',
    [userId]
  );

  // Create new deletion token
  await pool.execute(`
    INSERT INTO account_deletion_tokens (user_id, token, expires_at, reason)
    VALUES (?, ?, ?, ?)
  `, [userId, token, expiresAt.toISOString(), reason || null]);

  // Mark user as deletion requested
  await pool.execute(
    'UPDATE users SET deletion_requested_at = CURRENT_TIMESTAMP, deletion_reason = ? WHERE id = ?',
    [reason || null, userId]
  );

  return token;
}

// Verify deletion token
export async function verifyDeletionToken(token: string): Promise<{ valid: boolean; user?: User }> {
  const [rows] = await pool.execute(`
    SELECT
      adt.user_id,
      u.id, u.email, u.first_name, u.last_name, u.fiscal_code,
      u.birth_date, u.gender, u.birth_place, u.unique_code, u.email_verified, u.is_active, u.created_at,
      u.deletion_requested_at, u.deletion_reason
    FROM account_deletion_tokens adt
    JOIN users u ON adt.user_id = u.id
    WHERE adt.token = ? AND adt.expires_at > datetime('now') AND u.is_active = TRUE
  `, [token]);

  const results = rows as any[];
  if (results.length === 0) {
    return { valid: false };
  }

  const result = results[0];
  const user: User = {
    id: result.id,
    email: result.email,
    first_name: result.first_name,
    last_name: result.last_name,
    fiscal_code: result.fiscal_code,
    birth_date: result.birth_date,
    gender: result.gender,
    birth_place: result.birth_place,
    unique_code: result.unique_code,
    email_verified: result.email_verified,
    is_active: result.is_active,
    is_founder: false,
    created_at: result.created_at,
  };

  return { valid: true, user };
}

// Confirm account deletion (soft delete)
export async function confirmAccountDeletion(token: string): Promise<boolean> {
  const verification = await verifyDeletionToken(token);

  if (!verification.valid || !verification.user) {
    return false;
  }

  try {
    await pool.execute('BEGIN');

    // Soft delete: deactivate user and mark deletion confirmed
    await pool.execute(`
      UPDATE users SET
        is_active = FALSE,
        deletion_confirmed_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP,
        email = 'deleted_' || id || '_' || email,
        fiscal_code = CASE
          WHEN fiscal_code IS NOT NULL
          THEN 'deleted_' || id || '_' || fiscal_code
          ELSE NULL
        END
      WHERE id = ?
    `, [verification.user.id]);

    // Delete all sessions for this user
    await pool.execute(
      'DELETE FROM sessions WHERE user_id = ?',
      [verification.user.id]
    );

    // Delete all verification tokens
    await pool.execute(
      'DELETE FROM email_verification_tokens WHERE user_id = ?',
      [verification.user.id]
    );

    // Delete the deletion token
    await pool.execute(
      'DELETE FROM account_deletion_tokens WHERE token = ?',
      [token]
    );

    // Keep subscriptions for billing history but mark as cancelled
    await pool.execute(`
      UPDATE subscriptions SET
        status = 'cancelled',
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ? AND status != 'cancelled'
    `, [verification.user.id]);

    await pool.execute('COMMIT');
    return true;
  } catch (error) {
    await pool.execute('ROLLBACK');
    console.error('Error confirming account deletion:', error);
    return false;
  }
}

// Cancel deletion request
export async function cancelAccountDeletion(userId: number): Promise<boolean> {
  try {
    await pool.execute('BEGIN');

    // Clear deletion request
    await pool.execute(`
      UPDATE users SET
        deletion_requested_at = NULL,
        deletion_reason = NULL,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND deletion_confirmed_at IS NULL
    `, [userId]);

    // Delete deletion tokens
    await pool.execute(
      'DELETE FROM account_deletion_tokens WHERE user_id = ?',
      [userId]
    );

    await pool.execute('COMMIT');
    return true;
  } catch (error) {
    await pool.execute('ROLLBACK');
    console.error('Error cancelling account deletion:', error);
    return false;
  }
}

// Clean expired deletion tokens
export async function cleanExpiredDeletionTokens(): Promise<void> {
  await pool.execute(
    "DELETE FROM account_deletion_tokens WHERE expires_at < datetime('now')"
  );
}

// Get users pending deletion (for cleanup job)
export async function getUsersPendingDeletion(): Promise<User[]> {
  const [rows] = await pool.execute(`
    SELECT id, email, first_name, last_name, fiscal_code, birth_date, gender, birth_place,
           unique_code, email_verified, is_active, is_founder, founder_since, created_at, deletion_requested_at
    FROM users
    WHERE deletion_requested_at IS NOT NULL
      AND deletion_confirmed_at IS NULL
      AND deletion_requested_at < datetime('now', '-7 days')
    ORDER BY deletion_requested_at ASC
  `);

  return rows as User[];
}

// Badge fondatore functions

// Set user as founder
export async function setUserAsFounder(userId: number): Promise<boolean> {
  try {
    const [result] = await pool.execute(`
      UPDATE users SET
        is_founder = TRUE,
        founder_since = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND is_active = TRUE
    `, [userId]);

    return (result as any).affectedRows > 0;
  } catch (error) {
    console.error('Error setting user as founder:', error);
    return false;
  }
}

// Remove founder status
export async function removeFounderStatus(userId: number): Promise<boolean> {
  try {
    const [result] = await pool.execute(`
      UPDATE users SET
        is_founder = FALSE,
        founder_since = NULL,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND is_active = TRUE
    `, [userId]);

    return (result as any).affectedRows > 0;
  } catch (error) {
    console.error('Error removing founder status:', error);
    return false;
  }
}

// Helper function to verify session from request
export async function verifySession(request: any): Promise<User | null> {
  try {
    const sessionToken = request.cookies.get('session_token')?.value;

    if (!sessionToken) {
      return null;
    }

    // Get session and user
    const sessionWithUser = await getSessionByToken(sessionToken);
    if (!sessionWithUser) {
      return null;
    }

    return sessionWithUser.user;
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}