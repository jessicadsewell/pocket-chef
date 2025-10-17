/**
 * Supabase Service - Handles Auth, Storage, and Realtime
 */

import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.warn(
        'Supabase URL or Key not configured. Supabase features will be disabled.',
      );
      return;
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase SDK initialized');
  }

  getClient(): SupabaseClient {
    if (!this.supabase) {
      throw new Error('Supabase client not initialized');
    }
    return this.supabase;
  }

  // ==================== AUTH ====================

  /**
   * Sign up a new user
   */
  async signUp(email: string, password: string, metadata?: any) {
    return await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  /**
   * Sign out current user
   */
  async signOut() {
    return await this.supabase.auth.signOut();
  }

  /**
   * Get current user from token
   */
  async getUser(accessToken: string) {
    return await this.supabase.auth.getUser(accessToken);
  }

  /**
   * Reset password
   */
  async resetPassword(email: string) {
    return await this.supabase.auth.resetPasswordForEmail(email);
  }

  // ==================== STORAGE ====================

  /**
   * Upload a file to storage
   */
  async uploadFile(
    bucket: string,
    path: string,
    file: Buffer | File,
    options?: {
      contentType?: string;
      cacheControl?: string;
      upsert?: boolean;
    },
  ) {
    return await this.supabase.storage.from(bucket).upload(path, file, options);
  }

  /**
   * Get public URL for a file
   */
  getPublicUrl(bucket: string, path: string): string {
    const { data } = this.supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  /**
   * Delete a file from storage
   */
  async deleteFile(bucket: string, path: string) {
    return await this.supabase.storage.from(bucket).remove([path]);
  }

  /**
   * List files in a bucket
   */
  async listFiles(bucket: string, path?: string) {
    return await this.supabase.storage.from(bucket).list(path);
  }

  /**
   * Create a storage bucket
   */
  async createBucket(
    name: string,
    options: { public: boolean; fileSizeLimit?: number } = { public: false },
  ) {
    return await this.supabase.storage.createBucket(name, options);
  }

  // ==================== REALTIME ====================

  /**
   * Subscribe to database changes
   */
  subscribeToTable(
    table: string,
    callback: (payload: any) => void,
    event: 'INSERT' | 'UPDATE' | 'DELETE' | '*' = '*',
  ) {
    return this.supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes' as any,
        { event, schema: 'public', table },
        (payload: any) => {
          callback(payload);
        },
      )
      .subscribe();
  }

  /**
   * Subscribe to a specific row
   */
  subscribeToRow(
    table: string,
    column: string,
    value: any,
    callback: (payload: any) => void,
  ) {
    return this.supabase
      .channel(`${table}-${value}`)
      .on(
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table,
          filter: `${column}=eq.${value}`,
        },
        (payload: any) => {
          callback(payload);
        },
      )
      .subscribe();
  }

  /**
   * Unsubscribe from a channel
   */
  async unsubscribe(channel: any) {
    return await this.supabase.removeChannel(channel);
  }

  // ==================== DATABASE (Optional - if you want to use Supabase queries) ====================

  /**
   * Query database using Supabase (alternative to TypeORM)
   * Note: Use TypeORM for complex queries, this is for simple operations
   */
  from(table: string) {
    return this.supabase.from(table);
  }
}
