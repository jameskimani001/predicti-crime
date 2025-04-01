
# Crime Reporting System

## Project Overview

This is a comprehensive crime reporting and management system designed for Kenya. It allows citizens to report crimes and enables law enforcement to track, manage, and analyze crime data effectively.



## Key Features

- **Public Crime Reporting**: Citizens can submit crime reports with detailed information including location, time, description, and witness details.
- **Data Persistence**: All submitted crime reports are stored locally and persist across page refreshes.
- **Real-time Notifications**: Administrators and police receive immediate notifications when new crimes are reported.
- **Crime Management**: Full CRUD operations for managing crime reports with status tracking (open, investigating, resolved).
- **Analytics Dashboard**: Visual representation of crime statistics, trends, and patterns.
- **Crime Hotspots**: Interactive map showing areas with high crime rates.
- **Export Functionality**: Export crime reports to CSV for offline analysis.
- **User Management**: Administrative tools for managing users and access control.
- **Mobile Responsive**: Fully responsive design that works across all devices.

## Technologies Used

This project is built with modern web technologies:

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Build Tool**: Vite
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Form Handling**: React Hook Form with Zod validation
- **Local Storage**: Browser's localStorage for data persistence

### Local Development

If you want to work locally:

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start the development server
npm run dev
```

## Project Structure

- `/src/pages`: Main application pages
- `/src/components`: Reusable UI components
- `/src/contexts`: Application state management
- `/src/hooks`: Custom React hooks
- `/src/lib`: Utility functions and configurations

## Deployment
Deploying on Netlify
To deploy your website on Netlify, follow these steps:

1. Sign Up/Login to Netlify
Go to Netlify and create an account or log in using your GitHub, GitLab, or Bitbucket account.

2. Prepare Your Website
Make sure your website files (HTML, CSS, JavaScript, etc.) are ready. If you're using a build tool or framework (like React or Next.js), run the build process to generate production-ready files.

3. Connect Your Git Repository (Optional)
In the Netlify dashboard, click "New Site from Git", choose your Git provider (GitHub, GitLab, or Bitbucket), and select your repository.

4. Configure Build Settings
For most static websites, Netlify automatically detects the build settings. If needed, specify the build command (e.g., npm run build) and the directory to publish (e.g., build or dist).

5. Deploy Your Site
Click "Deploy Site", and Netlify will start the deployment process. Once finished, you'll receive a live URL like https://your-site-name.netlify.app.

6. Add a Custom Domain (Optional)
If you have a custom domain, you can add it in Site Settings > Domain Management and update your DNS records accordingly.

Your website is now live on Netlify!

## Future Enhancements

- **SMS Notifications**: Send SMS alerts to users and law enforcement
- **Evidence Upload**: Allow uploading of photos and videos as evidence
- **AI-Powered Analysis**: Implement machine learning for crime prediction
- **Multi-language Support**: Add Swahili and other local language options
- **Emergency Response**: Integration with emergency services
- **Community Watch**: Neighborhood alert system
- **Cloud Database Integration**: Move from localStorage to a persistent cloud database

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Well crafted with love, passion, and a touch of code magic. ✨💻
