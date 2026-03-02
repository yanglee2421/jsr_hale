CREATE TABLE `sessions` (
	`id` integer PRIMARY KEY,
	`user_id` integer NOT NULL,
	`token` text UNIQUE,
	`expire_at` integer NOT NULL,
	`create_at` integer NOT NULL,
	`update_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY,
	`name` text,
	`email` text UNIQUE
);
