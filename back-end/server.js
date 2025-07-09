import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import pg from "pg";
import jwt from "jsonwebtoken";
import env from "dotenv";

const app = express();
const port = 4000;
env.config();

const JWT_SECRET = process.env.JWT_SECRET;

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token missing" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = user;
    next();
  });
}

app.post("/register", async (req, res) => {
  const { username, email, photo_url, password } = req.body;

  try {
    const checkResult = await db.query("select * from users where email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      return res.status(401).json({
        message: "You already registered with this email, try to login",
      });
    }

    await db.query(
      "insert into users (username, email, password, photo_url) values ($1, $2, $3, $4)",
      [username, email, password, photo_url]
    );
    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering user" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in" });
  }
});

app.use(authenticateToken);

app.get("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const searchTerm = req.query.q;

  try {
    let query;
    let values;

    if (searchTerm) {
      // Show all matching users + their latest message (if exists)
      query = `
        SELECT DISTINCT ON (u.id)
          u.id,
          u.username,
          u.photo_url,
          m.sender_id,
          m.content AS last_message,
          m.timestamp AS last_timestamp
        FROM users u
        LEFT JOIN messages m
          ON (
            (u.id = m.sender_id AND m.receiver_id = $1)
            OR (u.id = m.receiver_id AND m.sender_id = $1)
          )
        WHERE u.username ILIKE $2
        ORDER BY u.id, m.timestamp DESC
      `;
      values = [userId, `%${searchTerm}%`];
    } else {
      // Show only users the current user has chatted with
      query = `
        SELECT DISTINCT ON (u.id)
          u.id,
          u.username,
          u.photo_url,
          m.sender_id,
          m.content AS last_message,
          m.timestamp AS last_timestamp
        FROM users u
        JOIN messages m
          ON (
            (u.id = m.sender_id AND m.receiver_id = $1)
            OR (u.id = m.receiver_id AND m.sender_id = $1)
          )
        ORDER BY u.id, m.timestamp DESC
      `;
      values = [userId];
    }

    const result = await db.query(query, values);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

app.get("/user/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await db.query(
      "select id, username, photo_url, email from users where id=$1",
      [id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching a user" });
  }
});

app.put("/user/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email, photo_url } = req.body;

  try {
    await db.query(
      "UPDATE users SET username = $1, email = $2, photo_url = $3 WHERE id = $4",
      [username, email, photo_url, id]
    );

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database update failed" });
  }
});

app.delete("/user/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("BEGIN");

    await db.query("delete from friends where user_id = $1 or friend_id = $1", [
      id,
    ]);
    await db.query(
      "delete from friend_requests where sender_id = $1 or receiver_id = $1",
      [id]
    );
    await db.query(
      "delete from messages where sender_id = $1 or receiver_id = $1",
      [id]
    );
    await db.query("delete from users where id = $1", [id]);

    await db.query("COMMIT");

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Deleting user failed" });
  }
});

app.post("/messages", async (req, res) => {
  const { sender_id, receiver_id } = req.body;

  try {
    const result = await db.query(
      `
      SELECT * FROM messages
      WHERE (sender_id = $1 AND receiver_id = $2)
         OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY timestamp ASC
      `,
      [sender_id, receiver_id]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching messages" });
  }
});

app.post("/send", async (req, res) => {
  const { sender_id, receiver_id, content } = req.body;

  try {
    await db.query(
      `INSERT INTO messages (sender_id, receiver_id, content, timestamp)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
      [sender_id, receiver_id, content]
    );

    res.status(201).json({ message: "Message sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending message" });
  }
});

app.get("/friend-requests/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await db.query(
      `SELECT u.id, u.username, u.photo_url, fr.created_at, fr.id as request_id
       FROM friend_requests fr
       JOIN users u ON fr.sender_id = u.id
       WHERE fr.receiver_id = $1 AND fr.status = 'pending'`,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/friend-request", async (req, res) => {
  const { senderId, receiverUsername } = req.body;

  try {
    // 1. Get receiver ID from username
    const receiverResult = await db.query(
      `SELECT id FROM users WHERE username = $1`,
      [receiverUsername]
    );

    if (receiverResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const receiverId = receiverResult.rows[0].id;

    // 2. Prevent self-request
    if (senderId === receiverId) {
      return res.status(400).json({ message: "You can't add yourself." });
    }

    // 3. Check for existing request
    const existing = await db.query(
      `SELECT * FROM friend_requests 
       WHERE sender_id = $1 AND receiver_id = $2 AND status = 'pending'`,
      [senderId, receiverId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Request already sent." });
    }

    // 4. Insert friend request
    await db.query(
      `INSERT INTO friend_requests (sender_id, receiver_id) VALUES ($1, $2)`,
      [senderId, receiverId]
    );

    res.status(201).json({ message: "Friend request sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/friend-request/accept", async (req, res) => {
  const { requestId } = req.body;

  try {
    // Step 1: Mark the friend request as accepted
    const result = await db.query(
      `UPDATE friend_requests
       SET status = 'accepted', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING sender_id, receiver_id`,
      [requestId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Request not found." });
    }

    const { sender_id, receiver_id } = result.rows[0];

    // Step 2: Add the friendship in both directions
    await db.query(
      `INSERT INTO friends (user_id, friend_id)
       VALUES ($1, $2), ($2, $1)
       ON CONFLICT DO NOTHING`, // optional: avoids duplicates if constraint exists
      [sender_id, receiver_id]
    );

    res
      .status(200)
      .json({ message: "Friend request accepted and users are now friends." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/friend-request/reject", async (req, res) => {
  const { requestId } = req.body;

  try {
    const result = await db.query(
      `UPDATE friend_requests
       SET status = 'rejected', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 RETURNING *`,
      [requestId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Request not found." });
    }

    res.status(200).json({ message: "Friend request rejected." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
});

app.get("/friends/:userId", async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    const result = await db.query(
      `
      SELECT u.id, u.username, u.photo_url
      FROM friends f
      JOIN users u ON u.id = f.friend_id
      WHERE f.user_id = $1
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch friends." });
  }
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
