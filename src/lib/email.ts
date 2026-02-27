import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function sendWelcomeEmail(toEmail: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: toEmail,
            subject: 'Welcome to AI Resume Builder! 🚀',
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to AI Resume Builder!</h2>
          <p>We are thrilled to have you here.</p>
          <p>Get started by importing your LinkedIn profile and letting our AI optimize your resume for your next dream job!</p>
          <p>Your 7-day free trial has started. Build unlimited ATS-optimized resumes today.</p>
          <br/>
          <p>Best regards,<br/>The AI Resume Builder Team</p>
        </div>
      `,
        });

        if (error) {
            console.error('Error sending welcome email:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Failed to send email:', err);
        return { success: false, error: err };
    }
}
