-- test insertion of a new user
-- test insertion of a new user
INSERT INTO `USERS` (`id`, `username`, `password`, `email`, `role`, `createdAt`) VALUES
    (1, 'testuser', 'password123', 'testuser@hikarizsu.fr', 'USER', NOW()),
    (2, 'adminuser', 'adminpassword', 'admin@hikarizsu.fr', 'ADMIN', NOW());


    