import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://blvfddeigrblxiacdvmq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsdmZkZGVpZ3JibHhpYWNkdm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4Mjk2ODMsImV4cCI6MjA4OTQwNTY4M30.uFy4QEYST9t49uXCsvtJLqNpcLuk1m1vlr7rSXPivCU';

export const supabase = createClient(supabaseUrl, supabaseKey);
