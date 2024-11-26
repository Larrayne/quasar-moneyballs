# Quasar-Journal (quasar-jOURNAL)

 ### ✨ Quasar Journal App
This project is a journal application built using the Quasar Framework. It enables users to manage journal entries, customize their settings, and interact with AI features. The app uses Firebase for authentication, Firestore for database management, and includes various customization and interactive functionalities.

## Clone the repository:
```
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).



 ## 🔥 Features
### Implemented
- ####  ✅ User Authentication:
Register, login, logout, and password reset using [Firebase Authentication](https://firebase.google.com/docs/auth)
-   #### User Dashboard:
Overview of journal entries and quick access to other features.
-   #### 📝 Journal Entries:
Add, view, and manage journal entries.
-  #### 🎨 Settings:
 - Change **display name**.
 - Customize **theme, font size, font style, and journal view**.
 - Upload **profile pictures** and see them reflected in the toolbar.
-   #### 🤖 AI Chat Feature:
Integrated conversational AI to assist users with journaling.
- #### User Management:
Restricts access to **Entries** and **Settings** pages unless logged in.
- #### Persistent State:
User preferences **(theme, font settings)** are saved and applied throughout the app.


#### Configure Firebase:
Add your Firebase configuration in the appropriate environment file.
Ensure Firestore rules are set up to restrict unauthorized access.


 ### 🐛 Known Issues and Limitations
Not Working Yet
#### 🚧  Theme and Font Customizations:
Theme and font settings in the **Settings page** do not apply as expected across the app.
#### AI Chat Feature:
The integration with **AI** is incomplete and may not respond as intended.
#### Profile Picture Upload:
The image upload functionality is partially implemented but may not reflect changes properly in real-time.

### Problems in the Project
 #### ❗ Authentication Issue:
Different users logging in see the same data, indicating a problem with **session management** or **Firestore query filtering**.
 #### 🛠️ State Management:
Some settings, such as **journal view preferences**, do not persist between sessions.
 #### ⚠️ UI/UX Improvements:
The **side drawer** does not toggle correctly in certain views.
The **logout button** behavior could be more intuitive.
#### Error Handling:
Insufficient error messages for failed **API calls** or invalid **form submissions**.

 #### 🗒️ To-Do List
- [ ] Fix **Firestore queries** to correctly isolate user-specific data.
- [ ] Debug and finalize the **theme, font size, and font style settings**.
- [ ] Implement **real-time updates** for the profile picture across all components.
- [ ] Complete and refine the **AI chat feature**.
- [ ] Enhance **error handling** and **user feedback mechanisms**.

### How to Contribute
Contributions are welcome! Please follow these steps to contribute:
**Fork** the repository.
Create a **new branch** for your feature or bug fix.
Submit a **pull request** with a clear explanation of the changes.

 #### 📜 License
This project is licensed under the [MIT License](https://opensource.org/license/mit).

#### 📬 Contact
If you have any questions or suggestions, feel free to reach out at:
📧 lorrainerangolo@gmail.com




