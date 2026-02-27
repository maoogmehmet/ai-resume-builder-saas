
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function createTestUser() {
    const email = 'testuser@example.com'
    const password = 'password123'

    console.log(`Attempting to create/get user: ${email}`)

    // Try to create user
    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    })

    if (error) {
        if (error.message.includes('already exists')) {
            console.log('User already exists, updating password...')
            const { data: users, error: listError } = await supabase.auth.admin.listUsers()
            const user = users?.users.find(u => u.email === email)
            if (user) {
                await supabase.auth.admin.updateUserById(user.id, { password })
                console.log('Password updated successfully')
            }
        } else {
            console.error('Error creating user:', error.message)
            return
        }
    } else {
        console.log('User created successfully:', data.user?.id)
    }
}

createTestUser()
