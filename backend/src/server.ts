import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/user';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Portal backend is running'
  });
});

app.post('/api/login', async (req, res) => {
  try {
    const { userId, password, role } = req.body;

    if (
      typeof userId !== 'string' ||
      typeof password !== 'string' ||
      typeof role !== 'string' ||
      !userId.trim() ||
      !password ||
      !['General User', 'Admin'].includes(role)
    ) {
      return res.status(400).json({
        success: false,
        message: 'User ID, password and role are required'
      });
    }

    const validRole = role as 'General User' | 'Admin';

    const user = await User.findOne({
      userId: userId.trim(),
      role: validRole
    }).exec();

    console.log('Login attempt:', {
      userId: userId.trim(),
      role: validRole,
      userFound: Boolean(user)
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid User ID, Password or Role'
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    console.log('Password matches:', passwordMatches);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: 'Invalid User ID, Password or Role'
      });
    }

    return res.json({
      success: true,
      message: 'Login successful',
      user: {
        userId: user.userId,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);

    return res.status(500).json({
      success: false,
      message: 'Login failed due to a server error'
    });
  }
});

app.get('/api/users', async (req, res) => {
  const delay = Math.max(
    0,
    Math.min(Number(req.query.delay) || 0, 10000)
  );

  try {
    const role = String(req.query.role || '');
    const userId = String(req.query.userId || '');


    const query =
      role === 'Admin'
        ? {}
        : { userId };

    const users = await User.find(query)
      .select('userId name role')
      .lean()
      .exec();

    const records = users.map(user => ({
      userId: user.userId,
      name: user.name,
      role: user.role,
      accessLevel:
        user.role === 'Admin' ? 'Full Access' : 'Limited'
    }));

    setTimeout(() => {
      res.json({
        success: true,
        records
      });
    }, delay);
  } catch (error) {
    console.error('Get users error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to load users'
    });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const { userId, password, role, name } = req.body;

    if (
      typeof userId !== 'string' ||
      typeof password !== 'string' ||
      typeof name !== 'string' ||
      !userId.trim() ||
      !password ||
      !name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (
      typeof role !== 'string' ||
      !['General User', 'Admin'].includes(role)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const cleanUserId = userId.trim();
    const cleanName = name.trim();
    const validRole = role as 'General User' | 'Admin';

    const existingUser = await User.findOne({
      userId: cleanUserId
    }).exec();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists'
      });
    }

    await User.create({
      userId: cleanUserId,
      password,
      role: validRole,
      name: cleanName
    });

    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        userId: cleanUserId,
        name: cleanName,
        role: validRole
      }
    });
  } catch (error: any) {
    console.error('Add user error:', error);

    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'User ID already exists'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to create user'
    });
  }
});

app.delete('/api/users/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    if (userId === 'admin001') {
      return res.status(403).json({
        success: false,
        message: 'Main admin cannot be deleted'
      });
    }

    const deletedUser = await User.findOneAndDelete({
      userId
    }).exec();

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});

async function startServer() {
  try {
    await mongoose.connect(
      'mongodb://127.0.0.1:27017/portal'
    );

    console.log('MongoDB connected successfully');

    const demoUsers: {
      userId: string;
      password: string;
      role: 'General User' | 'Admin';
      name: string;
    }[] = [
      {
        userId: 'user001',
        password: 'user123',
        role: 'General User',
        name: 'General User'
      },
      {
        userId: 'user002',
        password: 'user456',
        role: 'General User',
        name: 'John User'
      },
      {
        userId: 'admin001',
        password: 'admin123',
        role: 'Admin',
        name: 'Admin User'
      }
    ];

    for (const demoUser of demoUsers) {
      const existingUser = await User.findOne({
        userId: demoUser.userId
      }).exec();

      if (!existingUser) {
        await User.create(demoUser);
        console.log(
          `Created demo account: ${demoUser.userId}`
        );
      }
    }

    console.log('Demo account initialization complete');

    app.listen(3000, () => {
      console.log(
        'Portal backend running on http://localhost:3000'
      );
    });
  } catch (error) {
    console.error('Backend startup failed:', error);
    process.exit(1);
  }
}

startServer();
