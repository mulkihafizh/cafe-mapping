import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
  // IMPORTANT: We use the service_role key to bypass RLS for user creation.
  // The client must NEVER have this key.

  // 1. Authenticate the request: Ensure the requester is an admin.
  const supabaseAuth = await serverSupabaseClient<Database>(event)
  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser()

  if (authError || !user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const { data: profile } = await supabaseAuth.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: Admin access required.' })
  }

  // 2. Read request body
  const body = await readBody(event)
  const { email, password, fullName, role = 'user' } = body

  if (!email || !password || !fullName) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  // 3. Init service role client
  const supabaseAdmin = await serverSupabaseServiceRole(event)

  // 4. Create the auth user
  const { data: newUser, error: createErrorMsg } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (createErrorMsg) {
    throw createError({ statusCode: 500, statusMessage: createErrorMsg.message })
  }

  // 5. Update the automatically created profile with specific details
  // (Assuming a trigger creates a blank profile on user signup, or we insert it manually if not)
  if (newUser.user) {
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        full_name: fullName,
        role: role
      })
      .eq('id', newUser.user.id)

    if (profileError) {
      throw createError({ statusCode: 500, statusMessage: `User created but profile update failed: ${profileError.message}` })
    }
  }

  return { success: true, user: newUser.user }
})
