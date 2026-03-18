import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://blvfddeigrblxiacdvmq.supabase.co'
const supabaseKey = 'sb_publishable_q77QdvvFtCx4zMuixw0ZQQ_SRn30A8D'

export const supabase = createClient(supabaseUrl, supabaseKey)