import { createAdminUser } from '@/lib/auth';

async function setupAdminUser() {
  try {
    // Change these credentials to your desired admin credentials
    const username = 'admin_user_devansh';
    const password = 'devansh123';
    
    await createAdminUser(username, password);
    console.log('Admin user created successfully!');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log('\nIMPORTANT: Change these credentials in a production environment!');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Run the setup
setupAdminUser();