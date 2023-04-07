import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import schema from './gql';
import db from './db';
import config from './config';

const app = express();

if (db.retrieveUsersCount() === 0) {
  if (!config.defaults.user) {
    console.log(
      'Error ❌: Please provide a default user in the .env file to properly use this program'
    );
    process.exit(1);
  } else {
    db.createUser({
      name: config.defaults.user,
      bank_name: null,
      account_number: null,
    });

    console.log(
      `Success 🌱: Seeded the local database with the user: ${config.defaults.user}`
    );
  }
}

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

// add catch all routes
app.use('*', (req, res) => {
  res
    .status(404)
    .json({ message: 'Nothing to see here, try /graphql instead' });
});

app.listen(5151, () => console.log('App now listening on port 5151'));
