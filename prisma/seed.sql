-- Clear existing data
TRUNCATE TABLE "Notification", "Event", "GroupMember", "Group", "HelpRequest", "CareerListing", "BusinessListing", "Profile", "User" RESTART IDENTITY CASCADE;

-- Insert Users
INSERT INTO "User" (id, "mobileNumber", role, status, "createdAt", "updatedAt") VALUES
('u1', '+919876543210', 'ADMIN', 'ACTIVE', NOW(), NOW()),
('u2', '+919876543211', 'MEMBER', 'ACTIVE', NOW(), NOW()),
('u3', '+919876543212', 'MEMBER', 'ACTIVE', NOW(), NOW()),
('u4', '+919876543213', 'MEMBER', 'ACTIVE', NOW(), NOW()),
('u5', '+919876543214', 'MEMBER', 'ACTIVE', NOW(), NOW());

-- Insert Profiles
INSERT INTO "Profile" (id, "userId", "fullName", email, address, city, state, bio, "isVerified", "updatedAt") VALUES
('p1', 'u1', 'Admin User', 'admin@aryavysha.com', 'Mumbai, Maharashtra', 'Mumbai', 'Maharashtra', 'Platform Administrator', true, NOW()),
('p2', 'u2', 'Rajesh Kumar', 'rajesh.kumar@example.com', 'Bangalore, Karnataka', 'Bangalore', 'Karnataka', 'Software Engineer and Entrepreneur', true, NOW()),
('p3', 'u3', 'Priya Sharma', 'priya.sharma@example.com', 'Delhi', 'Delhi', 'Delhi', 'Business Owner - Textiles', true, NOW()),
('p4', 'u4', 'Sneha Reddy', 'sneha.reddy@example.com', 'Hyderabad, Telangana', 'Hyderabad', 'Telangana', 'HR Professional', true, NOW()),
('p5', 'u5', 'Amit Patel', 'amit.patel@example.com', 'Ahmedabad, Gujarat', 'Ahmedabad', 'Gujarat', 'Restaurant Owner', false, NOW());

-- Insert Business Listings
INSERT INTO "BusinessListing" (id, "userId", "businessName", category, description, address, "contactPhone", website, status, "createdAt", "updatedAt") VALUES
('b1', 'u3', 'Sharma Textiles', 'Retail', 'Premium quality traditional and modern fabrics. Family-owned business since 1975.', 'Chandni Chowk, Delhi', '+919876543212', 'https://sharmatextiles.com', 'APPROVED', NOW(), NOW()),
('b2', 'u5', 'Patel Sweets & Restaurant', 'Food & Beverage', 'Authentic Gujarati cuisine and traditional sweets.', 'Maninagar, Ahmedabad', '+919876543214', NULL, 'APPROVED', NOW(), NOW()),
('b3', 'u2', 'Kumar Tech Solutions', 'IT Services', 'Web development, mobile apps, and IT consulting services.', 'Koramangala, Bangalore', '+919876543211', 'https://kumartechsolutions.com', 'APPROVED', NOW(), NOW());

-- Insert Career Listings
INSERT INTO "CareerListing" (id, "userId", title, type, description, company, location, "salaryRange", status, "createdAt", "updatedAt") VALUES
('c1', 'u2', 'Senior Full Stack Developer', 'HIRING', 'Looking for an experienced full stack developer with expertise in React, Node.js, and PostgreSQL. 5+ years experience required.', 'Kumar Tech Solutions', 'Bangalore, Karnataka', '₹15-25 LPA', 'APPROVED', NOW(), NOW()),
('c2', 'u4', 'HR Manager Position', 'SEEKING', 'Experienced HR professional seeking new opportunities. 8 years experience in recruitment and employee relations.', 'Available for hire', 'Hyderabad, Telangana', '₹12-18 LPA', 'APPROVED', NOW(), NOW()),
('c3', 'u3', 'Sales Executive', 'HIRING', 'Looking for energetic sales professionals for our textile business.', 'Sharma Textiles', 'Delhi', '₹3-6 LPA', 'APPROVED', NOW(), NOW());

-- Insert Groups
INSERT INTO "Group" (id, name, description, "ownerId", "createdAt", "updatedAt") VALUES
('g1', 'Entrepreneurs Network', 'A group for business owners and entrepreneurs to share experiences and opportunities.', 'u2', NOW(), NOW()),
('g2', 'Tech Professionals', 'Connect with fellow IT professionals, share knowledge, and discuss latest technologies.', 'u2', NOW(), NOW()),
('g3', 'Cultural Events Committee', 'Planning and organizing community cultural events and celebrations.', 'u1', NOW(), NOW());

-- Insert Events
INSERT INTO "Event" (id, title, description, date, location, "organizerId", "createdAt", "updatedAt") VALUES
('e1', 'Diwali Celebration 2024', 'Join us for a grand Diwali celebration with cultural programs, food, and festivities.', '2024-11-01', 'Community Hall, Mumbai', 'u1', NOW(), NOW()),
('e2', 'Business Networking Meetup', 'Monthly networking event for entrepreneurs and business owners.', '2024-10-15', 'Bangalore Convention Center', 'u2', NOW(), NOW()),
('e3', 'Tech Talk: AI and Future', 'Discussion on AI trends and their impact on businesses.', '2024-10-20', 'Online (Zoom)', 'u2', NOW(), NOW());

-- Insert Notifications
INSERT INTO "Notification" (id, "userId", title, message, type, "isRead", "createdAt") VALUES
('n1', 'u2', 'Welcome to Arya Vyshya Community!', 'Complete your profile to unlock all features.', 'INFO', false, NOW()),
('n2', 'u3', 'Business Listing Approved', 'Your business "Sharma Textiles" has been approved and is now live!', 'SUCCESS', false, NOW()),
('n3', 'u4', 'New Event: Diwali Celebration', 'Don''t miss our grand Diwali celebration on November 1st!', 'INFO', false, NOW());
