# Reels Sharing Platform

Our Reels Sharing Platform empowers users to engage in a multitude of actions with their content, ensuring seamless management and distribution. Users can effortlessly create, update, and delete reels according to their preferences. Additionally, the platform offers comprehensive query capabilities, enabling users to search for reels based on diverse criteria such as title, description, and creation date.


---

# Reels Sharing Platform

This Reels Sharing Platform allows users to manage and share reels effortlessly. It provides functionalities for creating, updating, and deleting reels, as well as sharing reels with users.

## Features

- **Create Reel**: Users can create new reels with a title and description.
- **Update Reel**: Existing reels can be updated with new title and description.
- **Delete Reel**: Reels can be deleted from the platform.
- **Share Reel with User**: Users can share reels with other users, allowing collaboration and content distribution.
- **User Management**: Users can be added, retrieved, and deleted from the platform.

## Usage

### Installation

Ensure you have Node.js installed on your machine.

1. Clone this repository:
   ```bash
   git clone <repository_url>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm start
   ```

### API Endpoints

#### Reels

- **Create Reel**: `POST /reels`
  - Body: `{ "title": "Reel Title", "description": "Reel Description" }`
  - Creates a new reel with the specified title and description.

- **Get Reel by ID**: `GET /reels/:id`
  - Retrieves the reel with the specified ID.

- **Get All Reels**: `GET /reels`
  - Retrieves all reels.

- **Update Reel**: `PUT /reels/:id`
  - Body: `{ "title": "New Title", "description": "New Description" }`
  - Updates the reel with the specified ID with the new title and description.

- **Delete Reel**: `DELETE /reels/:id`
  - Deletes the reel with the specified ID.

- **Share Reel with User**: `POST /reels/:reelId/share/:userId`
  - Shares the reel with the specified ID with the user with the specified ID.

#### Users

- **Add User**: `POST /users`
  - Body: `{ "username": "Username", "email": "user@example.com" }`
  - Adds a new user with the specified username and email.

- **Get User by ID**: `GET /users/:id`
  - Retrieves the user with the specified ID.

- **Get All Users**: `GET /users`
  - Retrieves all users.

- **Delete User**: `DELETE /users/:id`
  - Deletes the user with the specified ID.

## Technologies Used

- TypeScript
- Azle
- UUID

## Contributing

Contributions are welcome! Feel free to submit pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
