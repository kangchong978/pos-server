# Database Management with Sequelize

This README provides instructions for managing the database schema using Sequelize migrations and seeders.

## Prerequisites

- Node.js and npm installed
- Sequelize CLI installed (`npm install -g sequelize-cli`)
- MySQL installed and running
- Project dependencies installed (`npm install`)

## Configuration

1. Ensure your `.env` file is set up with the correct database credentials:

```
DB_HOST=your_host
DB_PORT=your_port
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
```

2. Verify that `config/config.js` is correctly configured to use these environment variables.

## Commands

### Initialize Sequelize

If you haven't already set up Sequelize in your project:

```
npx sequelize-cli init
```

### Create a New Migration

To create a new migration file:

```
npx sequelize-cli migration:generate --name migration-name
```

Replace `migration-name` with a descriptive name for your migration.

### Run Migrations

To apply all pending migrations:

```
npx sequelize-cli db:migrate
```

### Undo Migrations

To revert the most recent migration:

```
npx sequelize-cli db:migrate:undo
```

To revert all migrations:

```
npx sequelize-cli db:migrate:undo:all
```

### Create a Seeder

To create a new seeder file:

```
npx sequelize-cli seed:generate --name seeder-name
```

Replace `seeder-name` with a descriptive name for your seeder.

### Run Seeders

To run all seeders:

```
npx sequelize-cli db:seed:all
```

### Undo Seeders

To revert the most recent seeder:

```
npx sequelize-cli db:seed:undo
```

To revert all seeders:

```
npx sequelize-cli db:seed:undo:all
```

## Common Scenarios

### Adding a New Table

1. Create a new migration: 
   ```
   npx sequelize-cli migration:generate --name create-new-table
   ```
2. Edit the migration file to define the new table structure.
3. Run the migration: 
   ```
   npx sequelize-cli db:migrate
   ```

### Adding a New Field to an Existing Table

1. Create a new migration: 
   ```
   npx sequelize-cli migration:generate --name add-field-to-table
   ```
2. Edit the migration file to add the new column.
3. Run the migration: 
   ```
   npx sequelize-cli db:migrate
   ```

### Modifying an Existing Field

1. Create a new migration: 
   ```
   npx sequelize-cli migration:generate --name modify-field-in-table
   ```
2. Edit the migration file to change the column definition.
3. Run the migration: 
   ```
   npx sequelize-cli db:migrate
   ```

### Removing a Field or Table

1. Create a new migration: 
   ```
   npx sequelize-cli migration:generate --name remove-field-or-table
   ```
2. Edit the migration file to remove the column or table.
3. Run the migration: 
   ```
   npx sequelize-cli db:migrate
   ```

## Best Practices

- Always version control your migration and seeder files.
- Test migrations and seeders in a development environment before applying to production.
- Use meaningful names for migrations and seeders.
- Keep migrations small and focused on specific changes.
- Regularly backup your database before applying migrations in production.

## Troubleshooting

If you encounter issues:

1. Ensure all dependencies are installed and up to date.
2. Check that your database credentials in `.env` are correct.
3. Verify that your `config/config.js` file is correctly set up.
4. Use the `--debug` flag with Sequelize commands for more detailed output.

For more information, refer to the [Sequelize documentation](https://sequelize.org/master/manual/migrations.html).