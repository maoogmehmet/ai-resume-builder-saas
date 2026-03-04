import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function sendWelcomeEmail(toEmail: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: toEmail,
            subject: 'Welcome to Novatypalcv! 🚀',
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Novatypalcv!</h2>
          <p>We are thrilled to have you here.</p>
          <p>Get started by importing your LinkedIn profile and letting our AI optimize your resume for your next dream job!</p>
          <p>Your 7-day free trial has started. Build unlimited ATS-optimized resumes today.</p>
          <br/>
          <p>Best regards,<br/>The Novatypalcv Team</p>
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

export async function sendFeedbackEmail(userEmail: string, message: string, type: string) {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@cvbuilder.com'; // Fallback admin email
        const { data, error } = await resend.emails.send({
            from: 'feedback@resend.dev',
            to: adminEmail,
            subject: `[Feedback - ${type}] from ${userEmail}`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Feedback Received</h2>
          <p><strong>From:</strong> ${userEmail}</p>
          <p><strong>Type:</strong> ${type}</p>
          <hr/>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
        });

        if (error) {
            console.error('Error sending feedback email:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Failed to send feedback email:', err);
        return { success: false, error: err };
    }
}
