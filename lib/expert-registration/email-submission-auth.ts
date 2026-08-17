export const EXISTING_EMAIL_SIGN_UP_ERROR_CODE =
  'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL'

export const EMAIL_SUBMISSION_AUTH_ERROR =
  'We couldn\'t securely submit with those details. ' +
  'Check the email and password, or continue with Google.'

type AuthResponse = {
  error?: {
    code?: string | null
  } | null
}

export type EmailSubmissionAuthResult =
  | { authenticated: true; method: 'NEW_SIGN_UP' | 'EXISTING_PASSWORD' }
  | { authenticated: false }

export async function authenticateEmailSubmission({
  signUpWithEmail,
  authenticateExistingEmail,
}: {
  signUpWithEmail: () => Promise<AuthResponse>
  authenticateExistingEmail: () => Promise<AuthResponse>
}): Promise<EmailSubmissionAuthResult> {
  const signUpResult = await signUpWithEmail()

  if (!signUpResult.error) {
    return { authenticated: true, method: 'NEW_SIGN_UP' }
  }

  // The UI intentionally has one email action. When Better Auth confirms that the
  // identity already exists, authenticate it with the submitted password without
  // exposing a separate sign-in mode or disclosing the email's registration state.
  if (signUpResult.error.code !== EXISTING_EMAIL_SIGN_UP_ERROR_CODE) {
    return { authenticated: false }
  }

  const existingIdentityResult = await authenticateExistingEmail()
  if (existingIdentityResult.error) {
    return { authenticated: false }
  }

  return { authenticated: true, method: 'EXISTING_PASSWORD' }
}
